import { usePartyCode } from '../storage/userPreferencesStore'
import { useLobbyStore } from './useLobbyStore'

export function useLeaveParty() {
  const { setPartyCode } = usePartyCode()
  const leaveRoom = useLobbyStore((state) => state.leaveRoom)

  const leaveParty = async () => {
    setPartyCode('')
    await leaveRoom()
  }

  return { leaveParty }
}
