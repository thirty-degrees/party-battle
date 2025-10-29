import { Text } from '@/components/ui/text'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { useEffect, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Direction } from 'types-party-battle/types/snake/DirectionSchema'
import { FIRE_COOLDOWN_MS } from 'types-party-battle/types/space-invaders/SpaceInvadersGameSchema'
import { useShallow } from 'zustand/react/shallow'
import { ArrowButtons } from '../../snake/ArrowButtons'
import { useSpaceInvadersStore } from '../useSpaceInvadersStore'

export function SpaceControls() {
  const { playerName } = usePlayerName()
  const { sendMessage, currentPlayerColor } = useSpaceInvadersStore(
    useShallow((s) => ({
      sendMessage: s.sendMessage,
      currentPlayerColor: s.view.players.find((p) => p.name === playerName)?.color,
    }))
  )

  const [remainingMs, setRemainingMs] = useState(0)
  const canFire = remainingMs <= 0

  useEffect(() => {
    if (remainingMs <= 0) return
    const id = setInterval(() => {
      setRemainingMs((prev) => Math.max(0, prev - 50))
    }, 50)
    return () => clearInterval(id)
  }, [remainingMs])

  const onFire = () => {
    if (!canFire) return
    sendMessage('Fire')
    setRemainingMs(FIRE_COOLDOWN_MS)
  }

  if (!currentPlayerColor) return null

  const rgba = { r: currentPlayerColor.r, g: currentPlayerColor.g, b: currentPlayerColor.b, a: 255 }

  return (
    <View className="w-full flex-row items-center justify-center gap-5 p-3">
      <ArrowButtons
        style={{ width: 150, height: 150, opacity: 0.5 }}
        color={rgba}
        onUp={() => {
          sendMessage<Direction>('SetHeading', 'up')
          sendMessage<boolean>('SetGas', true)
        }}
        onUpRelease={() => sendMessage<boolean>('SetGas', false)}
        onRight={() => {
          sendMessage<Direction>('SetHeading', 'right')
          sendMessage<boolean>('SetGas', true)
        }}
        onRightRelease={() => sendMessage<boolean>('SetGas', false)}
        onDown={() => {
          sendMessage<Direction>('SetHeading', 'down')
          sendMessage<boolean>('SetGas', true)
        }}
        onDownRelease={() => sendMessage<boolean>('SetGas', false)}
        onLeft={() => {
          sendMessage<Direction>('SetHeading', 'left')
          sendMessage<boolean>('SetGas', true)
        }}
        onLeftRelease={() => sendMessage<boolean>('SetGas', false)}
      />
      <Pressable
        onPressIn={onFire}
        disabled={!canFire}
        className="flex-1 h-[150] rounded-2xl items-center justify-center flex-col relative overflow-hidden border-4 border-red-600"
      >
        <View
          className="absolute bottom-0 left-0 right-0 bg-red-600"
          style={{ height: `${(remainingMs / FIRE_COOLDOWN_MS) * 100}%` }}
        />
        <View className="relative z-10">
          <Text className="text-5xl font-extrabold text-red-900">FIRE</Text>
        </View>
      </Pressable>
    </View>
  )
}
