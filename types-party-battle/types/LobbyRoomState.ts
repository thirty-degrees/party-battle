import { MapSchema, Schema, type } from "@colyseus/schema";

export class LobbyPlayerState extends Schema {
  @type("string") name: string;
  @type("string") id: string;
  @type("boolean") ready: boolean = false;
}

export class LobbyRoomState extends Schema {
  @type({ map: LobbyPlayerState }) players = new MapSchema<LobbyPlayerState>();
  @type("string") roomName: string = "Party Battle Lobby";
  @type("number") maxPlayers: number = 8;
  @type("string") currentMiniGame: "croc" | null = null;
}
