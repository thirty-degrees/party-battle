import * as assert from "assert";
import { getPlayerRightOf } from "../../src/games/potato/getPlayerRightOf";

describe("getPlayerRightOf", () => {
  describe("when currentPlayer is in the players array", () => {
    it("should return the player to the right in a circular array", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player1";

      const result = getPlayerRightOf(players, currentPlayer);

      assert.strictEqual(result, "player2");
    });
  });

  describe("when currentPlayer is the last player", () => {
    it("should return the first player (circular)", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player2";

      const result = getPlayerRightOf(players, currentPlayer);

      assert.strictEqual(result, "player0");
    });
  });

  describe("when currentPlayer is the only player", () => {
    it("should return null", () => {
      const players = ["player0"];
      const currentPlayer = "player0";

      const result = getPlayerRightOf(players, currentPlayer);

      assert.strictEqual(result, null);
    });
  });

  describe("when there are 2 players", () => {
    it("should return null (no right player, other player is across)", () => {
      const players = ["player0", "player1"];
      const currentPlayer = "player0";

      const result = getPlayerRightOf(players, currentPlayer);

      assert.strictEqual(result, null);
    });
  });

  describe("when currentPlayer is not in the players array", () => {
    it("should throw an error", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player3";

      assert.throws(() => getPlayerRightOf(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });

  describe("when players array is empty", () => {
    it("should throw an error", () => {
      const players: string[] = [];
      const currentPlayer = "player0";

      assert.throws(() => getPlayerRightOf(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });
});
