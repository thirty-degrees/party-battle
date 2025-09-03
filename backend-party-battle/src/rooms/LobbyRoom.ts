import { Client, matchMaker, Room } from "@colyseus/core";
import {
  GameHistory,
  Lobby,
  LobbyPlayer,
  MAX_AMOUNT_OF_PLAYERS,
} from "types-party-battle";
import { RoomIds } from "../app.config";

export class LobbyRoom extends Room<Lobby> {
  private gameRoomId: string | null = null;
  private playersInGame = new Set<string>();

  onCreate(_options: { name: string }) {
    this.autoDispose = false;

    this.state = new Lobby();

    this.maxClients = MAX_AMOUNT_OF_PLAYERS;

    console.log(`Lobby room created, room id: ${this.roomId}`);

    this.onMessage("ready", (client: Client, ready: boolean) => {
      const player = this.state.players.get(client.sessionId);

      player.ready = ready;
      console.log(`Player ${player.name} is ready: ${ready}`);

      this.checkAllPlayersReady();
    });

    this.presence.subscribe("score-" + this.roomId, (data: GameHistory) => {
      console.log("received message:", data);
      console.log("received message:", data.gameType);
      console.log("received message:", data.scores.length);
      //this.state.gameHistory.add(data);
      this.state.currentGame = null;
      this.state.currentGameRoomId = null;
      this.state.players.forEach((player) => {
        player.ready = false;
      });
    });
  }

  onJoin(client: Client, options: { name: string }) {
    const player = new LobbyPlayer();
    player.name = options.name;
    player.ready = false;
    this.state.players.set(client.sessionId, player);
    console.log(`Player ${player.name} joined lobby ${this.roomId}`);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`Player ${client.sessionId} left lobby`);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("Lobby room disposing:", this.roomId);
  }

  private async checkAllPlayersReady() {
    const allPlayers = Array.from(this.state.players.values());
    const allReady = allPlayers.every((player) => player.ready);

    if (allReady && allPlayers.length > 0) {
      console.log("All players are ready! Creating croc game room.");

      try {
        const crocRoom = await matchMaker.createRoom(RoomIds.CROC_GAME_ROOM, {
          lobbyRoomId: this.roomId,
        });
        this.state.currentGame = "croc";
        this.state.currentGameRoomId = crocRoom.roomId;

        console.log(`Created croc game room: ${crocRoom.roomId}`);
      } catch (error) {
        console.error("Failed to create croc game room:", error);
      }
    }
  }
}
