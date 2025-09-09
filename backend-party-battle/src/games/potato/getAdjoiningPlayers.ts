export function getAdjoiningPlayers(players: string[], currentPlayer: string) {
  if (!players.includes(currentPlayer)) {
    throw new Error("Current player must be in the players array");
  }

  return players.filter(player => player !== currentPlayer);
}