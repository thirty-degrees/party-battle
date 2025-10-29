import { useRive, useViewModelInstanceColor, useViewModelInstanceTrigger } from '@rive-app/react-canvas'
import { useEffect } from 'react'
import { ArrowButtonComponent } from './ArrowButtons.types'

export const ArrowButtons: ArrowButtonComponent = ({
  style,
  color,
  onUp,
  onRight,
  onDown,
  onLeft,
  onUpRelease,
  onRightRelease,
  onDownRelease,
  onLeftRelease,
}) => {
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
  useViewModelInstanceTrigger('Button_up/Up', rive?.viewModelInstance, {
    onTrigger: () => {
      onUpRelease?.()
    },
  })
  useViewModelInstanceTrigger('Button_right/Up', rive?.viewModelInstance, {
    onTrigger: () => {
      onRightRelease?.()
    },
  })
  useViewModelInstanceTrigger('Button_down/Up', rive?.viewModelInstance, {
    onTrigger: () => {
      onDownRelease?.()
    },
  })
  useViewModelInstanceTrigger('Button_left/Up', rive?.viewModelInstance, {
    onTrigger: () => {
      onLeftRelease?.()
    },
  })

  const handleRelease = () => {
    onUpRelease?.()
    onRightRelease?.()
    onDownRelease?.()
    onLeftRelease?.()
  }

  return (
    <div
      onPointerUp={handleRelease}
      onPointerCancel={handleRelease}
      onPointerLeave={handleRelease}
      style={style}
    >
      <RiveComponent style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
