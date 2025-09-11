import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Animated, Dimensions, PanResponder, SafeAreaView, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PotatoDirection, PotatoGameSchema } from 'types-party-battle'
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
  const status = useColyseusState(gameRoom, (state) => state.status)
  const remainingPlayers = useColyseusState(gameRoom, (state) => [...state.remainingPlayers])
  const playerSlotAssignments = assignPlayerSlotPositions(remainingPlayers, trimmedPlayerName)
  const translateX = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(1)).current
  const [potatoPos, setPotatoPos] = useState<{ left: number; top: number } | null>(null)
  const prevPlayerWithPotato = useRef<string | undefined>(undefined)

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

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 20 || Math.abs(g.dy) > 20,
        onPanResponderRelease: (_, g) => {
          if (status !== 'playing') return

          const canLeft = !!playerSlotAssignments.left
          const canRight = !!playerSlotAssignments.right
          const canAcross = !!playerSlotAssignments.top

          if (Math.abs(g.dx) > Math.abs(g.dy)) {
            const dir: PotatoDirection = g.dx > 0 ? 'right' : 'left'
            const allowed = dir === 'right' ? canRight : canLeft
            if (!allowed) return
            gameRoom.send<PotatoDirection>('PassPotato', dir)
            const toX = dir === 'right' ? safeAreaWidth : -safeAreaWidth
            Animated.parallel([
              Animated.timing(translateX, { toValue: toX, duration: 500, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0.2, duration: 500, useNativeDriver: true }),
            ]).start()
          } else if (g.dy < 0) {
            if (!canAcross) return
            gameRoom.send<PotatoDirection>('PassPotato', 'across')
            Animated.parallel([
              Animated.timing(translateY, { toValue: -safeAreaHeight, duration: 500, useNativeDriver: true }),
              Animated.timing(opacity, { toValue: 0.2, duration: 500, useNativeDriver: true }),
            ]).start()
          }
        },
      }),
    [
      gameRoom,
      opacity,
      playerSlotAssignments.left,
      playerSlotAssignments.right,
      playerSlotAssignments.top,
      safeAreaHeight,
      safeAreaWidth,
      status,
      translateX,
      translateY,
    ]
  )

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window)
    })

    return () => subscription?.remove()
  }, [])

  useEffect(() => {
    const justReceived =
      playerWithPotato === trimmedPlayerName && prevPlayerWithPotato.current !== trimmedPlayerName

    if (justReceived) {
      translateX.setValue(0)
      translateY.setValue(0)
      opacity.setValue(1)

      const left = Math.random() * (safeAreaWidth - itemSize - 100)
      const top = Math.random() * (safeAreaHeight - halfCircleRibbonHeight - 134 - padding)
      setPotatoPos({ left, top })
    }

    prevPlayerWithPotato.current = playerWithPotato
  }, [
    halfCircleRibbonHeight,
    itemSize,
    opacity,
    padding,
    playerWithPotato,
    safeAreaHeight,
    safeAreaWidth,
    translateX,
    translateY,
    trimmedPlayerName,
  ])

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
              {(playerWithPotato === trimmedPlayerName ||
                prevPlayerWithPotato.current === trimmedPlayerName) &&
                potatoPos && (
                  <Animated.View
                    className="absolute"
                    style={{
                      left: potatoPos.left,
                      top: potatoPos.top,
                      width: 100,
                      height: 134,
                      transform: [{ translateX }, { translateY }],
                      opacity,
                    }}
                    {...panResponder.panHandlers}
                  >
                    <PotatoStack style={{ width: 100 }} />
                  </Animated.View>
                )}
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
