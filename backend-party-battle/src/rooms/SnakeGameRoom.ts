import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellKind, CellSchema, fromCell, toCell } from 'types-party-battle/types/snake/CellSchema'
import {
  Direction,
  DIRECTIONS,
  RemainingPlayerSchema,
  toRemainingPlayer,
} from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { getDeaths } from '../games/snake/getDeaths'
import { getMovementIntentions, MovementIntention } from '../games/snake/getMovementIntentions'
import { isOppositeDirection } from '../games/snake/isOppositeDirection'
import { assignScoresByRank } from '../scores/assignScoresByRank'

const STEPS_PER_SECOND = 3

function isValidDirection(value: unknown): value is Direction {
  return typeof value === 'string' && DIRECTIONS.includes(value as Direction)
}

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[][] = []
  private bodies: Map<string, number[]> = new Map()
  private lastMovementDirections: Map<string, Direction> = new Map()

  override getGameType(): GameType {
    return SnakeGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    const playerNames = options.players.map((player) => player.name)
    const { board, width, height, directions, bodies } = createInitialBoard(playerNames)
    this.bodies = bodies

    const boardSchema = new ArraySchema<CellSchema>()
    board.forEach((cell) => {
      boardSchema.push(fromCell(cell))
    })

    this.state = new SnakeGameSchema('waiting', width, height, boardSchema)

    super.onCreate(options)

    this.onMessage<Direction>(
      'ChangeDirection',
      (client, direction) => {
        console.log('ChangeDirection', direction)
        const playerName = this.findPlayerBySessionId(client.sessionId)

        if (!this.isPlayerInGame(playerName)) {
          return
        }

        if (this.state.status !== 'playing') {
          return
        }

        const lastMovementDirection = this.lastMovementDirections.get(playerName)
        if (lastMovementDirection && isOppositeDirection(lastMovementDirection, direction)) {
          return
        }

        for (let i = 0; i < this.state.remainingPlayers.length; i++) {
          if (this.state.remainingPlayers[i].name === playerName) {
            this.state.remainingPlayers[i].direction = direction
            break
          }
        }
      },
      (payload) => {
        if (!isValidDirection(payload)) {
          throw new Error('Invalid payload')
        }
        return payload
      }
    )

    playerNames.forEach((playerName) => {
      const remainingPlayerSchema = new RemainingPlayerSchema(playerName, directions[playerName])
      this.state.remainingPlayers.push(remainingPlayerSchema)

      this.lastMovementDirections.set(playerName, directions[playerName])
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / STEPS_PER_SECOND)

    this.state.status = 'playing'
  }

  update(_deltaTime: number) {
    const board = this.state.board.map(toCell)
    const remainingPlayers = this.state.remainingPlayers.map(toRemainingPlayer)

    const intentions = getMovementIntentions(remainingPlayers, this.bodies, this.state.width)
    const deaths = getDeaths(intentions, board, this.state.width, this.state.height)

    this.applyMovementIntentions(intentions.filter((intention) => !deaths.has(intention.name)))
    this.applyDeaths(deaths)
  }

  private applyMovementIntentions(intentions: MovementIntention[]) {
    for (const intention of intentions) {
      const body = this.bodies.get(intention.name)
      const tailIndex = body[0]
      const tailCell = this.state.board[tailIndex]
      tailCell.kind = CellKind.Empty
      tailCell.player = undefined
    }

    for (const intention of intentions) {
      const body = this.bodies.get(intention.name)
      const headIndex = intention.head.y * this.state.width + intention.head.x
      body.push(headIndex)
      body.shift()
      const headCell = this.state.board[headIndex]
      headCell.kind = CellKind.Snake
      headCell.player = intention.name
      this.lastMovementDirections.set(intention.name, intention.direction)
    }
  }

  private applyDeaths(deaths: Set<string>) {
    if (deaths.size > 0) {
      const names = Array.from(deaths)
      const eliminatedThisTurn: string[] = []

      for (const name of names) {
        const body = this.bodies.get(name)
        if (body) {
          for (const idx of body) {
            const c = this.state.board[idx]
            c.kind = CellKind.Empty
            c.player = undefined
          }
          this.bodies.delete(name)
        }
        for (let i = 0; i < this.state.remainingPlayers.length; i++) {
          if (this.state.remainingPlayers[i].name === name) {
            this.state.remainingPlayers.splice(i, 1)
            break
          }
        }
        this.lastMovementDirections.delete(name)
        eliminatedThisTurn.push(name)
      }

      this.eliminatedPlayers.push(eliminatedThisTurn)
    }

    if (this.state.remainingPlayers.length <= 1) {
      this.finishGame()
    }
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = []

    playerGroups.push([...this.state.remainingPlayers.map((player) => player.name)])

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([...playerName])
    }

    return assignScoresByRank(playerGroups)
  }

  private isPlayerInGame(playerName: string): boolean {
    return this.state.remainingPlayers.some((player) => player.name === playerName)
  }
}
