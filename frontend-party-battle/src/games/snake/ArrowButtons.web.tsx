import { useRive } from '@rive-app/react-canvas'
import { ArrowButtonComponent } from './ArrowButtons.types'

export const ArrowButtons: ArrowButtonComponent = ({ style }) => {
  const { RiveComponent } = useRive({
    src: require('../../../assets/rive/arrowbuttons.riv'),
    stateMachines: 'State Machine 1',
    autoplay: true,
  })

  return <RiveComponent style={style} />
}
