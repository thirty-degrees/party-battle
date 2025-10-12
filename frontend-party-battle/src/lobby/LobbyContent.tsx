import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import LeaveLobbyButton from './LeaveLobbyButton'
import LobbyConfigurationButton from './LobbyConfigurationButton'
import PartyCode from './PartyCode'
import PlayerCount from './PlayerCount'
import PlayerList from './playerList/PlayerList'
import QrCodeButton from './QrCodeButton'
import ReadyButton from './ReadyButton'
import ShareButton from './ShareButton'

export default function LobbyContent() {
  const { currentGame, currentGameRoomId, areAllPlayersReady } = useLobbyStore(
    useShallow((state) => ({
      currentGame: state.view.currentGame,
      currentGameRoomId: state.view.currentGameRoomId,
      areAllPlayersReady:
        Object.values(state.view.players).length >= 2 &&
        Object.values(state.view.players).every((player: { ready?: boolean }) => player.ready),
    }))
  )

  const router = useRouter()

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      router.push(`/games/${currentGame}`)
    }
  }, [currentGame, currentGameRoomId, router])

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full gap-6 items-center">
          <View className="flex-row items-center justify-between gap-2 w-full">
            <PartyCode />
            <View className="flex-row items-center justify-end gap-2">
              <ShareButton />
              <QrCodeButton />
              <LeaveLobbyButton />
            </View>
          </View>
          <View className="flex-1 w-full justify-between">
            <PlayerCount />
            <PlayerList />
            <View className="flex-row gap-2 justify-center">
              <LobbyConfigurationButton />
              <ReadyButton disabled={areAllPlayersReady} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
