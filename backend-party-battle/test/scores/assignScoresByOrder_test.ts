import * as assert from "assert";
import { assignScoresByOrder } from "../../src/scores/assignScoresByOrder";

describe("assignScoresByOrder", () => {
  describe("with multiple players in different ranks", () => {
    it("should assign scores based on rank groups", () => {
      const players = [["Alice"], ["Bob"], ["Charlie"]];

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
      const players: string[][] = [];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 0);
      assert.deepStrictEqual(result, []);
    });
  });

  describe("with single player", () => {
    it("should assign score of 0", () => {
      const players = [["Alice"]];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 1);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 0 },
      ]);
    });
  });

  describe("with multiple players in first rank", () => {
    it("should assign score of 2 to all players in first rank", () => {
      const players = [["Alice"], ["Bob", "Charlie"]];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 0 },
        { playerName: "Bob", value: 2 },
        { playerName: "Charlie", value: 2 },
      ]);
    });
  });

  describe("with three players in last rank", () => {
    it("should assign 2 points to all three players in last rank", () => {
      const players = [["Alice", "Bob", "Charlie"], ["Dave"]];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 4);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 2 },
        { playerName: "Bob", value: 2 },
        { playerName: "Charlie", value: 2 },
        { playerName: "Dave", value: 3 },
      ]);
    });
  });

  describe("with multiple groups", () => {
    it("should assign scores based on rank groups", () => {
      const players = [["Alice", "Bob", "Charlie", "Dave"], ["Eve", "Frank"]];

      const result = assignScoresByOrder(players);

      assert.strictEqual(result.length, 6);
      assert.deepStrictEqual(result, [
        { playerName: "Alice", value: 3 },
        { playerName: "Bob", value: 3 },
        { playerName: "Charlie", value: 3 },
        { playerName: "Dave", value: 3 },
        { playerName: "Eve", value: 5 },
        { playerName: "Frank", value: 5 },
      ]);
    });
  });
});
