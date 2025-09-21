import LobbyContent from '@/src/lobby/LobbyContent'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { useIsFocused } from '@react-navigation/native'
import { Redirect } from 'expo-router'

export default function LobbyScreen() {
  const { lobbyRoom } = useLobbyRoomContext()
  const isFocused = useIsFocused()

  if (!isFocused) {
    return null
  }

  if (!lobbyRoom) {
    return <Redirect href="/" />
  }

  return <LobbyContent lobbyRoom={lobbyRoom} />
}
