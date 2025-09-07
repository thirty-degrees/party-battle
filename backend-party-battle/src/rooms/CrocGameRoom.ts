import { Client, Room } from "@colyseus/core";
import {
  CrocGameSchema,
  GameHistory,
  MAX_AMOUNT_OF_PLAYERS,
  Score
} from "types-party-battle";
import { Player } from "../games/Player";

export class CrocGameRoom extends Room<CrocGameSchema> {
  private players = new Map<string, Player>();

  onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    console.log(`CrocGameRoom.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`);
    
    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new CrocGameSchema("waiting");

    options.playerNames.forEach((playerName) => {
      this.players.set(playerName, {});
    });

    setTimeout(() => {
      const gameHistory: GameHistory = {
        gameType: "croc",
        scores: this.getScores(),
      };

      this.presence.publish("score-" + options.lobbyRoomId, gameHistory);
      this.state.status = "finished";
      console.log("TEMP: Game status changed to finished after 2 seconds");
    }, 2000);
  }

  private getScores(): Score[] {
    return [...this.players.keys()].map(playerName => ({
      playerName,
      value: 33
    }));
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`CrocGameRoom.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`);

    const player = this.players.get(options.name)
    if (player) {
      player.sessionId = client.sessionId;
    } else {
      console.log(`CrocGameRoom.onJoin: playerName: '${options.name}' is not part of the game`);
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`CrocGameRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.players?.forEach((player, playerName) => {
      if (player.sessionId === client.sessionId) {
        this.players.set(playerName, { ...player, sessionId: null });
      }
    });
  }

  onDispose() {
    console.log(`CrocGameRoom.onDispose: roomId: '${this.roomId}'`);
  }
}
