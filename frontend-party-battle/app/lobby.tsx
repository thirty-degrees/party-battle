import { ConnectionLostScreen } from '@/src/lobby/ConnectionLost'
import { JoinLobby } from '@/src/lobby/JoinLobby'
import LobbyContent from '@/src/lobby/LobbyContent'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePartyCode } from '@/src/storage/userPreferencesStore'
import { useIsFocused } from '@react-navigation/native'
import { Redirect } from 'expo-router'
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
  const { partyCode } = usePartyCode()

  if (!isFocused) {
    return null
  }

  if (!roomId && !partyCode) {
    return <Redirect href="/" />
  }

  if (connectionLost) {
    return <ConnectionLostScreen />
  }

  if (error) {
    throw error
  }

  if (!roomId && partyCode) {
    return <JoinLobby />
  }

  return <LobbyContent />
}
