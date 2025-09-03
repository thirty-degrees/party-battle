import { Schema, type } from "@colyseus/schema";

export interface KeyValuePairNumberInterface {
  key: string;
  value: number;
}

export class KeyValuePairNumber
  extends Schema
  implements KeyValuePairNumberInterface
{
  @type("string") key: string;
  @type("number") value: number;

  constructor(key: string, value: number) {
    super();
    this.key = key;
    this.value = value;
  }
}
