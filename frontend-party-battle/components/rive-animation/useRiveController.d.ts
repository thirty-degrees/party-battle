export type UseRiveControllerParams = {
  source: number | { uri: string } | string
  artboard?: string
  stateMachines?: string | string[]
  autoplay?: boolean
  triggers?: { key: string; func: (event?: unknown) => void }[]
}

export type UseRiveControllerReturn = {
  RiveComponent: (props: Record<string, unknown>) => unknown
  play: () => void
  pause: () => void
  stop: () => void
}
export function useRiveController(params: UseRiveControllerParams): UseRiveControllerReturn
