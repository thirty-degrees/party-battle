import { Client, Room } from "@colyseus/core";
import {
  CrocGameSchema,
  GameHistory,
  MAX_AMOUNT_OF_PLAYERS,
  Score
} from "types-party-battle";

export class CrocGameRoom extends Room<CrocGameSchema> {
  private players = new Map<string, string>();

  onCreate(options: { lobbyRoomId: string }) {
    console.log(`CrocGameRoom.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`);
    
    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new CrocGameSchema();

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
      console.log("TEMP: Game state changed to finished after 2 seconds");
    }, 2000);
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`CrocGameRoom.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`);
    this.players.set(client.sessionId, options.name);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`CrocGameRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`CrocGameRoom.onDispose: roomId: '${this.roomId}'`);
  }
}
