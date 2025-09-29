import { ConnectionLostScreen } from '@/src/lobby/ConnectionLost'
import LobbyContent from '@/src/lobby/LobbyContent'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { useIsFocused } from '@react-navigation/native'
import { useShallow } from 'zustand/react/shallow'

export default function LobbyScreen() {
  const { error, connectionLost } = useLobbyStore(
    useShallow((state) => ({ error: state.roomError, connectionLost: state.connectionLost }))
  )
  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  if (connectionLost) {
    return <ConnectionLostScreen />
  }

  if (error) {
    throw error
  }

  return <LobbyContent />
}
