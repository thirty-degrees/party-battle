import { GameType, PotatoGameSchema, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";
import { assignScoresByOrder } from "../scores/assignScoresByOrder";

const POTATO_COUNTDOWN_MIN_SECONDS = 8;
const POTATO_COUNTDOWN_MAX_SECONDS = 15;

export class PotatoGameRoom extends BaseGameRoom<PotatoGameSchema> {
  static readonly gameType: GameType = "potato";
  static readonly roomName: string = "potato_game_room";

  private eliminatedPlayers: string[] = [];

  override getGameType(): GameType {
    return PotatoGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new PotatoGameSchema("waiting");

    options.playerNames.forEach(playerName => {
      this.state.remainingPlayers.push(playerName);
    });

    this.clock.setTimeout(() => {
      this.startRound();
    }, 500);
  }

  private startRound() {
    const countdownSeconds = this.getRandomCountdownSeconds();
    this.state.message = countdownSeconds.toString();
    const randomIndex = Math.floor(Math.random() * this.state.remainingPlayers.length);
    this.state.playerWithPotato = this.state.remainingPlayers[randomIndex];
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
      this.endRound();
    }, countdownSeconds * 1000);
  }

  private endRound() {
    this.state.message = "BOOM!";
    this.state.status = "waiting";

    const eliminatedPlayerIndex = this.state.remainingPlayers.indexOf(this.state.playerWithPotato);
    const eliminatedPlayer = this.state.remainingPlayers.splice(eliminatedPlayerIndex, 1)[0];
    this.eliminatedPlayers.push(eliminatedPlayer);

    this.clock.setTimeout(() => {
      if (this.state.remainingPlayers.length > 1) {
        this.startRound();
      } else {
        this.finishGame();
      }
    }, 1000);
  }

  private getRandomCountdownSeconds(): number {
    return Math.floor(Math.random() * (POTATO_COUNTDOWN_MAX_SECONDS - POTATO_COUNTDOWN_MIN_SECONDS + 1)) + POTATO_COUNTDOWN_MIN_SECONDS;
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = [];

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([playerName]);
    }

    playerGroups.push([...this.state.remainingPlayers]);
    
    return assignScoresByOrder(playerGroups);
  }
}
