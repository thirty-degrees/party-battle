import { cli, Options } from '@colyseus/loadtest'
import { Client, Room } from 'colyseus.js'
import { humanId } from 'human-id'
import { GameSchema, GameType } from 'types-party-battle/types/GameSchema'
import { LobbySchema } from 'types-party-battle/types/LobbySchema'

type JoinOptions = {
  name: string
}

async function joinGame(
  endpoint: string,
  playerName: string,
  gameType: GameType,
  roomId: string
): Promise<void> {
  const client = new Client(endpoint)
  const gameRoom = await client.joinById<GameSchema>(roomId, {
    name: playerName,
  })

  gameRoom.onStateChange((state) => {
    if (state.status === 'finished') {
      gameRoom.leave()
    }
  })
}

async function joinLobbyAndReady(
  endpoint: string,
  roomName: string,
  customName?: string,
  isReady: boolean = true,
  delayMs: number = 0,
  botIndex: number = 0
): Promise<void> {
  const client = new Client(endpoint)
  const name = customName || `Bot-${humanId().substring(0, 11).padEnd(11, '0')}`
  const options: JoinOptions = { name }
  const room: Room<LobbySchema> = await client.joinOrCreate<LobbySchema>(roomName, options)

  room.onStateChange((state) => {
    if (state.currentGame && state.currentGameRoomId) {
      joinGame(endpoint, name, state.currentGame, state.currentGameRoomId)
    }
  })

  if (isReady) {
    if (delayMs > 0) {
      const staggeredDelay = delayMs * (botIndex + 1)
      setTimeout(() => {
        room.send('SetPlayerReady', true)
      }, staggeredDelay)
    } else {
      room.send('SetPlayerReady', true)
    }
  }
  room.onLeave(() => {})
}

async function joinLobbyWithNamedBots(
  endpoint: string,
  roomName: string,
  readyIndexes?: number[],
  delayMs: number = 0
): Promise<void> {
  // Names used for the bots in the Store Screenshots
  const botNames = ['Lara', 'Noah', 'Lea', 'Nina', 'Jonas', 'Sophie', 'Fabio']

  const promises = botNames.map((name, index) =>
    joinLobbyAndReady(
      endpoint,
      roomName,
      name,
      readyIndexes === undefined || readyIndexes.includes(index),
      delayMs,
      index
    )
  )

  await Promise.all(promises)
}

function getReadyIndexes(): number[] | undefined {
  const readyIndexArg = process.argv.find((arg) => arg.startsWith('--ready-index='))
  if (readyIndexArg) {
    const indexesStr = readyIndexArg.split('=')[1]
    const indexes = indexesStr.split(',').map((str) => parseInt(str.trim()))
    const validIndexes = indexes.filter((index) => !isNaN(index))
    return validIndexes.length > 0 ? validIndexes : undefined
  }
  return undefined
}

function getDelayMs(): number {
  const delayArg = process.argv.find((arg) => arg.startsWith('--delay='))
  if (delayArg) {
    const delayStr = delayArg.split('=')[1]
    const delay = parseInt(delayStr)
    return isNaN(delay) ? 0 : delay
  }
  return 0
}

export async function main(options: Options) {
  const readyIndexes = getReadyIndexes()
  const delayMs = getDelayMs()
  await joinLobbyAndReady(
    options.endpoint,
    options.roomName,
    undefined,
    readyIndexes === undefined,
    delayMs,
    0
  )
}

export async function namedBots(options: Options) {
  const readyIndexes = getReadyIndexes()
  const delayMs = getDelayMs()
  await joinLobbyWithNamedBots(options.endpoint, options.roomName, readyIndexes, delayMs)
}

if (process.argv.includes('--named-bots')) {
  cli(namedBots)
} else {
  cli(main)
}
