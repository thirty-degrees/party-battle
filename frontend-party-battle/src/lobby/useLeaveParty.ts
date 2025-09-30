import { useRouter } from 'expo-router'
import { usePartyCode } from '../storage/userPreferencesStore'
import { useLobbyStore } from './useLobbyStore'

export function useLeaveParty() {
  const { setPartyCode } = usePartyCode()
  const router = useRouter()
  const leaveRoom = useLobbyStore((state) => state.leaveRoom)

  const leaveParty = async () => {
    setPartyCode('')
    await leaveRoom()
    router.push('/')
  }

  return { leaveParty }
}
