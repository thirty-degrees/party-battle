import { Card } from '@/components/ui/card'
import { Text } from '@/components/ui/text'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useEffect, useRef, useState } from 'react'
import { View } from 'react-native'
import { SimonSide } from 'types-party-battle/types/simon-says/SimonSaysGameSchema'
import { useShallow } from 'zustand/react/shallow'
import { BasicGameView } from '../BasicGameView'
import { GameComponent } from '../GameComponent'
import { SideButtons } from './SideButtons'
import { SlidingBox } from './SlidingBox'
import { useSimonSaysGameStore } from './useSimonSaysStore'

export const SimonSaysGame: GameComponent = () => {
  const { playerName } = usePlayerName()
  const { remainingPlayers, side, isFinalSide, timeWhenDecisionWindowEnds, status, sendMessage } =
    useSimonSaysGameStore(
      useShallow((state) => ({
        remainingPlayers: state.view.remainingPlayers,
        side: state.view.side,
        isFinalSide: state.view.isFinalSide,
        timeWhenDecisionWindowEnds: state.view.timeWhenDecisionWindowEnds,
        status: state.view.status,
        sendMessage: state.sendMessage,
      }))
    )

  const [hasPressed, setHasPressed] = useState(false)
  const [animationDuration, setAnimationDuration] = useState(0)
  const lastTimeWhenEndsRef = useRef<number>(0)

  useEffect(() => {
    if (!isFinalSide) {
      setHasPressed(false)
    }
  }, [isFinalSide])

  const isPlayerInGame = remainingPlayers.includes(playerName)
  const isGamePlaying = status === 'playing'
  const isDecisionWindowActive = isFinalSide && timeWhenDecisionWindowEnds > 0
  const canPress = isGamePlaying && isPlayerInGame

  useEffect(() => {
    if (isDecisionWindowActive && isPlayerInGame && timeWhenDecisionWindowEnds > 0) {
      if (timeWhenDecisionWindowEnds !== lastTimeWhenEndsRef.current) {
        lastTimeWhenEndsRef.current = timeWhenDecisionWindowEnds
        const remaining = Math.max(0, timeWhenDecisionWindowEnds - Date.now())
        if (remaining > 0) {
          setAnimationDuration(remaining)
        }
      }
    } else {
      setAnimationDuration(0)
      lastTimeWhenEndsRef.current = 0
    }
  }, [isDecisionWindowActive, isPlayerInGame, timeWhenDecisionWindowEnds])

  const handleSidePress = (pressedSide: SimonSide) => {
    console.log('handleSidePress', pressedSide, isPlayerInGame, hasPressed, canPress)
    if (isPlayerInGame && !hasPressed && canPress) {
      setHasPressed(true)
      sendMessage<SimonSide>('SidePressed', pressedSide)
    }
  }

  return (
    <BasicGameView>
      <View className="absolute top-0 left-0 right-0 z-10">
        <Card className="mx-1 mt-1">
          <Text className="text-center text-m">
            A glove slides out on either side. Press the button fast where the glove is fully extended.
          </Text>
          <Text className="text-center text-s text-muted-foreground mt-1">It can fake a side.</Text>
        </Card>
      </View>

      <View className="flex-1 justify-center items-center">
        <SlidingBox
          side={side}
          isFinalSide={isFinalSide}
          durationMs={isDecisionWindowActive && isPlayerInGame ? animationDuration : 0}
          isProgressActive={isDecisionWindowActive && isPlayerInGame}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0">
        {isPlayerInGame ? (
          <SideButtons side={side} onPress={handleSidePress} disabled={hasPressed || !canPress} />
        ) : (
          <Card className="bg-red-500 dark:bg-red-600 mx-4 mb-4 h-12 p-0 flex items-center justify-center">
            <Text className="text-white text-center text-xl font-bold">You are out!</Text>
          </Card>
        )}
      </View>
    </BasicGameView>
  )
}
