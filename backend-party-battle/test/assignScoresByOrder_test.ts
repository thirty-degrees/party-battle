import * as assert from "assert";
import { assignScoresByOrder } from "../src/scores/assignScoresByOrder";

describe("assignScoresByOrder", () => {
  describe("with multiple players", () => {
    it("should assign scores based on player order", () => {
      const players = ["Alice", "Bob", "Charlie"];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 0 },
        { playerName: "Bob", value: 1 },
        { playerName: "Charlie", value: 2 },
      ]);
    });
  });

  describe("with empty players array", () => {
    it("should return empty array", () => {
      const players: string[] = [];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 0);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("with single player", () => {
    it("should assign score of 0", () => {
      const players = ["Alice"];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 1);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 0 },
      ]);
    });
  });
});
