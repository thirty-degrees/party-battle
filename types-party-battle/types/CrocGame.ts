import { MapSchema, Schema, type } from "@colyseus/schema";
import { Game } from "./Game";

export class CrocGame extends Game {
  @type("number") crocIndex: number = 0;

  constructor() {
    super("croc");
  }
}
