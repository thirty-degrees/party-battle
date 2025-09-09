import * as assert from "assert";
import { getAdjoiningPlayers } from "../src/games/potato/getAdjoiningPlayers";

describe("getAdjoiningPlayers", () => {
  describe("when currentPlayer is in the players array", () => {
    it("should return all players except the currentPlayer", () => {
      const players = ["player1", "player2", "player3"];
      const currentPlayer = "player2";

      const result = getAdjoiningPlayers(players, currentPlayer);

      assert.deepStrictEqual(result, ["player1", "player3"]);
    });
  });

  describe("when currentPlayer is the first player", () => {
    it("should return the remaining players", () => {
      const players = ["player1", "player2", "player3"];
      const currentPlayer = "player1";

      const result = getAdjoiningPlayers(players, currentPlayer);

      assert.deepStrictEqual(result, ["player2", "player3"]);
    });
  });

  describe("when currentPlayer is the last player", () => {
    it("should return the preceding players", () => {
      const players = ["player1", "player2", "player3"];
      const currentPlayer = "player3";

      const result = getAdjoiningPlayers(players, currentPlayer);

      assert.deepStrictEqual(result, ["player1", "player2"]);
    });
  });

  describe("when currentPlayer is the only player", () => {
    it("should return an empty array", () => {
      const players = ["player1"];
      const currentPlayer = "player1";

      const result = getAdjoiningPlayers(players, currentPlayer);

      assert.deepStrictEqual(result, []);
    });
  });

  describe("when currentPlayer is not in the players array", () => {
    it("should throw an error", () => {
      const players = ["player1", "player2", "player3"];
      const currentPlayer = "player4";

      assert.throws(() => getAdjoiningPlayers(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });

  describe("when players array is empty", () => {
    it("should throw an error", () => {
      const players: string[] = [];
      const currentPlayer = "player1";

      assert.throws(() => getAdjoiningPlayers(players, currentPlayer), {
        message: "Current player must be in the players array"
      });
    });
  });
});
