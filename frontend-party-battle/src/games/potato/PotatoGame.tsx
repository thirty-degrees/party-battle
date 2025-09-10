import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, Text, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
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
      element: <PlayerSlot playerName={'123456789012345'} playerWithPotato={'123456789012345'} />,
    },
    {
      id: 'topCenterLeft',
      element: <PlayerSlot playerName={'123456789012345'} playerWithPotato={'123456789012345'} />,
    },
    {
      id: 'top',
      element: <PlayerSlot playerName={'123456789012345'} playerWithPotato={'123456789012345'} />,
    },
    {
      id: 'topCenterRight',
      element: <PlayerSlot playerName={'123456789012345'} playerWithPotato={'123456789012345'} />,
    },
    {
      id: 'topRight',
      element: <PlayerSlot playerName={'123456789012345'} playerWithPotato={'123456789012345'} />,
    },
  ]

  const [dimensions, setDimensions] = useState(Dimensions.get('window'))
  const maxWidth = 448 // max-w-md in Tailwind is 448px
  const safeAreaWidth = Math.min(dimensions.width - 32, maxWidth) // Subtract padding (p-4 = 16px * 2)
  const radius = safeAreaWidth / 2
  const itemSize = safeAreaWidth / 5

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })

    return () => subscription?.remove()
  }, [])

  console.log(playerSlotAssignments, message)

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full">
          <HalfCircleRibbon
            radius={radius}
            itemSize={itemSize}
            items={topItems}
            centerItem={<Text className="text-5xl font-bold dark:text-white text-black">{13}</Text>}
          />

          <View className="absolute inset-x-4 top-1/2 flex-row justify-between">
            <PlayerSlot playerName={'left'} playerWithPotato={'left'} className="transform -rotate-90" />
            <PlayerSlot playerName={'right'} playerWithPotato={'right'} className="transform rotate-90" />
          </View>

          <View className="flex-1 items-center">
            <View
              className="bg-red-500 relative overflow-hidden flex-1"
              style={{ width: safeAreaWidth - itemSize }}
            >
              {playerWithPotato === trimmedPlayerName && (
                <View
                  className="absolute"
                  style={{
                    left: Math.random() * (safeAreaWidth - itemSize - 150),
                    top: Math.random() * (dimensions.height - (radius + itemSize / 2) - 240),
                  }}
                >
                  <PotatoStack style={{ width: 150 }} />
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
