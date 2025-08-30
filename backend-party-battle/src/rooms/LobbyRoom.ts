import { Room, Client } from "@colyseus/core";
import { matchMaker } from "@colyseus/core";
import { Lobby, LobbyPlayer } from "types-party-battle";
import { RoomIds } from "../app.config";

export class LobbyRoom extends Room<Lobby> {
  maxClients = 8;
  private gameRoomId: string | null = null;
  private playersInGame = new Set<string>();

  onCreate(_options: { name: string }) {
    this.autoDispose = false;

    this.state = new Lobby();

    this.maxClients = 8;

    console.log("Lobby room created");

    this.onMessage("ready", (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = true;
        console.log(`Player ${player.name} is ready`);

        this.checkAllPlayersReady();
      } else {
        console.log(`Unknown player ${client.sessionId} is ready`);
      }
    });
  }

  onJoin(client: Client, options: { name: string }) {
    const player = new LobbyPlayer();
    player.name = options.name;
    player.ready = false;
    this.state.players.set(client.sessionId, player);
    console.log(`Player ${player.name} joined lobby`);
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
        const crocRoom = await matchMaker.createRoom(
          RoomIds.CROC_GAME_ROOM,
          {}
        );
        this.state.currentGame = "croc";
        this.state.currentGameRoomId = crocRoom.roomId;

        console.log(`Created croc game room: ${crocRoom.roomId}`);
      } catch (error) {
        console.error("Failed to create croc game room:", error);
      }
    }
  }
}
