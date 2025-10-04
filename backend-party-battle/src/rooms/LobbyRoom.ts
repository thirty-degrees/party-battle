import { Client, matchMaker, Room, ServerError } from '@colyseus/core'
import { humanId } from 'human-id'
import {
  MAX_AMOUNT_OF_PLAYERS,
  PLAYER_COLORS,
  PLAYER_NAME_MAX_LENGTH,
} from 'types-party-battle/consts/config'
import { GameHistory, GameHistorySchema } from 'types-party-battle/types/GameHistorySchema'
import { GAME_TYPES, GameType } from 'types-party-battle/types/GameSchema'
import { LobbyPlayerSchema } from 'types-party-battle/types/LobbyPlayerSchema'
import { LobbySchema } from 'types-party-battle/types/LobbySchema'
import { RGBColor, rgbColorEquals, toRgbColor } from 'types-party-battle/types/RGBColorSchema'
import { ScoreSchema } from 'types-party-battle/types/ScoreSchema'
import { gameRooms } from '../app.config'

export class LobbyRoom extends Room<LobbySchema> {
  private readonly IDS_CHANNEL = '$lobby-ids'
  private playerColors: RGBColor[] = []

  private async generateRoomId(roomId?: string): Promise<string> {
    const current = await this.presence.smembers(this.IDS_CHANNEL)
    let id: string
    if (roomId && roomId.length >= 8 && roomId.length <= 19 && !current.includes(roomId)) {
      id = roomId
    } else {
      do {
        id = humanId()
      } while (current.includes(id))
    }
    await this.presence.sadd(this.IDS_CHANNEL, id)
    return id
  }

  private initializePlayerColors(): void {
    const shuffledColors = [...PLAYER_COLORS].sort(() => Math.random() - 0.5)
    this.playerColors = shuffledColors
  }

  private initializeEnabledGameTypes(): void {
    const availableGameTypes = this.getAllGameTypes()
    availableGameTypes.forEach((gameType) => {
      this.state.enabledGameTypes.push(gameType)
    })
  }

  private getAllGameTypes() {
    return gameRooms.map((gameRoom) => gameRoom.gameType)
  }

  private getFreePlayerColor(): RGBColor {
    const usedColors = Array.from(this.state.players.values()).map((p) => toRgbColor(p.color))
    for (const color of this.playerColors) {
      const isUsed = usedColors.some((usedColor) => rgbColorEquals(color, usedColor))
      if (!isUsed) return color
    }
    throw new ServerError(4113, 'No colors available')
  }

  async onCreate(options: { name: string; roomId?: string }) {
    this.roomId = await this.generateRoomId(options.roomId)
    console.log(`LobbyRoom.onCreate: roomId: '${this.roomId}'`)

    this.autoDispose = true
    this.maxClients = MAX_AMOUNT_OF_PLAYERS
    this.state = new LobbySchema()

    this.initializePlayerColors()
    this.initializeEnabledGameTypes()

    this.registerSetPlayerReady()
    this.registerSetEnableGameType()
    this.registerScoreSubscription()
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`LobbyRoom.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`)
    if (options.name.length > PLAYER_NAME_MAX_LENGTH) {
      throw new ServerError(4111, 'Player name too long')
    }
    if ([...this.state.players.values()].some((player) => player.name === options.name)) {
      throw new ServerError(4111, 'Player name already taken')
    }
    const player = new LobbyPlayerSchema(options.name, this.getFreePlayerColor(), false)
    this.state.players.set(client.sessionId, player)
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`LobbyRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`)
    if (!this.state.players.has(client.sessionId)) {
      return
    }
    this.state.players.delete(client.sessionId)
  }

  async onDispose() {
    console.log(`LobbyRoom.onDispose: roomId: '${this.roomId}'`)
    await this.presence.srem(this.IDS_CHANNEL, this.roomId)
  }

  private registerSetPlayerReady() {
    this.onMessage<boolean>(
      'SetPlayerReady',
      async (client: Client, ready: boolean) => {
        const player = this.state.players.get(client.sessionId)
        console.log(
          `LobbyRoom.onMessage(SetPlayerReady): roomId: '${this.roomId}', playerName: '${player.name}', ready: ${ready}`
        )

        player.ready = ready

        if (this.areAllPlayersReady()) {
          const nextGameType = this.getNextGameType()
          await this.createGameRoom(nextGameType)
        }
      },
      (payload) => {
        if (typeof payload !== 'boolean') {
          throw new Error('Invalid payload')
        }
        return payload
      }
    )
  }

  private registerSetEnableGameType() {
    this.onMessage<{ gameType: GameType; enabled: boolean }>(
      'SetEnableGameType',
      async (client: Client, { gameType, enabled }) => {
        const player = this.state.players.get(client.sessionId)
        console.log(
          `LobbyRoom.onMessage(SetEnableGameType): roomId: '${this.roomId}', playerName: '${player.name}', gameType: '${gameType}', enabled: ${enabled}`
        )

        const currentIndex = this.state.enabledGameTypes.indexOf(gameType)
        const isCurrentlyEnabled = currentIndex !== -1

        if (enabled && !isCurrentlyEnabled) {
          this.state.enabledGameTypes.push(gameType)
        } else if (!enabled && isCurrentlyEnabled) {
          this.state.enabledGameTypes.splice(currentIndex, 1)
        }
      },
      (payload: unknown) => {
        if (
          typeof payload !== 'object' ||
          payload === null ||
          !('gameType' in payload) ||
          !('enabled' in payload)
        ) {
          throw new Error('Invalid payload')
        }
        const typedPayload = payload as { gameType: string; enabled: boolean }
        if (typeof typedPayload.gameType !== 'string' || typeof typedPayload.enabled !== 'boolean') {
          throw new Error('Invalid payload')
        }
        if (!GAME_TYPES.includes(typedPayload.gameType as GameType)) {
          throw new Error('Invalid game type')
        }
        return typedPayload as { gameType: GameType; enabled: boolean }
      }
    )
  }

  private registerScoreSubscription() {
    this.presence.subscribe('score-' + this.roomId, (data: GameHistory) => {
      console.log(`LobbyRoom.presence.subscribe(score-${this.roomId})}`)

      const gameHistory = new GameHistorySchema(data.gameType)
      data.scores.forEach((score) => {
        const scoreSchema = new ScoreSchema(score.playerName, score.value)
        gameHistory.scores.push(scoreSchema)
      })
      this.state.gameHistories.push(gameHistory)

      this.state.players.forEach((player) => {
        player.ready = false
      })
      this.state.currentGameRoomId = null
      this.state.currentGame = null
    })
  }

  private areAllPlayersReady(): boolean {
    const allPlayers = Array.from(this.state.players.values())
    const allReady = allPlayers.every((player) => player.ready)

    return allReady && allPlayers.length >= 2
  }

  private async createGameRoom(gameType: GameType): Promise<void> {
    console.log(`LobbyRoom.createGameRoom: lobbyRoomId: '${this.roomId}', gameType: '${gameType}'`)

    const roomName = gameRooms.find((gameRoom) => gameRoom.gameType === gameType)?.roomName

    console.log(
      `LobbyRoom.createGameRoom: players: ${JSON.stringify(
        Array.from(this.state.players.values()).map((player) => ({
          name: player.name,
          color: toRgbColor(player.color),
        }))
      )}`
    )

    const gameRoom = await matchMaker.createRoom(roomName, {
      lobbyRoomId: this.roomId,
      players: Array.from(this.state.players.values()).map((player) => ({
        name: player.name,
        color: toRgbColor(player.color),
      })),
    })

    this.state.currentGame = gameType
    this.state.currentGameRoomId = gameRoom.roomId
  }

  private getNextGameType(): GameType {
    const enabled = Array.from(this.state.enabledGameTypes ?? [])
    const basePool = enabled.length > 0 ? enabled : this.getAllGameTypes()
    const lastType =
      this.state.gameHistories.length > 0
        ? this.state.gameHistories[this.state.gameHistories.length - 1].gameType
        : undefined
    const availableTypes =
      basePool.length > 1 && lastType !== undefined ? basePool.filter((t) => t !== lastType) : basePool

    const counts = new Map<GameType, number>(availableTypes.map((t) => [t, 0]))
    for (const h of this.state.gameHistories) {
      if (counts.has(h.gameType)) counts.set(h.gameType, (counts.get(h.gameType) as number) + 1)
    }

    let min = Infinity
    for (const t of availableTypes) min = Math.min(min, counts.get(t) as number)

    const least = availableTypes.filter((t) => (counts.get(t) as number) === min)
    return least[Math.floor(Math.random() * least.length)]
  }
}
