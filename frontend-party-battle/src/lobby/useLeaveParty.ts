import { usePartyCode, useUserPreferencesStore } from '../storage/userPreferencesStore'
import { useLobbyStore } from './useLobbyStore'

export function useLeaveParty() {
  const { setPartyCode } = usePartyCode()
  const leaveRoom = useLobbyStore((state) => state.leaveRoom)
  const incrementCompletedLobbySessions = useUserPreferencesStore(
    (state) => state.incrementCompletedLobbySessions
  )

  const leaveParty = async () => {
    incrementCompletedLobbySessions()
    setPartyCode('')
    await leaveRoom()
  }

  return { leaveParty }
}
