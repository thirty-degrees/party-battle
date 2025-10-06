import { Schema } from '@colyseus/schema'
import type { Room } from 'colyseus.js'
import { Client, ErrorCode, ServerError } from 'colyseus.js'
import Constants from 'expo-constants'
import { create } from 'zustand'
import { useUserPreferencesStore } from '../storage/userPreferencesStore'

export type ColyseusRoomStoreState<TView> = {
  view: TView
  roomId?: string
  isLoading: boolean
  playerNameValidationError?: string
  resetPlayerNameValidationError: () => void
  invalidRoomId: boolean
  resetInvalidRoomId: () => void
  connectionLost: boolean
  failedRetries: number
  roomError?: Error
  resetErrors: () => void
  joinById: (roomId: string) => Promise<{ success: boolean }>
  createRoom: (roomId?: string) => Promise<{ success: boolean; roomId?: string }>
  leaveRoom: () => Promise<void>
  retry: () => Promise<{ success: boolean; roomId?: string }>
  sendMessage: <T>(type: string | number, message?: T) => void
}

type Options<TView, TSchema extends Schema> = {
  initialView: TView
  mapStable: (schema: TSchema, prev: TView) => TView
  roomName: string
  getTick?: (schema: TSchema) => number
  bufferMs?: number
  tickMs?: number
}

export function createColyseusRoomStore<TView, TSchema extends Schema>(opts: Options<TView, TSchema>) {
  const clientRef: { current: Client } = { current: new Client(Constants.expoConfig?.extra?.backendUrl) }
  const roomRef: { current: Room<TSchema> | null } = { current: null }
  const intentionalLeaveRef: { current: boolean } = { current: false }

  const connectToRoom = async (
    op: (playerName: string) => Promise<Room<TSchema>>,
    set: (partial: Partial<ColyseusRoomStoreState<TView>>) => void,
    get: () => ColyseusRoomStoreState<TView>,
    onError?: () => void
  ): Promise<{ success: boolean; roomId?: string }> => {
    const playerName = useUserPreferencesStore.getState().playerName
    if (!playerName) {
      set({ playerNameValidationError: 'Player name is required' })
      return { success: false }
    }
    set({ isLoading: true, playerNameValidationError: undefined, roomError: undefined })
    try {
      if (roomRef.current) {
        await get().leaveRoom()
      }
      const room = await op(playerName)
      roomRef.current = room
      wireRoom(room, set, get)
      set({ isLoading: false, connectionLost: false, failedRetries: 0, roomId: room.roomId })
      return { success: true, roomId: room.roomId }
    } catch (error) {
      set({ isLoading: false })
      if (onError) onError()
      if (error instanceof ServerError && error.code === 4111) {
        set({ playerNameValidationError: error.message })
      } else if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        error.code === ErrorCode.MATCHMAKE_INVALID_ROOM_ID
      ) {
        set({ invalidRoomId: true })
      } else {
        set({ roomError: new Error('Failed to connect to room', { cause: error }) })
      }
      return { success: false }
    }
  }

  const wireRoom = (
    room: Room<TSchema>,
    set: (partial: Partial<ColyseusRoomStoreState<TView>>) => void,
    get: () => ColyseusRoomStoreState<TView>
  ) => {
    let latestView: TView = opts.initialView
    let lastPublishedTick: number | null = null
    let lastPublishedAt = 0
    let lastSeenTick: number | null = null
    let pendingTimer: ReturnType<typeof setTimeout> | null = null
    const bufferMs = opts.bufferMs ?? 200
    const tickMs = opts.tickMs ?? 333

    const publishNow = () => {
      if (get().view !== latestView) set({ view: latestView })
      lastPublishedAt = Date.now()
      lastPublishedTick = lastSeenTick
    }

    room.onStateChange((schema) => {
      latestView = opts.mapStable(schema, latestView)
      const tick = opts.getTick ? opts.getTick(schema) : null
      if (tick == null) {
        if (get().view !== latestView) set({ view: latestView })
        return
      }
      if (lastPublishedTick == null) {
        lastSeenTick = tick
        if (pendingTimer) {
          clearTimeout(pendingTimer)
          pendingTimer = null
        }
        publishNow()
        return
      }
      if (tick === lastSeenTick) {
        if (get().view !== latestView) set({ view: latestView })
        return
      }
      lastSeenTick = tick
      const now = Date.now()
      const expectedNextPublishAt = lastPublishedAt + tickMs
      let delay = expectedNextPublishAt - now
      if (delay < 0 && (-delay > bufferMs || tick > (lastPublishedTick ?? -1) + 1)) delay = 0
      if (delay > bufferMs) delay = bufferMs
      if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = null
      }
      if (delay === 0) {
        publishNow()
      } else {
        pendingTimer = setTimeout(() => {
          pendingTimer = null
          publishNow()
        }, delay)
      }
    })

    room.onError((code, message) => {
      console.warn('colyseus room onError', { code, message })
    })

    room.onLeave(() => {
      if (pendingTimer) {
        clearTimeout(pendingTimer)
        pendingTimer = null
      }
      roomRef.current = null
      if (!intentionalLeaveRef.current) {
        set({ connectionLost: true })
      }
      intentionalLeaveRef.current = false
    })
  }

  return create<ColyseusRoomStoreState<TView>>((set, get) => ({
    view: opts.initialView,
    roomId: undefined,
    invalidRoomId: false,
    isLoading: false,
    playerNameValidationError: undefined,
    connectionLost: false,
    failedRetries: 0,
    roomError: undefined,
    resetPlayerNameValidationError: () => set({ playerNameValidationError: undefined }),
    resetInvalidRoomId: () => set({ invalidRoomId: false }),
    resetErrors: () =>
      set({
        playerNameValidationError: undefined,
        invalidRoomId: false,
        connectionLost: false,
        failedRetries: 0,
        isLoading: false,
        roomError: undefined,
      }),
    joinById: async (roomId) => {
      return connectToRoom(
        (playerName) => clientRef.current.joinById<TSchema>(roomId, { name: playerName }),
        set,
        get
      )
    },
    createRoom: async (roomId?: string) => {
      return connectToRoom(
        (playerName) => clientRef.current.create<TSchema>(opts.roomName, { name: playerName, roomId }),
        set,
        get
      )
    },
    leaveRoom: async () => {
      try {
        const room = roomRef.current
        if (room && room.connection.isOpen) {
          intentionalLeaveRef.current = true
          await room.leave(true)
        }
      } finally {
        roomRef.current = null
        set({
          view: opts.initialView,
          roomId: undefined,
          invalidRoomId: false,
          connectionLost: false,
          failedRetries: 0,
          isLoading: false,
          roomError: undefined,
        })
      }
    },
    retry: async () => {
      const roomId = get().roomId
      const failedRetries = get().failedRetries
      if (!roomId) {
        set({ roomError: new Error('Room id is required'), failedRetries: failedRetries + 1 })
        return { success: false }
      }
      return connectToRoom(
        (playerName) => clientRef.current.joinById<TSchema>(roomId, { name: playerName }),
        set,
        get,
        () => {
          set({ connectionLost: true, failedRetries: failedRetries + 1 })
        }
      )
    },
    sendMessage<T>(type: string | number, message?: T) {
      const room = roomRef.current
      if (!room) return
      room.send<T>(type, message)
    },
  }))
}
