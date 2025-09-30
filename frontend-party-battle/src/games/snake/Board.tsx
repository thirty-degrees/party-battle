import { View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import useBasicGameViewDimensions from '../useBasicGameViewDimensions'
import { Cell } from './Cell'
import { useSnakeGameStore } from './useSnakeStore'

export const Board = () => {
  const { width, height } = useSnakeGameStore(
    useShallow((state) => ({
      width: state.view.width,
      height: state.view.height,
    }))
  )
  const { availableWidth, availableHeight } = useBasicGameViewDimensions()

  const cellSize = Math.min(availableWidth / width, availableHeight / height)

  const boardWidth = cellSize * width
  const boardHeight = cellSize * height

  return (
    <View
      className="items-center"
      style={{
        width: boardWidth,
        height: boardHeight,
      }}
    >
      <View
        style={{
          width: boardWidth,
          height: boardHeight,
          position: 'relative',
        }}
      >
        {Array.from({ length: width * height }, (_, index) => (
          <Cell key={index} index={index} width={width} cellSize={cellSize} />
        ))}
      </View>
    </View>
  )
}
