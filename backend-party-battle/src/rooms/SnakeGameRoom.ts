import { Client, Room } from "@colyseus/core";
import {
  GameHistory,
  MAX_AMOUNT_OF_PLAYERS,
  Score,
  SnakeGameSchema
} from "types-party-battle";
import { Player } from "../games/Player";

export class SnakeGameRoom extends Room<SnakeGameSchema> {
  private players = new Map<string, Player>();

  onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    console.log(`SnakeGameRoom.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`);
    
    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new SnakeGameSchema("waiting");

    options.playerNames.forEach((playerName) => {
      this.players.set(playerName, {});
    });

    setTimeout(() => {
      const gameHistory: GameHistory = {
        gameType: "snake",
        scores: [],
      };

      this.players.keys().forEach((playerName) => {
        const playerScore: Score = {
          playerName: playerName,
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
    this.players.set(options.name, { sessionId: client.sessionId });
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`SnakeGameRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.players?.forEach((player, playerName) => {
      if (player.sessionId === client.sessionId) {
        this.players.set(playerName, { ...player, sessionId: null });
      }
    });
  }

  onDispose() {
    console.log(`SnakeGameRoom.onDispose: roomId: '${this.roomId}'`);
  }
}
