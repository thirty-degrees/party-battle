import { useRive } from '@rive-app/react-canvas'
import { CSSProperties } from 'react'

type ArrowButtonsProps = {
  style?: CSSProperties
}

export function ArrowButtons({ style }: ArrowButtonsProps) {
  const { RiveComponent } = useRive({
    src: require('../../../assets/rive/arrowbuttons.riv'),
    stateMachines: 'State Machine 1',
    autoplay: true,
  })

  return <RiveComponent style={style} />
}
