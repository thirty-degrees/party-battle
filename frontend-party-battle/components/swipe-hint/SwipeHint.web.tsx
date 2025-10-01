import { Fit, Layout, useRive } from '@rive-app/react-canvas'
import { useEffect } from 'react'
import { SwipeHintComponent } from './SwipeHint.types'

export const SwipeHint: SwipeHintComponent = ({ style, playAnimation }) => {
  const { RiveComponent, rive } = useRive({
    src: require('../../assets/rive/swipehint.riv'),
    autoplay: false,
    layout: new Layout({
      fit: Fit.Fill,
    }),
  })

  useEffect(() => {
    if (rive && playAnimation) {
      rive.play()
    }
  }, [rive, playAnimation])

  return <RiveComponent style={style} />
}
