import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useEffect, useState } from 'react'
import { Dimensions, SafeAreaView, View } from 'react-native'
import { PotatoGameSchema } from 'types-party-battle'
import useColyseusState from '../../colyseus/useColyseusState'
import { GameComponent } from '../GameComponent'
import { assignPlayerSlotPositions } from './assignPlayerSlotPositions'
import HalfCircleRibbon from './HalfCircleRibbon'
import { PlayerSlot } from './PlayerSlot'
import PotatoStack from './PotatoStack'

export const PotatoGame: GameComponent<PotatoGameSchema> = ({ gameRoom }) => {
  const { trimmedPlayerName } = usePlayerName()
  const message = useColyseusState(gameRoom, (state) => state.message)
  const playerWithPotato = useColyseusState(gameRoom, (state) => state.playerWithPotato)
  const remainingPlayers = useColyseusState(gameRoom, (state) => [...state.remainingPlayers])
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, trimmedPlayerName)

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
  console.log(Dimensions.get('window'))

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950">
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full">
          <HalfCircleRibbon
            radius={radius}
            itemSize={itemSize}
            items={[
              { id: 'tl', label: 'top\nleft' },
              { id: 'tcl', label: 'top\ncenter\nleft' },
              { id: 't', label: 'top' },
              { id: 'tcr', label: 'top\ncenter\nright' },
              { id: 'tr', label: 'top\nright' },
            ]}
          />

          <View className="flex-row justify-center w-full">
            <PlayerSlot playerName={'left'} playerWithPotato={'left'} />
            <View className="flex-1 items-center">
              {playerWithPotato === trimmedPlayerName && <PotatoStack style={{ width: 200 }} />}
            </View>
            <PlayerSlot playerName={'right'} playerWithPotato={'right'} />
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
