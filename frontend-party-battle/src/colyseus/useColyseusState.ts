import type { Schema } from '@colyseus/schema'
import type { Room } from 'colyseus.js'
import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'

type Selector<S extends Schema, R> = (state: S) => R

function createRoomStore<S extends Schema>(room: Room<S>) {
  let rev = 0
  const listeners = new Set<() => void>()
  let off: { clear: () => void } | null = null

  const notify = () => {
    rev++
    listeners.forEach((l) => l())
  }

  const subscribe = (l: () => void) => {
    listeners.add(l)
    if (listeners.size === 1) {
      off = room.onStateChange(() => notify())
    }
    return () => {
      listeners.delete(l)
      if (listeners.size === 0) {
        off?.clear()
        off = null
      }
    }
  }

  const getSnapshot = () => rev
  const dispose = () => {
    off?.clear()
    listeners.clear()
  }

  return { subscribe, getSnapshot, dispose }
}

export default function useColyseusState<S extends Schema, R>(room: Room<S>, selector: Selector<S, R>) {
  const store = useMemo(() => createRoomStore(room), [room])
  const selectorRef = useRef(selector)
  useEffect(() => {
    selectorRef.current = selector
  }, [selector])

  useEffect(() => store.dispose, [store])
  useSyncExternalStore<number>(store.subscribe, store.getSnapshot, store.getSnapshot)

  return selectorRef.current(room.state)
}
