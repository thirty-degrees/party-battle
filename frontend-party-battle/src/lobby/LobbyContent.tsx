import SafeAreaPlaceholder from '@/components/SafeAreaPlaceholder'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { LogOutIcon, QrCodeIcon, ShareIcon } from '@/components/ui/icon'
import { QrCodeModal } from '@/components/ui/modal/qr-code-modal'
import { Text } from '@/components/ui/text'
import useColyseusState from '@/src/colyseus/useColyseusState'
import { useLobbyContext } from '@/src/lobby/LobbyProvider'
import PlayerList from '@/src/lobby/PlayerList'
import createWebURL from '@/src/routing/createWebUrl'
import { blurActiveElement } from '@/src/utils/focusUtils'
import { Room } from 'colyseus.js'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Share, View } from 'react-native'
import { GameHistory, LobbySchema } from 'types-party-battle'

export interface PlayerData {
  name: string
  ready: boolean
}

interface LobbyContentProps {
  room: Room<LobbySchema>
}

export default function LobbyContent({ room }: LobbyContentProps) {
  const players = useColyseusState(room, (state) =>
    Array.from(state.players?.entries() || []).map(
      ([id, player]) =>
        [id, { name: player.name, ready: player.ready }] as [string, PlayerData]
    )
  )
  const gameHistories = useColyseusState(room, (state) =>
    Array.from(state.gameHistories?.entries() || []).map(
      ([id, game]) =>
        [id, { gameType: game.gameType, scores: game.scores?.toArray() }] as [
          number,
          GameHistory,
        ]
    )
  )

  const currentGame = useColyseusState(room, (state) => state.currentGame)
  const currentGameRoomId = useColyseusState(
    room,
    (state) => state.currentGameRoomId
  )

  const [isReady, setIsReady] = useState(false)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const router = useRouter()
  const { leaveLobby } = useLobbyContext()

  const partyCode = room.roomId
  const shareUrl = createWebURL(`/?partyCode=${partyCode}`)

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      switch (currentGame) {
        case 'croc':
          router.push(`/games/croc?roomId=${currentGameRoomId}`)
          break
        case 'snake':
          throw new Error('Snake game redirection not implemented yet')
        default:
          throw new Error(`Unknown game type: ${currentGameRoomId}`)
      }
    }
  }, [currentGame, currentGameRoomId, router])

  const onToggleReady = () => {
    room.send('ready', !isReady)
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

  const handleLeaveParty = () => {
    leaveLobby()
    router.push('/')
  }

  return (
    <View className="flex-1 bg-background-0 dark:bg-background-950">
      <SafeAreaPlaceholder position="top" />
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full justify-between items-center">
          <View className="flex-row items-center justify-between gap-2 w-full">
            <View className="flex-col items-center">
              <Text className="text-sm text-typography-600 dark:text-typography-400">
                Party Code
              </Text>
              <Text className="text-md font-semibold">{partyCode}</Text>
            </View>
            <View className="flex-row items-center justify-end gap-2">
              <Button
                size="md"
                variant="outline"
                className="p-2.5"
                onPress={handleShare}
              >
                <ButtonIcon as={ShareIcon} />
              </Button>
              <Button
                size="md"
                variant="outline"
                className="p-2.5"
                onPress={() => setIsQrModalOpen(true)}
              >
                <ButtonIcon as={QrCodeIcon} />
              </Button>
              <Button
                size="md"
                action="negative"
                className="p-2.5"
                onPress={handleLeaveParty}
              >
                <ButtonIcon as={LogOutIcon} />
              </Button>
            </View>
          </View>

          <View className="flex-1 w-full justify-evenly items-center">
            <View className="flex-row w-full">
              <PlayerList
                players={players}
                gameHistories={gameHistories}
                currentPlayerId={room.sessionId}
              />
            </View>

            <View className="flex-row w-full justify-center">
              <Button size="xl" action={'primary'} onPress={onToggleReady}>
                <ButtonText>{isReady ? 'CANCEL' : 'PLAY'}</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaPlaceholder position="bottom" />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        roomId={partyCode}
        roomUrl={shareUrl}
      />
    </View>
  )
}
