import { useMemo, useRef } from 'react'
import Rive, { type RiveGeneralEvent, type RiveOpenUrlEvent, type RiveRef } from 'rive-react-native'

type Trigger = { key: string; func: () => void }

type SourceParam = { source: number | { uri: string } } | { resourceName: string } | { url: string }

type Params = SourceParam & {
  artboardName?: string
  stateMachineName?: string
  stateMachines?: string | string[]
  autoplay?: boolean
  triggers?: Trigger[]
  style?: React.ComponentProps<typeof Rive>['style']
}

export function useRiveController({ triggers = [], stateMachines, stateMachineName, ...rest }: Params) {
  const ref = useRef<RiveRef>(null)

  const RiveComponent = useMemo(() => {
    return function RiveWrapped(props: Omit<React.ComponentProps<typeof Rive>, 'ref'>) {
      const resolvedStateMachineName =
        stateMachineName ?? (typeof stateMachines === 'string' ? stateMachines : stateMachines?.[0])
      const other = rest as Omit<React.ComponentProps<typeof Rive>, 'ref' | 'source' | 'resourceName' | 'url'>
      const sourceProps =
        ('source' in rest && { source: (rest as { source: number | { uri: string } }).source }) ||
        ('resourceName' in rest && { resourceName: (rest as { resourceName: string }).resourceName }) ||
        ('url' in rest && { url: (rest as { url: string }).url }) ||
        ({} as Record<string, unknown>)

      const baseProps = {
        stateMachineName: resolvedStateMachineName,
        ...other,
        ...sourceProps,
        ...props,
      } as unknown as React.ComponentProps<typeof Rive>

      return (
        <Rive
          ref={ref}
          {...baseProps}
          onRiveEventReceived={(event: RiveGeneralEvent | RiveOpenUrlEvent) => {
            const name = event?.name
            if (!name) return
            for (const t of triggers) if (t.key === name) t.func()
          }}
        />
      )
    }
  }, [rest, stateMachines, stateMachineName, triggers])

  const play = () => ref.current?.play()
  const pause = () => ref.current?.pause()
  const stop = () => ref.current?.stop()

  return { RiveComponent, play, pause, stop }
}
