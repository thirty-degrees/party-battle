import Loading from '@/components/loading'
import { usePartyCode } from '@/src/storage/userPreferencesStore'
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
      joinById(partyCode)
    }
  }, [partyCode, joinById, roomId, isLoading])

  return <Loading />
}
