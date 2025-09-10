import { getPlayerRightOf } from "../getPlayerRightOf";

describe("getPlayerRightOf", () => {
  describe("when currentPlayer is in the players array", () => {
    it("should return the player to the right in a circular array", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player1";

      const result = getPlayerRightOf(players, currentPlayer);

      expect(result).toBe("player2");
    });
  });

  describe("when currentPlayer is the last player", () => {
    it("should return the first player (circular)", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player2";

      const result = getPlayerRightOf(players, currentPlayer);

      expect(result).toBe("player0");
    });
  });

  describe("when currentPlayer is the only player", () => {
    it("should return null", () => {
      const players = ["player0"];
      const currentPlayer = "player0";

      const result = getPlayerRightOf(players, currentPlayer);

      expect(result).toBe(null);
    });
  });

  describe("when there are 2 players", () => {
    it("should return null (no right player, other player is across)", () => {
      const players = ["player0", "player1"];
      const currentPlayer = "player0";

      const result = getPlayerRightOf(players, currentPlayer);

      expect(result).toBe(null);
    });
  });

  describe("when currentPlayer is not in the players array", () => {
    it("should throw an error", () => {
      const players = ["player0", "player1", "player2"];
      const currentPlayer = "player3";

      expect(() => getPlayerRightOf(players, currentPlayer)).toThrow(
        "Current player must be in the players array"
      );
    });
  });

  describe("when players array is empty", () => {
    it("should throw an error", () => {
      const players: string[] = [];
      const currentPlayer = "player0";

      expect(() => getPlayerRightOf(players, currentPlayer)).toThrow(
        "Current player must be in the players array"
      );
    });
  });
});
