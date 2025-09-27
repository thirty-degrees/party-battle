import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { Redirect, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import LeaveLobbyButton from './LeaveLobbyButton'
import PartyCode from './PartyCode'
import PlayerList from './PlayerList'
import QrCodeButton from './QrCodeButton'
import ReadyButton from './ReadyButton'
import ShareButton from './ShareButton'

export default function LobbyContent() {
  const { roomId, currentGame, currentGameRoomId } = useLobbyStore(
    useShallow((state) => ({
      roomId: state.roomId,
      currentGame: state.lobby.currentGame,
      currentGameRoomId: state.lobby.currentGameRoomId,
    }))
  )

  const router = useRouter()

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      router.push(`/games/${currentGame}?roomId=${currentGameRoomId}`)
    }
  }, [currentGame, currentGameRoomId, router])

  if (!roomId) {
    return <Redirect href="/" />
  }

  return (
    <>
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
              <View className="flex-row w-full">
                <PlayerList />
              </View>

              <ReadyButton />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}
