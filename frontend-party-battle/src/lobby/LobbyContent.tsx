import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { LogOutIcon, QrCodeIcon, ShareIcon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { QrCodeModal } from '@/src/lobby/QrCodeModal'
import createWebURL from '@/src/utils/createWebUrl'
import { blurActiveElement } from '@/src/utils/focusUtils'
import { Room } from 'colyseus.js'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Share, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LobbySchema } from 'types-party-battle/types/LobbySchema'
import PartyCode from './PartyCode'
import PlayerList from './PlayerList'

export interface PlayerData {
  name: string
  ready: boolean
  color: string
}

interface LobbyContentProps {
  lobbyRoom: Room<LobbySchema>
}

export default function LobbyContent({ lobbyRoom }: LobbyContentProps) {
  const currentGame = useColyseusState(lobbyRoom, (state) => state.currentGame)
  const currentGameRoomId = useColyseusState(lobbyRoom, (state) => state.currentGameRoomId)
  const playerCount = useColyseusState(lobbyRoom, (state) => Array.from(state.players?.values() || []).length)

  const [isReady, setIsReady] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const router = useRouter()
  const { leaveLobbyRoom } = useLobbyRoomContext()

  const partyCode = lobbyRoom.roomId
  const shareUrl = createWebURL(`/?partyCode=${partyCode}`)

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      setIsQrModalOpen(false)
      router.push(`/games/${currentGame}?roomId=${currentGameRoomId}`)
    }
  }, [currentGame, currentGameRoomId, router])

  const handleToggleReady = () => {
    lobbyRoom.send('SetPlayerReady', !isReady)
    setIsReady((prev) => !prev)

    blurActiveElement()
  }

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
              <View className="flex-col items-left">
                <PartyCode partyCode={partyCode} />
              </View>
              <View className="flex-row items-center justify-end gap-2">
                <Button size="md" variant="outline" className="p-2.5" onPress={handleShare}>
                  <ButtonIcon as={ShareIcon} />
                </Button>
                <Button size="md" variant="outline" className="p-2.5" onPress={() => setIsQrModalOpen(true)}>
                  <ButtonIcon as={QrCodeIcon} />
                </Button>
                <Button size="md" action="negative" className="p-2.5" onPress={handleLeaveParty}>
                  <ButtonIcon as={LogOutIcon} />
                </Button>
              </View>
            </View>
            <View className="flex-1 w-full justify-between">
              <View className="flex-row w-full">
                <PlayerList lobbyRoom={lobbyRoom} />
              </View>

              <View className="flex-col justify-end">
                <View className="flex-row w-full justify-center">
                  <Button size="xl" action={'primary'} onPress={handleToggleReady}>
                    <ButtonText>{isReady ? 'CANCEL' : 'PLAY'}</ButtonText>
                  </Button>
                </View>

                <View className="h-8 justify-center items-center">
                  {isReady && playerCount < 2 ? (
                    <Text className="text-sm text-typography-600 dark:text-typography-400">
                      Need 1 more player to start.
                    </Text>
                  ) : null}
                </View>
              </View>
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
