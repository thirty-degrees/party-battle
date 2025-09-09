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
      this.startRound();
    }, 500);
  }

  private startRound() {
    // Set random countdown between 8-15 seconds
    const countdownSeconds = Math.floor(Math.random() * 8) + 8; // 8-15 inclusive
    this.state.message = countdownSeconds.toString();
    this.state.status = "playing";

    setTimeout(() => {
      this.state.message = (countdownSeconds - 1).toString();
    }, 1000);

    setTimeout(() => {
      this.state.message = (countdownSeconds - 2).toString();
    }, 2000);

    setTimeout(() => {
      this.state.message = "";
    }, 3000);

    setTimeout(() => {
      this.state.message = "BOOM!";
      this.state.status = "waiting";

      setTimeout(() => {
        this.finishGame();
      }, 1000);
    }, countdownSeconds * 1000);
  }

  override getScores(): Score[] {
    return [...this.playerConnections.keys()].map(playerName => ({
      playerName,
      value: 3
    }));
  }
}
