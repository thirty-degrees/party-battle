import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useEffect, useState } from 'react'
import { Dimensions, Pressable, SafeAreaView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { POTATO_DIRECTIONS, PotatoDirection, PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import HalfCircleRibbon, { ArcItem } from './HalfCircleRibbon'
import { PlayerSlot } from './PlayerSlot'
import PotatoStack from './PotatoStack'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const { trimmedPlayerName } = usePlayerName()
  const message = useColyseusState(gameRoom, (state) => state.message)
  const playerWithPotato = useColyseusState(gameRoom, (state) => state.playerWithPotato)
  const remainingPlayers = useColyseusState(gameRoom, (state) => [...state.remainingPlayers])
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, trimmedPlayerName)

  const topItems: ArcItem[] = [
    {
      id: 'topLeft',
      element: (
        <PlayerSlot
          className="opacity-50"
          playerName={playerSlotAssignments.topLeft}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'topCenterLeft',
      element: (
        <PlayerSlot
          className="opacity-50"
          playerName={playerSlotAssignments.topCenterLeft}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'top',
      element: <PlayerSlot playerName={playerSlotAssignments.top} playerWithPotato={playerWithPotato} />,
    },
    {
      id: 'topCenterRight',
      element: (
        <PlayerSlot
          className="opacity-50"
          playerName={playerSlotAssignments.topCenterRight}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
    {
      id: 'topRight',
      element: (
        <PlayerSlot
          className="opacity-50"
          playerName={playerSlotAssignments.topRight}
          playerWithPotato={playerWithPotato}
        />
      ),
    },
  ]

  const safeAreaInsets = useSafeAreaInsets()
  const [dimensions, setDimensions] = useState(Dimensions.get('window'))
  const maxWidth = 448 // max-w-md is 448px
  const padding = 32 // p-4 is 16px * 2
  const safeAreaWidth = Math.min(
    dimensions.width - padding - safeAreaInsets.left - safeAreaInsets.right,
    maxWidth
  )
  const safeAreaHeight = dimensions.height - safeAreaInsets.top - safeAreaInsets.bottom
  const radius = safeAreaWidth / 2
  const itemSize = safeAreaWidth / 5
  const halfCircleRibbonHeight = radius + itemSize / 2

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })

    return () => subscription?.remove()
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full">
          <HalfCircleRibbon
            radius={radius}
            itemSize={itemSize}
            items={topItems}
            centerItem={<Text className="text-5xl font-bold dark:text-white text-black">{message}</Text>}
          />

          <View className="absolute inset-x-4 top-1/2 flex-row justify-between">
            <PlayerSlot
              playerName={playerSlotAssignments.left}
              playerWithPotato={playerWithPotato}
              className="transform -rotate-90"
            />
            <PlayerSlot
              playerName={playerSlotAssignments.right}
              playerWithPotato={playerWithPotato}
              className="transform rotate-90"
            />
          </View>

          <View className="flex-1 items-center">
            <View className="relative flex-1" style={{ width: safeAreaWidth - itemSize }}>
              {playerWithPotato === trimmedPlayerName && (
                <Pressable
                  className="absolute"
                  style={{
                    left: Math.random() * (safeAreaWidth - itemSize - 100),
                    top: Math.random() * (safeAreaHeight - halfCircleRibbonHeight - 134 - padding),
                    width: 100,
                    height: 134,
                  }}
                  onPress={() => {
                    const randomDirection =
                      POTATO_DIRECTIONS[Math.floor(Math.random() * POTATO_DIRECTIONS.length)]
                    gameRoom.send<PotatoDirection>('PassPotato', randomDirection)
                  }}
                >
                  <PotatoStack style={{ width: 100 }} />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
