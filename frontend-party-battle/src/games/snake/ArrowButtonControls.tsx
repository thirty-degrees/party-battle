import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { View } from 'react-native'
import { Direction } from 'types-party-battle/types/snake/RemainingPlayerSchema'
import { useShallow } from 'zustand/react/shallow'
import { ArrowButtons } from './ArrowButtons'
import { useSnakeGameStore } from './useSnakeStore'

export const ArrowButtonControls = () => {
  const { playerName } = usePlayerName()
  const currentPlayerColor = useSnakeGameStore(
    useShallow((state) => state.view.players.find((player) => player.name === playerName)?.color)
  )
  const sendMessage = useSnakeGameStore((state) => state.sendMessage)

  if (!currentPlayerColor) return null

  return (
    <View className="absolute top-0 left-0 w-full h-full items-center justify-end pb-10">
      <ArrowButtons
        style={{ width: 250, height: 250, opacity: 0.5 }}
        color={{
          r: currentPlayerColor.r,
          g: currentPlayerColor.g,
          b: currentPlayerColor.b,
          a: 255,
        }}
        onUp={() => {
          sendMessage<Direction>('ChangeDirection', 'up')
        }}
        onRight={() => {
          sendMessage<Direction>('ChangeDirection', 'right')
        }}
        onDown={() => {
          sendMessage<Direction>('ChangeDirection', 'down')
        }}
        onLeft={() => {
          sendMessage<Direction>('ChangeDirection', 'left')
        }}
      />
    </View>
  )
}
