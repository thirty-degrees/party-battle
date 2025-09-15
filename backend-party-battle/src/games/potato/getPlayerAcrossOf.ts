export function getPlayerAcrossOf(players: string[], currentPlayer: string): string | null {
  if (!players.includes(currentPlayer)) {
    throw new Error('Current player must be in the players array')
  }

  if (players.length === 1) {
    return null
  }

  if (players.length === 2) {
    const currentIndex = players.indexOf(currentPlayer)
    return players[1 - currentIndex]
  }

  const currentIndex = players.indexOf(currentPlayer)
  const steps = Math.floor(players.length / 2)
  const acrossIndex = (currentIndex - steps + players.length) % players.length
  return players[acrossIndex]
}
