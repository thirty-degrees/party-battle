import { Room, Client } from "@colyseus/core";
import { CrocGame } from "types-party-battle";

export class CrocGameRoom extends Room<CrocGame> {
  maxClients = 8;

  onCreate(options: unknown) {
    this.autoDispose = false;
    this.state = new CrocGame();
    console.log(
      "CrocMiniGameRoom created:",
      this.roomId,
      "with options:",
      options
    );

    setTimeout(() => {
      this.state.gameState = "finished";
      console.log("Game state changed to finished after 3 seconds");
    }, 3000);
  }

  onJoin(client: Client, _options: { name: string }) {
    console.log(`Player ${client.sessionId} joined croc game`);
  }

  onLeave(_client: Client, _consented: boolean) {}

  onDispose() {}
}
