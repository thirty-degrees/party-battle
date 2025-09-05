import { Client, Room } from "@colyseus/core";
import {
  GameHistory,
  MAX_AMOUNT_OF_PLAYERS,
  Score,
  SnakeGameSchema
} from "types-party-battle";

export class SnakeGameRoom extends Room<SnakeGameSchema> {
  private players = new Map<string, string>();

  onCreate(options: { lobbyRoomId: string }) {
    console.log(`SnakeGameRoom.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`);
    
    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new SnakeGameSchema("waiting");

    setTimeout(() => {
      const gameHistory: GameHistory = {
        gameType: "snake",
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
      this.state.status = "finished";
      console.log("TEMP: Game status changed to finished after 2 seconds");
    }, 2000);
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`SnakeGameRoom.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`);
    this.players.set(client.sessionId, options.name);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`SnakeGameRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`SnakeGameRoom.onDispose: roomId: '${this.roomId}'`);
  }
}
