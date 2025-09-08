import { GameType, PotatoGameSchema, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

export class PotatoGameRoom extends BaseGameRoom<PotatoGameSchema> {
  static readonly gameType: GameType = "potato";
  static readonly roomName: string = "potato_game_room";

  override getGameType(): GameType {
    return PotatoGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new PotatoGameSchema("waiting");

    setTimeout(() => {
      this.finishGame(options);
    }, 2000);
  }

  override getScores(): Score[] {
    return [...this.playerConnections.keys()].map(playerName => ({
      playerName,
      value: 3
    }));
  }
}
