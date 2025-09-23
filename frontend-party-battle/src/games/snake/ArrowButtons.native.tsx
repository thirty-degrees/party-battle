import { RiveAnimation } from '@/components/rive-animation'
import { ArrowButtonComponent } from './ArrowButtons.types'

export const ArrowButtons: ArrowButtonComponent = ({ style }) => {
  return (
    <RiveAnimation
      source={require('../../../assets/rive/arrowbuttons.riv')}
      stateMachineName="State Machine 1"
      autoplay
      style={style}
    />
  )
}
