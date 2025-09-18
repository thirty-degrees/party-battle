import { ArraySchema } from '@colyseus/schema'
import { GameType } from 'types-party-battle/types/GameSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { CellSchema, fromCell } from 'types-party-battle/types/snake/CellSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

const STEP_MS = 300

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[] = []

  override getGameType(): GameType {
    return SnakeGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; players: { name: string; color: string }[] }) {
    const playerNames = options.players.map((player) => player.name)
    const { board, width, height } = createInitialBoard(playerNames)

    const boardSchema = new ArraySchema<CellSchema>()
    board.forEach((cell) => {
      boardSchema.push(fromCell(cell))
    })

    this.state = new SnakeGameSchema('waiting', width, height, boardSchema)

    super.onCreate(options)

    options.players.forEach((player) => {
      this.state.remainingPlayers.push(player.name)
    })

    this.clock.setTimeout(() => {
      this.finishGame()
      console.log('TEMP: Game status changed to finished after 2 seconds')
    }, 2000)

    this.setSimulationInterval((deltaTime) => this.update(deltaTime), 1000 / STEP_MS)
  }

  update(deltaTime: number) {
    console.log('TEMP: Updating snake game', deltaTime)
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
