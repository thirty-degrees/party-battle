import { GameType } from 'types-party-battle/types/GameSchema'
import { Score } from 'types-party-battle/types/ScoreSchema'
import { SnakeGameSchema } from 'types-party-battle/types/snake/SnakeGameSchema'
import { BaseGameRoom } from '../games/BaseGameRoom'
import { createInitialBoard } from '../games/snake/createInitialBoard'
import { assignScoresByOrder } from '../scores/assignScoresByOrder'

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = 'snake'
  static readonly roomName: string = 'snake_game_room'

  private eliminatedPlayers: string[] = []

  override getGameType(): GameType {
    return SnakeGameRoom.gameType
  }

  override onCreate(options: { lobbyRoomId: string; playerNames: string[] }) {
    super.onCreate(options)

    const { board, width, height } = createInitialBoard(options.playerNames)

    this.state = new SnakeGameSchema('waiting', width, height, board)

    options.playerNames.forEach((playerName) => {
      this.state.remainingPlayers.push(playerName)
    })

    this.clock.setTimeout(() => {
      this.finishGame()
      console.log('TEMP: Game status changed to finished after 2 seconds')
    }, 2000)
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
