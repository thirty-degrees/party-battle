import LobbyContent from '@/lobby/LobbyContent';
import { useLobbyContext } from '@/lobby/LobbyProvider';
import { Redirect } from 'expo-router';

export default function LobbyScreen() {
  const { room } = useLobbyContext();

  if (!room) {
    return <Redirect href="/" />;
  }

  return <LobbyContent room={room} />;
}
