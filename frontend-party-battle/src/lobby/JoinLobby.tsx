import Loading from '@/components/loading'
import { usePartyCode } from '@/src/storage/userPreferencesStore'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLobbyStore } from './useLobbyStore'

export function JoinLobby() {
  const { joinById, leaveRoom, roomId, isLoading } = useLobbyStore(
    useShallow((state) => ({
      joinById: state.joinById,
      leaveRoom: state.leaveRoom,
      roomId: state.roomId,
      isLoading: state.isLoading,
    }))
  )
  const { partyCode } = usePartyCode()

  useEffect(() => {
    if (partyCode && !isLoading && partyCode !== roomId) {
      const join = async () => {
        const { success } = await joinById(partyCode)
        if (!success) {
          await leaveRoom()
          router.replace('/')
        }
      }
      join()
    }
  }, [partyCode, joinById, roomId, isLoading, leaveRoom])

  return <Loading />
}
