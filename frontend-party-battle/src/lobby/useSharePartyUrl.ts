import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import createWebURL from '@/src/utils/createWebUrl'

export function useSharePartyUrl() {
  const roomId = useLobbyStore((state) => state.roomId)
  const partyCode = roomId || ''
  return createWebURL(`/?partyCode=${partyCode}`)
}
