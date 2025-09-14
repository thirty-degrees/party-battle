import { Client, matchMaker, Room, ServerError } from '@colyseus/core'
import { humanId } from 'human-id'
import {
  GameHistory,
  GameHistorySchema,
  GameType,
  LobbyPlayerSchema,
  LobbySchema,
  MAX_AMOUNT_OF_PLAYERS,
  PLAYER_NAME_MAX_LENGTH,
  ScoreSchema,
} from 'types-party-battle'
import { gameRooms } from '../app.config'

export class LobbyRoom extends Room<LobbySchema> {
  private readonly IDS_CHANNEL = '$lobby-ids'

  private async generateRoomId(): Promise<string> {
    const current = await this.presence.smembers(this.IDS_CHANNEL)
    let id: string
    do {
      id = humanId()
    } while (current.includes(id))
    await this.presence.sadd(this.IDS_CHANNEL, id)
    return id
  }

  async onCreate(_options: { name: string }) {
    this.roomId = await this.generateRoomId()
    console.log(`LobbyRoom.onCreate: roomId: '${this.roomId}'`)

    this.autoDispose = true
    this.maxClients = MAX_AMOUNT_OF_PLAYERS
    this.state = new LobbySchema()

    this.registerSetPlayerReady()
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
    const player = new LobbyPlayerSchema(options.name, false)
    this.state.players.set(client.sessionId, player)
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`LobbyRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`)
    this.state.players.delete(client.sessionId)
  }

  async onDispose() {
    console.log(`LobbyRoom.onDispose: roomId: '${this.roomId}'`)
    await this.presence.srem(this.IDS_CHANNEL, this.roomId)
  }

  private registerSetPlayerReady() {
    this.onMessage('SetPlayerReady', async (client: Client, ready: boolean) => {
      const player = this.state.players.get(client.sessionId)
      console.log(
        `LobbyRoom.onMessage(SetPlayerReady): roomId: '${this.roomId}', playerName: '${player.name}', ready: ${ready}`
      )

      player.ready = ready

      if (this.areAllPlayersReady()) {
        const nextGameType = this.getNextGameType()
        await this.createGameRoom(nextGameType)
      }
    })
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

    const gameRoom = await matchMaker.createRoom(roomName, {
      lobbyRoomId: this.roomId,
      playerNames: Array.from(this.state.players.values()).map((player) => player.name),
    })

    this.state.currentGame = gameType
    this.state.currentGameRoomId = gameRoom.roomId
  }

  private getNextGameType(): GameType {
    const availableTypes = gameRooms.map((gameRoom) => gameRoom.gameType)

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
