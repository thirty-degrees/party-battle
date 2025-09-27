import LobbyContent from '@/src/lobby/LobbyContent'
import { useIsFocused } from '@react-navigation/native'

export default function LobbyScreen() {
  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  return <LobbyContent />
}
