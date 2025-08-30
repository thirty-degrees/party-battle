import { Room, Client } from "@colyseus/core";
import { CrocGame } from "types-party-battle";

export class CrocGameRoom extends Room<CrocGame> {
  maxClients = 8;

  onCreate(options: unknown) {
    this.autoDispose = false;
    console.log(
      "CrocMiniGameRoom created:",
      this.roomId,
      "with options:",
      options
    );
  }

  onJoin(client: Client, _options: { name: string }) {
    console.log(`Player ${client.sessionId} joined croc game`);
  }

  onLeave(_client: Client, _consented: boolean) { }

  onDispose() { }
}
