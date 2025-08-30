import { Room, Client } from "@colyseus/core";
import { matchMaker } from "@colyseus/core";
import { Lobby, LobbyPlayer } from "types-party-battle";

export class LobbyRoom extends Room<Lobby> {
  maxClients = 8;
  private gameRoomId: string | null = null;
  private playersInGame = new Set<string>();

  onCreate(options: { name: string }) {
    this.autoDispose = false;
    console.log("options", options);
    console.log("playerName", options.name);
    console.log("LobbyRoom created:", this.roomId);

    this.state = new Lobby();

    this.maxClients = 8;

    this.onMessage("ready", (client: Client) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = true;
        console.log(`Player ${player.name} is ready`);
      } else {
        console.log(`Unknown player ${client.sessionId} is ready`);
      }
    });
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`Player ${client.sessionId} joined lobby`);
    const player = new LobbyPlayer();
    player.name = options.name;
    player.ready = false;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(`Player ${client.sessionId} left lobby`);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("Lobby room disposing:", this.roomId);
  }
}
