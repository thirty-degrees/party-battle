import { MapSchema, Schema, type } from "@colyseus/schema";

export class CrocPlayerState extends Schema {
  @type("string") name: string;
  @type("string") id: string;
}

export class CrocMiniGameRoomState extends Schema {
  @type({ map: CrocPlayerState }) players = new MapSchema<CrocPlayerState>();
  @type("string") gameState: "waiting" | "playing" | "finished" = "waiting";
  @type("number") hotThootIndex: number = 0;
}
