import * as assert from "assert";
import { getPlayerAcrossOf } from "../../src/games/potato/getPlayerAcrossOf";

describe("getPlayerAcrossOf", () => {
  describe("when there are 4 players", () => {
    it("should return the player directly opposite", () => {
      const players = ["player0", "player1", "player2", "player3"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, "player2");
    });
  });

  describe("when there are 5 players", () => {
    it("should return the player floor(length/2) steps left", () => {
      const players = ["player0", "player1", "player2", "player3", "player4"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, "player3");
    });
  });

  describe("when there are 6 players", () => {
    it("should return the player floor(length/2) steps left", () => {
      const players = ["player0", "player1", "player2", "player3", "player4", "player5"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, "player3");
    });
  });

  describe("when there are 3 players", () => {
    it("should return the player floor(length/2) steps left", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, "player2");
    });
  });

  describe("when there are 2 players", () => {
    it("should return the other player", () => {
      const players = ["player0", "player1"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, "player1");
    });
  });

  describe("when there is 1 player", () => {
    it("should return null", () => {
      const players = ["player0"];
      const currentPlayer = "player0";

      const result = getPlayerAcrossOf(players, currentPlayer);

      assert.strictEqual(result, null);
    });
  });

  describe("when players array is empty", () => {
    it("should throw an error", () => {
      const players: string[] = [];
      const currentPlayer = "player0";

      assert.throws(() => getPlayerAcrossOf(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });

  describe("when currentPlayer is not in the players array", () => {
    it("should throw an error", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player3";

      assert.throws(() => getPlayerAcrossOf(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });
});
