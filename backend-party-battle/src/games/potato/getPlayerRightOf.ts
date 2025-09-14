export function getPlayerRightOf(players: string[], currentPlayer: string): string | null {
  if (!players.includes(currentPlayer)) {
    throw new Error('Current player must be in the players array')
  }

  if (players.length <= 2) {
    return null
  }

  const currentIndex = players.indexOf(currentPlayer)
  const rightIndex = (currentIndex + 1) % players.length
  return players[rightIndex]
}
