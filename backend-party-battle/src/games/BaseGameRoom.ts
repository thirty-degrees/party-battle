import { Client, Room } from '@colyseus/core'
import { MAX_AMOUNT_OF_PLAYERS } from 'types-party-battle/consts/config'
import { GameHistory } from 'types-party-battle/types/GameHistorySchema'
import { GameSchema, GameType } from 'types-party-battle/types/GameSchema'
import { PlayerSchema } from 'types-party-battle/types/PlayerSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'

type PlayerName = string
type PlayerSessionId = string

export abstract class BaseGameRoom<S extends GameSchema> extends Room<S> {
  protected playerConnections = new Map<PlayerName, PlayerSessionId | null>()
  private lobbyRoomId: string

  onCreate(options: { lobbyRoomId: string; playerNames: string[] }) {
    console.log(
      `${this.constructor.name}.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`
    )

    this.autoDispose = true
    this.maxClients = MAX_AMOUNT_OF_PLAYERS

    this.lobbyRoomId = options.lobbyRoomId

    options.playerNames.forEach((playerName) => {
      this.playerConnections.set(playerName, null)
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

  abstract getScores(): Score[]

  abstract getGameType(): GameType

  onJoin(client: Client, options: { name: string }) {
    console.log(`${this.constructor.name}.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`)

    if (this.playerConnections.has(options.name)) {
      this.playerConnections.set(options.name, client.sessionId)

      const playerSchema = new PlayerSchema(options.name)
      this.state.players.push(playerSchema)
    } else {
      console.log(`${this.constructor.name}.onJoin: playerName: '${options.name}' is not part of the game`)
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`${this.constructor.name}.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`)

    this.playerConnections?.forEach((sessionId, playerName) => {
      if (sessionId === client.sessionId) {
        this.playerConnections.set(playerName, null)

        const playerIndex = this.state.players.findIndex((player) => player.name === playerName)
        if (playerIndex !== -1) {
          this.state.players.splice(playerIndex, 1)
        }
      }
    })
  }

  onDispose() {
    console.log(`${this.constructor.name}.onDispose: roomId: '${this.roomId}'`)
  }
}
