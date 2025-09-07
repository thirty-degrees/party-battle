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
    this.state.teethCount = 12;

    this.onMessage("tooth_pressed", (client, message: { index: number }) => {
      console.log(`Tooth ${message.index} pressed by client ${client.id}`);
      this.state.pressedTeethIndex.push(message.index);
    });

  }

  override getScores(): Score[] {
    return [...this.playerConnections.keys()].map(playerName => ({
      playerName,
      value: 10
    }));
  }
}
