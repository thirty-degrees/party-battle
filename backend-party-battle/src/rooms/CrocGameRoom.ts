import { CrocGameSchema, GameType, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

export class CrocGameRoom extends BaseGameRoom<CrocGameSchema> {
  static readonly gameType: GameType = "croc";
  static readonly roomName: string = "croc_game_room";

  override getGameType(): GameType {
    return CrocGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new CrocGameSchema("waiting");

    setTimeout(() => {
      this.finishGame(options);
    }, 2000);
  }

  override getScores(): Score[] {
    return [...this.players.keys()].map(playerName => ({
      playerName,
      value: 10
    }));
  }
}
