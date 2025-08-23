import { Room, Client } from "@colyseus/core";
import { GameRoomState, PlayerState } from "./schema/GameRoomState";

export class GameRoom extends Room<GameRoomState> {
  maxClients = 4;

  onCreate(options: any) {
    this.setState(new GameRoomState());

    this.onMessage("type", (client, message) => {
      // handle "type" message
    });
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");

    // create a new player and add it to the state
    const player = new PlayerState();
    player.name = options.name || `Player_${client.sessionId.substr(0, 5)}`;

    this.state.players.set(client.sessionId, player);
    console.log(this.state.players);
  }

  onLeave(client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");

    // remove the player from state
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }
}
