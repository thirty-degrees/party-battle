import { EventType } from '@rive-app/canvas'
import { useRive } from '@rive-app/react-canvas'
import { useEffect, useMemo } from 'react'
import { Image } from 'react-native'

type Trigger = { key: EventType | string; func: (event?: unknown) => void }

type Params = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any
  artboard?: string
  stateMachines?: string | string[]
  autoplay?: boolean
  triggers?: Trigger[]
}

export function useRiveController({
  source,
  artboard,
  stateMachines,
  autoplay = true,
  triggers = [],
}: Params) {
  const src = useMemo(() => {
    if (typeof source === 'string') return source
    try {
      const resolved = Image.resolveAssetSource(source)
      return resolved?.uri ?? ''
    } catch {
      return ''
    }
  }, [source])

  const { rive, RiveComponent } = useRive({ src, artboard, stateMachines, autoplay })

  useEffect(() => {
    if (!rive || !triggers.length) return
    const callbacks: { type: EventType | string; cb: (e: unknown) => void }[] = []
    for (const { key, func } of triggers) {
      const type = key as unknown as EventType
      const cb = (e: unknown) => func(e)
      rive.on(type, cb as never)
      callbacks.push({ type, cb })
    }
    return () => {
      callbacks.forEach(({ type, cb }) => {
        try {
          rive.off(type as never, cb as never)
        } catch {}
      })
    }
  }, [rive, triggers])

  const play = () => rive?.play()
  const pause = () => rive?.pause()
  const stop = () => rive?.stop()

  return { RiveComponent, play, pause, stop }
}
