import { RiveAnimation } from '@/components/rive-animation'
import { ViewStyle } from 'react-native'

type ArrowButtonsProps = {
  style?: ViewStyle
}

export function ArrowButtons({ style }: ArrowButtonsProps) {
  return (
    <RiveAnimation
      source={require('../../../assets/rive/arrowbuttons.riv')}
      stateMachineName="State Machine 1"
      autoplay
      style={style}
    />
  )
}
