import Loading from '@/components/loading'
import { usePartyCode } from '@/src/storage/userPreferencesStore'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from './useLobbyStore'

export function JoinLobby() {
  const { joinById, roomId, isLoading } = useLobbyStore(
    useShallow((state) => ({
      joinById: state.joinById,
      roomId: state.roomId,
      isLoading: state.isLoading,
    }))
  )
  const { partyCode } = usePartyCode()

  useEffect(() => {
    if (partyCode && !isLoading && partyCode !== roomId) {
      const join = async () => {
        const success = await joinById(partyCode)
        if (!success) {
          router.push('/')
        }
      }
      join()
    }
  }, [partyCode, joinById, roomId, isLoading])

  return <Loading />
}
