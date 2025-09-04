import { Client, Room } from "@colyseus/core";
import {
  CrocGame,
  GameHistory,
  MAX_AMOUNT_OF_PLAYERS,
  Score,
} from "types-party-battle";

export class CrocGameRoom extends Room<CrocGame> {
  private players = new Map<string, string>();

  onCreate(options: { lobbyRoomId: string }) {
    this.autoDispose = false;

    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new CrocGame();
    console.log(
      "CrocMiniGameRoom created:",
      this.roomId,
      "from lobby:",
      options.lobbyRoomId
    );

    setTimeout(() => {
      const gameHistory: GameHistory = {
        gameType: "croc",
        scores: [],
      };

      this.players.forEach((playerName) => {
        const playerScore: Score = {
          playerName,
          value: 33,
        };
        gameHistory.scores.push(playerScore);
      });

      this.presence.publish("score-" + options.lobbyRoomId, gameHistory);
      this.state.gameState = "finished";
      console.log("Game state changed to finished after 2 seconds");
    }, 2000);
  }

  onJoin(client: Client, options: { name: string }) {
    this.players.set(client.sessionId, options.name);
    console.log(`Player ${client.sessionId} joined croc game`);
  }

  onLeave(client: Client, _consented: boolean) {
    this.players.delete(client.sessionId);
  }

  onDispose() {}
}
