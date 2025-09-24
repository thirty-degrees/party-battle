import { RiveAnimation } from '@/components/rive-animation'
import { useEffect } from 'react'
import { AutoBind, useRive, useRiveColor, useRiveTrigger } from 'rive-react-native'
import { ArrowButtonComponent } from './ArrowButtons.types'

export const ArrowButtons: ArrowButtonComponent = ({ style, color, onUp, onRight, onDown, onLeft }) => {
  const [setRive, rive] = useRive()

  const [, setBackgroundColor] = useRiveColor(rive, 'Background')

  useEffect(() => {
    if (rive) {
      setBackgroundColor(color)
    }
  }, [rive, setBackgroundColor, color])

  useRiveTrigger(rive, 'Button_up/Down', () => {
    onUp()
  })

  useRiveTrigger(rive, 'Button_right/Down', () => {
    onRight()
  })

  useRiveTrigger(rive, 'Button_down/Down', () => {
    onDown()
  })

  useRiveTrigger(rive, 'Button_left/Down', () => {
    onLeft()
  })

  return (
    <RiveAnimation
      ref={setRive}
      dataBinding={AutoBind(true)}
      source={require('../../../assets/rive/arrowbuttons.riv')}
      stateMachineName="State Machine 1"
      autoplay
      style={style}
    />
  )
}
