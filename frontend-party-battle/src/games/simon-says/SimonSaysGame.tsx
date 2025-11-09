import TimerProgressBar from '@/src/games/pick-cards/TimerProgressBar'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useEffect, useState } from 'react'
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
  const { remainingPlayers, side, isFinalSide, timeWhenDecisionWindowEnds, sendMessage } =
    useSimonSaysGameStore(
      useShallow((state) => ({
        remainingPlayers: state.view.remainingPlayers,
        side: state.view.side,
        isFinalSide: state.view.isFinalSide,
        timeWhenDecisionWindowEnds: state.view.timeWhenDecisionWindowEnds,
        sendMessage: state.sendMessage,
      }))
    )

  const [hasPressed, setHasPressed] = useState(false)

  useEffect(() => {
    if (!isFinalSide) {
      setHasPressed(false)
    }
  }, [isFinalSide, side])

  const isPlayerInGame = remainingPlayers.includes(playerName)
  const isDecisionWindowActive = isFinalSide && timeWhenDecisionWindowEnds > 0
  const isTimerExpired = isDecisionWindowActive && Date.now() >= timeWhenDecisionWindowEnds

  const handleSidePress = (pressedSide: SimonSide) => {
    if (isPlayerInGame && !hasPressed && !isTimerExpired) {
      setHasPressed(true)
      sendMessage<SimonSide>('SidePressed', pressedSide)
    }
  }

  return (
    <BasicGameView>
      <View className="flex-1 justify-between">
        <View className="flex-1 items-center justify-center pt-8">
          <SlidingBox side={side} isFinalSide={isFinalSide} />
        </View>

        <View className="items-center mb-4">
          {isDecisionWindowActive && isPlayerInGame && (
            <TimerProgressBar
              timeWhenTimerIsOver={timeWhenDecisionWindowEnds}
              isActive={isDecisionWindowActive}
            />
          )}
        </View>

        <SideButtons
          side={side}
          onPress={handleSidePress}
          disabled={!isPlayerInGame || hasPressed || isTimerExpired}
        />
      </View>
    </BasicGameView>
  )
}
