import { type } from "@colyseus/schema";
import { PlayerSchema } from "./PlayerSchema";

export class LobbyPlayerSchema extends PlayerSchema {
  @type("boolean") ready!: boolean;
}
