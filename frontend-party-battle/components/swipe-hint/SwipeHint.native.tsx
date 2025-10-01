import { RiveAnimation } from '@/components/rive-animation'
import { useEffect } from 'react'
import { Fit, useRive } from 'rive-react-native'
import { SwipeHintComponent } from './SwipeHint.types'

export const SwipeHint: SwipeHintComponent = ({ style, playAnimation }) => {
  const [setRive, rive] = useRive()

  useEffect(() => {
    if (rive && playAnimation) {
      rive.play()
    }
  }, [rive, playAnimation])

  return (
    <RiveAnimation
      ref={setRive}
      source={require('../../assets/rive/swipehint.riv')}
      autoplay={false}
      style={style}
      dataBinding={{ type: 'empty' }}
      fit={Fit.Cover}
    />
  )
}
