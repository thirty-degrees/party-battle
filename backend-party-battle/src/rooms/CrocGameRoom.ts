import { CrocGameSchema, GameType, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

export class CrocGameRoom extends BaseGameRoom<CrocGameSchema> {
  static readonly gameType: GameType = "croc";
  static readonly roomName: string = "croc_game_room";
  hotToothIndex = 0;

  override getGameType(): GameType {
    return CrocGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new CrocGameSchema("waiting");
    this.hotToothIndex = Math.floor(Math.random() * 12);
    this.state.teethCount = 12;

    this.onMessage("tooth_pressed", (client, message: { index: number }) => {
      this.state.pressedTeethIndex.push(message.index);
      
      if (message.index === this.hotToothIndex) {
        this.finishGame(options);
      }
    });
  }

  override getScores(): Score[] {
    return [...this.playerConnections.keys()].map(playerName => ({
      playerName,
      value: 10
    }));
  }
}
