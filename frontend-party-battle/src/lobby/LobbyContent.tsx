import { Button, ButtonIcon } from '@/components/ui/button'
import { LogOutIcon, QrCodeIcon, ShareIcon } from '@/components/ui/icon'
import { QrCodeModal } from '@/src/lobby/QrCodeModal'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import createWebURL from '@/src/utils/createWebUrl'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Share, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useShallow } from 'zustand/react/shallow'
import PartyCode from './PartyCode'
import PlayerList from './PlayerList'
import ReadyButton from './ReadyButton'

export default function LobbyContent() {
  const { currentGame, currentGameRoomId, roomId, leaveLobbyRoom } = useLobbyStore(
    useShallow((state) => ({
      currentGame: state.lobby.currentGame,
      currentGameRoomId: state.lobby.currentGameRoomId,
      roomId: state.roomId,
      leaveLobbyRoom: state.leaveLobbyRoom,
    }))
  )

  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const router = useRouter()

  const partyCode = roomId || ''
  const shareUrl = createWebURL(`/?partyCode=${partyCode}`)

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      setIsQrModalOpen(false)
      router.push(`/games/${currentGame}?roomId=${currentGameRoomId}`)
    }
  }, [currentGame, currentGameRoomId, router])

  const handleShare = async () => {
    try {
      await Share.share({
        url: shareUrl,
      })
    } catch {}
  }

  const handleLeaveParty = async () => {
    await leaveLobbyRoom()
    router.push('/')
  }

  return (
    <>
      <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
        <View className="flex-1 p-4 justify-center items-center">
          <View className="flex-1 max-w-md w-full gap-6 items-center">
            <View className="flex-row items-center justify-between gap-2 w-full">
              <PartyCode partyCode={partyCode} />
              <View className="flex-row items-center justify-end gap-2">
                <Button size="md" variant="outline" className="p-2" onPress={handleShare}>
                  <ButtonIcon as={ShareIcon} />
                </Button>
                <Button size="md" variant="outline" className="p-2" onPress={() => setIsQrModalOpen(true)}>
                  <ButtonIcon as={QrCodeIcon} />
                </Button>
                <Button size="md" action="negative" className="p-2" onPress={handleLeaveParty}>
                  <ButtonIcon as={LogOutIcon} />
                </Button>
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

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        roomId={partyCode}
        roomUrl={shareUrl}
      />
    </>
  )
}
