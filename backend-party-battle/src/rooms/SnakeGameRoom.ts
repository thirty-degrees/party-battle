import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellKind, CellSchema, fromCell, toCell } from 'types-party-battle/types/snake/CellSchema'
import {
  Direction,
  DIRECTIONS,
  RemainingPlayer,
  RemainingPlayerSchema,
  toRemainingPlayer,
} from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { getDeaths } from '../games/snake/getDeaths'
import { getMovementIntention, MovementIntention } from '../games/snake/getMovementIntention'
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
  private directionQueue: Map<string, Direction[]> = new Map()

  override getGameType(): GameType {
    return SnakeGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: RGBColor }[] }) {
    const playerNames = options.players.map((player) => player.name)
    const randomlySortedPlayerNames = playerNames.sort(() => Math.random() - 0.5)
    const { board, width, height, directions, bodies } = createInitialBoard(randomlySortedPlayerNames)
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

        let queue = this.directionQueue.get(playerName)
        if (!queue) {
          queue = []
          this.directionQueue.set(playerName, queue)
        }
        queue.push(direction)
      },
      (payload) => {
        if (!isValidDirection(payload)) {
          throw new Error('Invalid payload')
        }
        return payload
      }
    )

    randomlySortedPlayerNames.forEach((playerName) => {
      const remainingPlayerSchema = new RemainingPlayerSchema(playerName)
      this.state.remainingPlayers.push(remainingPlayerSchema)

      this.lastMovementDirections.set(playerName, directions[playerName])
      this.directionQueue.set(playerName, [])
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.state.status = 'playing'

    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / STEPS_PER_SECOND)
  }

  update(_deltaTime: number) {
    if (this.state.status !== 'playing') {
      return
    }

    const board = this.state.board.map(toCell)
    const remainingPlayers = this.state.remainingPlayers.map(toRemainingPlayer)

    const directions = this.getDirectionsForPlayers(remainingPlayers)
    const intentions = this.getIntentions(remainingPlayers, directions)
    const deaths = getDeaths(intentions, board, this.state.width, this.state.height)

    const survivingIntentions: Record<string, MovementIntention> = Object.fromEntries(
      Object.entries(intentions).filter(([playerName]) => !deaths.has(playerName))
    )
    this.applyMovementIntentions(survivingIntentions)
    this.applyDeaths(deaths)
  }

  private getIntentions(
    remainingPlayers: RemainingPlayer[],
    directions: Map<string, Direction>
  ): Record<string, MovementIntention> {
    return Object.fromEntries(
      remainingPlayers.map((player) => [
        player.name,
        getMovementIntention(this.bodies.get(player.name), directions.get(player.name), this.state.width),
      ])
    )
  }

  private getDirectionsForPlayers(players: RemainingPlayer[]): Map<string, Direction> {
    const directions = new Map<string, Direction>()

    for (const player of players) {
      const queue = this.directionQueue.get(player.name) || []
      const lastDirection = this.lastMovementDirections.get(player.name)

      let chosenDirection = lastDirection

      while (queue.length > 0) {
        const candidateDirection = queue.shift()!
        if (!lastDirection || !isOppositeDirection(lastDirection, candidateDirection)) {
          chosenDirection = candidateDirection
          break
        }
      }

      directions.set(player.name, chosenDirection)
    }

    return directions
  }

  private applyMovementIntentions(intentions: Record<string, MovementIntention>) {
    for (const [, intention] of Object.entries(intentions)) {
      const tailIndex = intention.tail
      const tailCell = this.state.board[tailIndex]
      tailCell.kind = CellKind.Empty
      tailCell.player = undefined
      tailCell.isHead = undefined
    }

    for (const [playerName, intention] of Object.entries(intentions)) {
      const body = this.bodies.get(playerName)
      const oldHeadIndex = body[body.length - 1]
      const oldHeadCell = this.state.board[oldHeadIndex]
      oldHeadCell.isHead = undefined

      const headIndex = intention.head.y * this.state.width + intention.head.x
      body.push(headIndex)
      body.shift()
      const headCell = this.state.board[headIndex]
      headCell.kind = CellKind.Snake
      headCell.player = playerName
      headCell.isHead = true
      this.lastMovementDirections.set(playerName, intention.direction)
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
            c.isHead = undefined
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
        this.directionQueue.delete(name)
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
