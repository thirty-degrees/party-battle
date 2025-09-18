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

async function joinLobbyAndReady(endpoint: string, roomName: string): Promise<void> {
  const client = new Client(endpoint)
  const name = `Bot-${humanId().substring(0, 11).padEnd(11, '0')}`
  const options: JoinOptions = { name }
  const room: Room<LobbySchema> = await client.joinOrCreate<LobbySchema>(roomName, options)

  room.onStateChange((state) => {
    if (state.currentGame && state.currentGameRoomId) {
      joinGame(endpoint, name, state.currentGame, state.currentGameRoomId)
    }
  })

  room.send('SetPlayerReady', true)
  room.onLeave(() => {})
}

export async function main(options: Options) {
  await joinLobbyAndReady(options.endpoint, options.roomName)
}

cli(main)
