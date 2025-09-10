type PlayerSlot =
  | 'verticalLeft'
  | 'verticalRight'
  | 'top'
  | 'topLeft'
  | 'topCenterLeft'
  | 'topRight'
  | 'topCenterRight'

export const assignPlayerSlots = (
  remainingPlayers: string[],
  currentPlayer: string
): Record<PlayerSlot, string> => {
  const opponents = remainingPlayers.filter((player) => player !== currentPlayer)
  const slotAssignments: Record<PlayerSlot, string> = {} as Record<PlayerSlot, string>

  const topRowSlots: PlayerSlot[] = ['topLeft', 'topRight', 'topCenterLeft', 'topCenterRight', 'top']

  let opponentIndex = 0

  if (opponents.length === 1) {
    slotAssignments.top = opponents[0]
    return slotAssignments
  }

  if (opponents.length >= 2) {
    slotAssignments.verticalLeft = opponents[opponentIndex++]
    slotAssignments.verticalRight = opponents[opponentIndex++]
  }

  for (let i = 0; i < topRowSlots.length && opponentIndex < opponents.length; i++) {
    slotAssignments[topRowSlots[i]] = opponents[opponentIndex++]
  }

  return slotAssignments
}
