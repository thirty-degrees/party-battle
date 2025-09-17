import { GameType } from 'types-party-battle/types/GameSchema'
import {
  POTATO_DIRECTIONS,
  PotatoDirection,
  PotatoGameSchema,
} from 'types-party-battle/types/potato/PotatoGameSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { getPlayerAcrossOf } from '../games/potato/getPlayerAcrossOf'
import { getPlayerLeftOf } from '../games/potato/getPlayerLeftOf'
import { getPlayerRightOf } from '../games/potato/getPlayerRightOf'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

const DIRECTION_FUNCTIONS: Record<
  PotatoDirection,
  (players: string[], currentPlayer: string) => string | null
> = {
  left: getPlayerLeftOf,
  right: getPlayerRightOf,
  across: getPlayerAcrossOf,
}

function isValidPotatoDirection(value: unknown): value is PotatoDirection {
  return typeof value === 'string' && POTATO_DIRECTIONS.includes(value as PotatoDirection)
}

const POTATO_COUNTDOWN_MIN_SECONDS = 8
const POTATO_COUNTDOWN_MAX_SECONDS = 15

export class PotatoGameRoom extends BaseGameRoom<PotatoGameSchema> {
  static readonly gameType: GameType = 'potato'
  static readonly roomName: string = 'potato_game_room'

  private eliminatedPlayers: string[] = []

  override getGameType(): GameType {
    return PotatoGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: string }[] }) {
    this.state = new PotatoGameSchema('waiting')

    super.onCreate(options)

    options.players.forEach((player) => {
      this.state.remainingPlayers.push(player.name)
    })

    this.state.message = '...'

    this.clock.setTimeout(() => {
      this.startRound()
    }, 1000)

    this.onMessage<PotatoDirection>(
      'PassPotato',
      (client, message) => {
        const playerName = this.findPlayerBySessionId(client.sessionId)

        if (!this.isPlayerInGame(playerName)) {
          return
        }

        if (this.state.status !== 'playing') {
          return
        }

        if (this.state.playerWithPotato !== playerName) {
          return
        }

        const newPlayerWithPotato = this.getAdjacentPlayer(playerName, message)

        if (newPlayerWithPotato === null) {
          return
        }

        this.state.playerWithPotato = newPlayerWithPotato
      },
      (payload) => {
        if (!isValidPotatoDirection(payload)) {
          throw new Error('Invalid payload')
        }
        return payload
      }
    )
  }

  private findPlayerBySessionId(sessionId: string): string | undefined {
    for (const [name, session] of this.playerConnections.entries()) {
      if (session === sessionId) {
        return name
      }
    }
    return undefined
  }

  private isPlayerInGame(playerName: string | undefined): boolean {
    return playerName !== undefined && this.state.remainingPlayers.includes(playerName)
  }

  private getAdjacentPlayer(playerName: string, direction: PotatoDirection): string | null {
    const directionFunction = DIRECTION_FUNCTIONS[direction]

    return directionFunction(this.state.remainingPlayers, playerName)
  }

  private startRound() {
    const countdownSeconds = this.getRandomCountdownSeconds()
    this.state.message = countdownSeconds.toString()
    const randomIndex = Math.floor(Math.random() * this.state.remainingPlayers.length)
    this.state.playerWithPotato = this.state.remainingPlayers[randomIndex]
    this.state.status = 'playing'

    this.clock.setTimeout(() => {
      this.state.message = (countdownSeconds - 1).toString()
    }, 1000)

    this.clock.setTimeout(() => {
      this.state.message = (countdownSeconds - 2).toString()
    }, 2000)

    this.clock.setTimeout(() => {
      this.state.message = ''
    }, 3000)

    this.clock.setTimeout(() => {
      this.endRound()
    }, countdownSeconds * 1000)
  }

  private endRound() {
    this.state.message = 'BOOM!'
    this.state.status = 'waiting'

    const eliminatedPlayerIndex = this.state.remainingPlayers.indexOf(this.state.playerWithPotato)
    const eliminatedPlayer = this.state.remainingPlayers.splice(eliminatedPlayerIndex, 1)[0]
    this.eliminatedPlayers.push(eliminatedPlayer)

    this.clock.setTimeout(() => {
      if (this.state.remainingPlayers.length > 1) {
        this.startRound()
      } else {
        this.finishGame()
      }
    }, 3000)
  }

  private getRandomCountdownSeconds(): number {
    return (
      Math.floor(Math.random() * (POTATO_COUNTDOWN_MAX_SECONDS - POTATO_COUNTDOWN_MIN_SECONDS + 1)) +
      POTATO_COUNTDOWN_MIN_SECONDS
    )
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = []

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([playerName])
    }

    playerGroups.push([...this.state.remainingPlayers])

    return assignScoresByOrder(playerGroups)
  }
}
