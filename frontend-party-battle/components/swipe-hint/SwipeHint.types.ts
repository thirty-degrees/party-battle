import { JSX } from 'react'

type SwipeHintProps = {
  style?: { width?: number; height?: number; opacity?: number }
  playAnimation: boolean
}

export type SwipeHintComponent = (props: SwipeHintProps) => JSX.Element
