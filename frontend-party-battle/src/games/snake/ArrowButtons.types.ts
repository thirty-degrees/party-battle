import { JSX } from 'react'

type ArrowButtonProps = {
  style?: { width?: number; height?: number }
  color: { r: number; g: number; b: number; a: number }
  onUp: () => void
  onRight: () => void
  onDown: () => void
  onLeft: () => void
}

export type ArrowButtonComponent = (props: ArrowButtonProps) => JSX.Element
