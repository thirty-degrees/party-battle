import { Client, Room } from "@colyseus/core";
import {
  GameHistory,
  GameSchema,
  GameType,
  MAX_AMOUNT_OF_PLAYERS,
  Score
} from "types-party-battle";
import { Player } from "./Player";

export abstract class BaseGameRoom<S extends GameSchema> extends Room<S> {
  protected players = new Map<string, Player>();

  onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    console.log(`${this.constructor.name}.onCreate: roomId: '${this.roomId}', lobbyRoomId: '${options.lobbyRoomId}'`);

    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;

    options.playerNames.forEach((playerName) => {
      this.players.set(playerName, {});
    });
  }

  protected finishGame(options: { lobbyRoomId: string; playerNames: string[]; }) {
    const gameHistory: GameHistory = {
      gameType: this.getGameType(),
      scores: this.getScores(),
    };

    this.presence.publish("score-" + options.lobbyRoomId, gameHistory);
    this.state.status = "finished";
    console.log("TEMP: Game status changed to finished after 2 seconds");
  }

  abstract getScores(): Score[];

  abstract getGameType(): GameType;

  onJoin(client: Client, options: { name: string }) {
    console.log(`${this.constructor.name}.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`);

    const player = this.players.get(options.name)
    if (player) {
      player.sessionId = client.sessionId;
    } else {
      console.log(`${this.constructor.name}.onJoin: playerName: '${options.name}' is not part of the game`);
    }
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`${this.constructor.name}.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.players?.forEach((player, playerName) => {
      if (player.sessionId === client.sessionId) {
        this.players.set(playerName, { ...player, sessionId: null });
      }
    });
  }

  onDispose() {
    console.log(`${this.constructor.name}.onDispose: roomId: '${this.roomId}'`);
  }
}
