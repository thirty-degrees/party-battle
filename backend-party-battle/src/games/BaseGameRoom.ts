import { Client, Delayed, Room } from '@colyseus/core'
import { MAX_AMOUNT_OF_PLAYERS } from 'types-party-battle/consts/config'
import { GameHistory } from 'types-party-battle/types/GameHistorySchema'
import { GameSchema, GameType } from 'types-party-battle/types/GameSchema'
import { PlayerSchema } from 'types-party-battle/types/PlayerSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'

type PlayerName = string
type PlayerSessionId = string

export abstract class BaseGameRoom<S extends GameSchema> extends Room<S> {
  protected playerConnections = new Map<PlayerName, PlayerSessionId | null>()
  private lobbyRoomId: string
  private gameStartTimeout: Delayed | null = null
  private minimumWaitTimeout: Delayed | null = null

  onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    console.log(
      `${this.constructor.name}.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`
    )

    this.autoDispose = true
    this.maxClients = MAX_AMOUNT_OF_PLAYERS

    this.lobbyRoomId = options.lobbyRoomId

    options.players.forEach((player) => {
      this.playerConnections.set(player.name, null)
      const playerSchema = new PlayerSchema(player.name, player.color)
      this.state.players.push(playerSchema)
    })
  }

  protected finishGame() {
    const gameHistory: GameHistory = {
      gameType: this.getGameType(),
      scores: this.getScores(),
    }

    this.presence.publish('score-' + this.lobbyRoomId, gameHistory)
    this.state.status = 'finished'
  }

  protected startGameWhenReady() {
    this.clearGameStartTimeouts()

    this.minimumWaitTimeout = this.clock.setTimeout(() => {
      this.minimumWaitTimeout = null
      if (this.allPlayersConnected()) {
        this.clearGameStartTimeouts()
        this.startGame()
      }
    }, 1000)

    this.gameStartTimeout = this.clock.setTimeout(() => {
      this.clearGameStartTimeouts()
      this.startGame()
    }, 7000)
  }

  protected abstract startGame(): void

  abstract getScores(): Score[]

  abstract getGameType(): GameType

  onJoin(client: Client, options: { name: string }) {
    console.log(`${this.constructor.name}.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`)

    if (this.playerConnections.has(options.name)) {
      this.playerConnections.set(options.name, client.sessionId)

      if (this.allPlayersConnected() && this.minimumWaitTimeout === null && this.state.status === 'waiting') {
        this.clearGameStartTimeouts()
        this.startGame()
      }
    } else {
      console.log(`${this.constructor.name}.onJoin: playerName: '${options.name}' is not part of the game`)
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`${this.constructor.name}.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`)

    this.playerConnections?.forEach((sessionId, playerName) => {
      if (sessionId === client.sessionId) {
        this.playerConnections.set(playerName, null)
      }
    })
  }

  onDispose() {
    console.log(`${this.constructor.name}.onDispose: roomId: '${this.roomId}'`)
    this.clearGameStartTimeouts()
  }

  protected findPlayerBySessionId(sessionId: string): string | undefined {
    for (const [name, session] of this.playerConnections.entries()) {
      if (session === sessionId) {
        return name
      }
    }
    return undefined
  }

  private clearGameStartTimeouts() {
    if (this.minimumWaitTimeout) {
      this.minimumWaitTimeout.clear()
      this.minimumWaitTimeout = null
    }
    if (this.gameStartTimeout) {
      this.gameStartTimeout.clear()
      this.gameStartTimeout = null
    }
  }

  private allPlayersConnected(): boolean {
    return Array.from(this.playerConnections.values()).every((sessionId) => sessionId !== null)
  }
}
