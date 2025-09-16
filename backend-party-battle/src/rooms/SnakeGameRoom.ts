import { GameType, Score, SnakeGameSchema } from 'types-party-battle'
import { BaseGameRoom } from '../games/BaseGameRoom'
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
    this.state = new SnakeGameSchema('waiting')

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
