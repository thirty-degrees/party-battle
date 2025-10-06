import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { RGBColor } from 'types-party-battle/types/RGBColorSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellKind, CellSchema, fromCell, toCell } from 'types-party-battle/types/snake/CellSchema'
import { Direction, DIRECTIONS } from 'types-party-battle/types/snake/DirectionSchema'
import { SNAKE_TICK_MS, SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { getDeaths } from '../games/snake/getDeaths'
import { getMovementIntention, MovementIntention } from '../games/snake/getMovementIntention'
import { isOppositeDirection } from '../games/snake/isOppositeDirection'
import { assignScoresByRank } from '../scores/assignScoresByRank'

function isValidDirection(value: unknown): value is Direction {
  return typeof value === 'string' && DIRECTIONS.includes(value as Direction)
}

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[][] = []
  private bodies: Record<string, number[]> = {}
  private lastMovementDirections: Record<string, Direction> = {}
  private directionQueue: Record<string, Direction[]> = {}

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

        let queue = this.directionQueue[playerName]
        if (!queue) {
          queue = []
          this.directionQueue[playerName] = queue
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
      this.state.remainingPlayers.push(playerName)

      this.lastMovementDirections[playerName] = directions[playerName]
      this.directionQueue[playerName] = []
    })

    this.startGameWhenReady()
  }

  protected startGame() {
    this.state.status = 'playing'

    this.setSimulationInterval((deltaTime) => this.update(deltaTime), SNAKE_TICK_MS)
  }

  update(_deltaTime: number) {
    if (this.state.status !== 'playing') {
      return
    }

    const board = this.state.board.map(toCell)
    const remainingPlayers = Array.from(this.state.remainingPlayers)

    const intentions = this.getIntentions(remainingPlayers)
    const deaths = getDeaths(intentions, board, this.state.width, this.state.height)

    const survivingIntentions: Record<string, MovementIntention> = Object.fromEntries(
      Object.entries(intentions).filter(([playerName]) => !deaths.has(playerName))
    )
    this.applyMovementIntentions(survivingIntentions)
    this.applyDeaths(deaths)

    this.state.tick++
  }

  private getIntentions(remainingPlayers: string[]): Record<string, MovementIntention> {
    const directions = this.getDirectionsForPlayers(remainingPlayers)

    return Object.fromEntries(
      remainingPlayers.map((playerName) => [
        playerName,
        getMovementIntention(this.bodies[playerName], directions[playerName], this.state.width),
      ])
    )
  }

  private getDirectionsForPlayers(players: string[]): Record<string, Direction> {
    return Object.fromEntries(
      players.map((playerName) => {
        const queue = this.directionQueue[playerName] || []
        const lastDirection = this.lastMovementDirections[playerName]

        while (queue.length > 0 && isOppositeDirection(lastDirection, queue[0])) {
          queue.shift()
        }

        const chosenDirection = queue.shift() || lastDirection

        return [playerName, chosenDirection]
      })
    )
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
      const body = this.bodies[playerName]
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
      this.lastMovementDirections[playerName] = intention.direction
    }
  }

  private applyDeaths(deaths: Set<string>) {
    if (deaths.size > 0) {
      const names = Array.from(deaths)
      const eliminatedThisTurn: string[] = []

      for (const name of names) {
        const body = this.bodies[name]
        if (body) {
          for (const idx of body) {
            const c = this.state.board[idx]
            c.kind = CellKind.Empty
            c.player = undefined
            c.isHead = undefined
          }
          delete this.bodies[name]
        }
        for (let i = 0; i < this.state.remainingPlayers.length; i++) {
          if (this.state.remainingPlayers[i] === name) {
            this.state.remainingPlayers.splice(i, 1)
            break
          }
        }
        delete this.lastMovementDirections[name]
        delete this.directionQueue[name]
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

    playerGroups.push([...this.state.remainingPlayers])

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([...playerName])
    }

    return assignScoresByRank(playerGroups)
  }

  private isPlayerInGame(playerName: string): boolean {
    return this.state.remainingPlayers.includes(playerName)
  }
}
