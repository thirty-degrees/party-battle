import { GameType, PotatoGameSchema, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

const POTATO_COUNTDOWN_MIN_SECONDS = 8;
const POTATO_COUNTDOWN_MAX_SECONDS = 15;

export class PotatoGameRoom extends BaseGameRoom<PotatoGameSchema> {
  static readonly gameType: GameType = "potato";
  static readonly roomName: string = "potato_game_room";

  override getGameType(): GameType {
    return PotatoGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new PotatoGameSchema("waiting");

    this.clock.setTimeout(() => {
      this.startRound();
    }, 500);
  }

  private getRandomCountdownSeconds(): number {
    return Math.floor(Math.random() * (POTATO_COUNTDOWN_MAX_SECONDS - POTATO_COUNTDOWN_MIN_SECONDS + 1)) + POTATO_COUNTDOWN_MIN_SECONDS;
  }

  private startRound() {
    const countdownSeconds = this.getRandomCountdownSeconds();
    this.state.message = countdownSeconds.toString();
    this.state.status = "playing";

    this.clock.setTimeout(() => {
      this.state.message = (countdownSeconds - 1).toString();
    }, 1000);

    this.clock.setTimeout(() => {
      this.state.message = (countdownSeconds - 2).toString();
    }, 2000);

    this.clock.setTimeout(() => {
      this.state.message = "";
    }, 3000);

    this.clock.setTimeout(() => {
      this.state.message = "BOOM!";
      this.state.status = "waiting";

      this.clock.setTimeout(() => {
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
