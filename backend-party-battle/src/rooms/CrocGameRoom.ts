import { Room, Client } from "@colyseus/core";
import {
  CrocGame,
  MAX_AMOUNT_OF_PLAYERS,
  GameHistory,
  KeyValuePairNumber,
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
      const gameHistory = new GameHistory("croc");

      console.log("create gameHistory", gameHistory);
      this.players.forEach((playerName) => {
        const playerScore: KeyValuePairNumber = new KeyValuePairNumber(
          playerName,
          1
        );
        gameHistory.scores.push(playerScore);
      });

      console.log("publish gameHistory", gameHistory);
      this.presence.publish("score-" + options.lobbyRoomId, gameHistory);
      this.state.gameState = "finished";
      console.log("Game state changed to finished after 3 seconds");
    }, 3000);
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
