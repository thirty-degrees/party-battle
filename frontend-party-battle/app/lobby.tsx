import { ConnectionLostScreen } from '@/src/lobby/ConnectionLost'
import { JoinLobby } from '@/src/lobby/JoinLobby'
import LobbyContent from '@/src/lobby/LobbyContent'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePartyCode } from '@/src/storage/userPreferencesStore'
import { useIsFocused } from '@react-navigation/native'
import { Redirect } from 'expo-router'
import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'

export default function LobbyScreen() {
  const { roomId, error, connectionLost } = useLobbyStore(
    useShallow((state) => ({
      roomId: state.roomId,
      error: state.roomError,
      connectionLost: state.connectionLost,
    }))
  )
  const isFocused = useIsFocused()
  const { partyCode, setPartyCode } = usePartyCode()

  useEffect(() => {
    if (roomId && partyCode !== roomId && !connectionLost && !error) {
      setPartyCode(roomId)
    }
  }, [partyCode, setPartyCode, roomId, connectionLost, error])

  if (!isFocused) {
    return null
  }

  if (!roomId && !partyCode) {
    return <Redirect href="/" />
  }

  if (connectionLost) {
    return <ConnectionLostScreen />
  }

  if (!roomId && partyCode) {
    return <JoinLobby />
  }

  if (error) {
    throw error
  }

  return <LobbyContent />
}
