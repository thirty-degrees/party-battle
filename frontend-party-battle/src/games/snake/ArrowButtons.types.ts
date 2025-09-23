import { JSX } from 'react'

type ArrowButtonProps = {
  style?: { width?: number; height?: number }
}

export type ArrowButtonComponent = (props: ArrowButtonProps) => JSX.Element
