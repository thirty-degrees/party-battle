import { View } from 'react-native'
import { useSpaceInvadersStore } from '../useSpaceInvadersStore'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useShallow } from 'zustand/react/shallow'
import { ArrowButtons } from '../../snake/ArrowButtons'
import { Button } from '@/components/ui/button'
import { Direction } from 'types-party-battle/types/snake/DirectionSchema'

export function SpaceControls() {
  const { playerName } = usePlayerName()
  const { sendMessage, currentPlayerColor } = useSpaceInvadersStore(
    useShallow((state) => ({
      sendMessage: state.sendMessage,
      currentPlayerColor: state.view.players.find((player) => player.name === playerName)?.color,
    }))
  )
  if (!currentPlayerColor) {
    return null
  }
  const color = { r: currentPlayerColor.r, g: currentPlayerColor.g, b: currentPlayerColor.b, a: 255 }
  return (
    <View className="absolute top-0 left-0 w-full h-full items-center justify-end pb-10">
      <ArrowButtons
        style={{ width: 250, height: 250, opacity: 0.5 }}
        color={color}
        onUp={() => sendMessage<Direction>('SetHeading', 'up')}
        onRight={() => sendMessage<Direction>('SetHeading', 'right')}
        onDown={() => sendMessage<Direction>('SetHeading', 'down')}
        onLeft={() => sendMessage<Direction>('SetHeading', 'left')}
      />
      <View className="flex-row gap-3 mt-4">
        <Button onPressIn={() => sendMessage<boolean>('SetGas', true)} onPressOut={() => sendMessage<boolean>('SetGas', false)}>
          Gas
        </Button>
        <Button onPress={() => sendMessage('Fire')}>Fire</Button>
      </View>
    </View>
  )
}
