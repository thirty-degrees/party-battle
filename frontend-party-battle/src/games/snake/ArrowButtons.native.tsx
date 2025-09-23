import { RiveAnimation } from '@/components/rive-animation'

export function ArrowButtons() {
  return (
    <RiveAnimation
      source={require('../../../assets/rive/arrowbuttons.riv')}
      stateMachineName="State Machine 1"
      autoplay
      style={{ width: 400, height: 400 }}
    />
  )
}
