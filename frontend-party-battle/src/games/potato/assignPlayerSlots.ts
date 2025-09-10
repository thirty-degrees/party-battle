import { PlayerSlot } from './PlayerSlot'

export function assignPlayerSlots(
  remainingPlayers: string[],
  currentPlayer: string
): Partial<Record<PlayerSlot, string>> {
  const slotsByCount: Record<number, PlayerSlot[]> = {
    0: [],
    1: ['top'],
    2: ['right', 'left'],
    3: ['right', 'top', 'left'],
    4: ['right', 'topRight', 'top', 'left'],
    5: ['right', 'topRight', 'top', 'topLeft', 'left'],
    6: ['right', 'topRight', 'topCenterRight', 'top', 'topLeft', 'left'],
    7: ['right', 'topRight', 'topCenterRight', 'top', 'topCenterLeft', 'topLeft', 'left'],
  }

  const opponents = getOpponents(remainingPlayers, currentPlayer)

  const maxSlots = 7
  const slots = slotsByCount[Math.min(opponents.length, maxSlots)]
  const result: Partial<Record<PlayerSlot, string>> = {}

  for (let i = 0; i < Math.min(slots.length, opponents.length); i++) {
    result[slots[i]] = opponents[i]
  }

  return result
}

function getOpponents(remainingPlayers: string[], currentPlayer: string): string[] {
  if (remainingPlayers.includes(currentPlayer)) {
    const i = remainingPlayers.indexOf(currentPlayer)
    return remainingPlayers.slice(i + 1).concat(remainingPlayers.slice(0, i))
  } else {
    return remainingPlayers.slice()
  }
}
