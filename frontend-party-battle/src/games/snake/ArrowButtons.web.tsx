import { useRive } from '@rive-app/react-canvas'
import { useMemo } from 'react'
import { Image } from 'react-native'

export function ArrowButtons() {
  const source = require('../../../assets/rive/arrowbuttons.riv')

  const src = useMemo(() => {
    if (typeof source === 'string') return source
    try {
      const resolved = Image.resolveAssetSource(source)
      return resolved?.uri ?? ''
    } catch {
      return ''
    }
  }, [source])

  const { RiveComponent } = useRive({
    src,
    stateMachines: 'State Machine 1',
    autoplay: true,
  })

  return <RiveComponent style={{ width: 400, height: 400 }} />
}
