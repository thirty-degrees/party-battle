import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { Room } from 'colyseus.js'
import type { Schema } from '@colyseus/schema'

type Selector<S extends Schema, R> = (state: S) => R

function createRoomStore<S extends Schema>(room: Room<S>) {
  let rev = 0
  const listeners = new Set<() => void>()
  let off: any | null = null

  const notify = () => { rev++; listeners.forEach(l => l()) }

  const subscribe = (l: () => void) => {
    listeners.add(l)
    if (listeners.size === 1) {
      off = room.onStateChange(() => notify())
    }
    return () => {
      listeners.delete(l)
      if (listeners.size === 0) { off?.clear(); off = null }
    }
  }

  const getSnapshot = () => rev
  const dispose = () => { off?.clear(); listeners.clear() }

  return { subscribe, getSnapshot, dispose }
}

export default function useColyseusState<S extends Schema, R>(
  room: Room<S>,
  selector: Selector<S, R>,
) {
  const store = createRoomStore(room)
  const selectorRef = useRef(selector)
  useEffect(() => { selectorRef.current = selector }, [selector])

  useEffect(() => store.dispose, [store])
  useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

  console.log("useColyseusState");

  return selectorRef.current(room.state)
}
