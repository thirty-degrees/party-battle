import { GameType, Score, SnakeGameSchema } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

export class SnakeGameRoom extends BaseGameRoom<SnakeGameSchema> {
  static readonly gameType: GameType = "snake";
  static readonly roomName: string = "snake_game_room";

  override getGameType(): GameType {
    return SnakeGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new SnakeGameSchema("waiting");

    setTimeout(() => {
      this.finishGame(options);
    }, 2000);
  }

  override getScores(): Score[] {
    return [...this.playerConnections.keys()].map(playerName => ({
      playerName,
      value: 5
    }));
  }
}
