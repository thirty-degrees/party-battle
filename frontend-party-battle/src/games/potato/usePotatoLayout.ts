import useBasicGameViewDimensions from '../useBasicGameViewDimensions'

export default function usePotatoLayout() {
  const { availableWidth, availableHeight } = useBasicGameViewDimensions()

  const radius = availableWidth / 2
  const itemSize = availableWidth / 5
  const halfCircleRibbonHeight = radius + itemSize / 2

  return { availableWidth, availableHeight, radius, itemSize, halfCircleRibbonHeight }
}
