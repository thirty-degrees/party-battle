import { useRive, useViewModelInstanceColor, useViewModelInstanceTrigger } from '@rive-app/react-canvas'
import { useEffect } from 'react'
import { ArrowButtonComponent } from './ArrowButtons.types'

export const ArrowButtons: ArrowButtonComponent = ({ style, color, onUp, onRight, onDown, onLeft }) => {
  const { RiveComponent, rive } = useRive({
    src: require('../../../assets/rive/arrowbuttons.riv'),
    stateMachines: 'State Machine 1',
    autoplay: true,
    autoBind: true,
  })

  const { setRgba } = useViewModelInstanceColor('Background', rive?.viewModelInstance)
  useEffect(() => {
    setRgba(color.r, color.g, color.b, color.a)
  }, [color, setRgba])

  useViewModelInstanceTrigger('Button_up/Down', rive?.viewModelInstance, {
    onTrigger: () => {
      onUp()
    },
  })

  useViewModelInstanceTrigger('Button_right/Down', rive?.viewModelInstance, {
    onTrigger: () => {
      onRight()
    },
  })

  useViewModelInstanceTrigger('Button_down/Down', rive?.viewModelInstance, {
    onTrigger: () => {
      onDown()
    },
  })

  useViewModelInstanceTrigger('Button_left/Down', rive?.viewModelInstance, {
    onTrigger: () => {
      onLeft()
    },
  })

  return <RiveComponent style={style} />
}
