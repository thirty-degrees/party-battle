import LobbyContent from '@/src/lobby/LobbyContent'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { Redirect } from 'expo-router'

export default function LobbyScreen() {
  const { lobbyRoom } = useLobbyRoomContext()

  if (!lobbyRoom) {
    return <Redirect href="/" />
  }

  return <LobbyContent lobbyRoom={lobbyRoom} />
}
