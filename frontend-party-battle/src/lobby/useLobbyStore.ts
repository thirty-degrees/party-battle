import type { Room } from 'colyseus.js'
import { Client, ServerError } from 'colyseus.js'
import Constants from 'expo-constants'
import type { Lobby, LobbySchema } from 'types-party-battle/types/LobbySchema'
import { mapLobbyStable } from 'types-party-battle/types/LobbySchema'
import { create } from 'zustand'
import { useUserPreferencesStore } from '../storage/userPreferencesStore'

type LobbyStoreState = {
  lobby: Lobby
  roomId?: string
  isLoading: boolean
  playerNameValidationError?: string
  roomIdValidationError?: string
  connectionLost: boolean
  failedRetries: number
  lobbyError?: unknown
  joinLobbyRoom: (roomId: string) => Promise<boolean>
  createLobbyRoom: () => Promise<boolean>
  leaveLobbyRoom: () => Promise<void>
  retryJoinLobbyRoom: () => Promise<boolean>
  sendLobbyRoomMessage: <T>(type: string | number, message?: T) => void
}

const initialLobby: Lobby = {
  players: {},
  currentGame: null,
  currentGameRoomId: null,
  gameHistories: [],
}

const colyseusClientRef: { current: Client } = {
  current: new Client(Constants.expoConfig?.extra?.backendUrl),
}
const lobbyRoomRef: { current: Room<LobbySchema> | null } = { current: null }
const intentionalLeaveRef: { current: boolean } = { current: false }

const wireRoom = (
  room: Room<LobbySchema>,
  set: (partial: Partial<LobbyStoreState>) => void,
  get: () => LobbyStoreState
) => {
  room.onStateChange((schema) => {
    const nextLobby = mapLobbyStable(schema, get().lobby)
    if (nextLobby !== get().lobby) set({ lobby: nextLobby })
  })
  room.onError((code, message) => {
    set({ lobbyError: { code, message } })
  })
  room.onLeave(() => {
    lobbyRoomRef.current = null
    if (!intentionalLeaveRef.current) {
      set({ connectionLost: true })
    }
    intentionalLeaveRef.current = false
  })
}

export const useLobbyStore = create<LobbyStoreState>((set, get) => ({
  lobby: initialLobby,
  roomId: undefined,
  isLoading: false,
  playerNameValidationError: undefined,
  roomIdValidationError: undefined,
  connectionLost: false,
  failedRetries: 0,
  lobbyError: undefined,

  joinLobbyRoom: async (roomId: string) => {
    const playerName = useUserPreferencesStore.getState().playerName
    if (!playerName) {
      set({ playerNameValidationError: 'Player name is required' })
      return false
    }
    set({
      isLoading: true,
      playerNameValidationError: undefined,
      roomIdValidationError: undefined,
      lobbyError: undefined,
    })
    try {
      if (lobbyRoomRef.current) {
        await get().leaveLobbyRoom()
      }
      const room = await colyseusClientRef.current.joinById<LobbySchema>(roomId, { name: playerName })
      lobbyRoomRef.current = room
      wireRoom(room, set, get)
      set({
        isLoading: false,
        connectionLost: false,
        failedRetries: 0,
        roomId: room.roomId,
      })
      return true
    } catch (error) {
      set({ isLoading: false })
      if (error instanceof ServerError && error.code === 4111) {
        set({ playerNameValidationError: String(error.message) })
        return false
      }
      if (error instanceof ServerError && error.code === 4112) {
        set({ roomIdValidationError: String(error.message) })
        return false
      }
      set({ lobbyError: error })
      return false
    }
  },

  createLobbyRoom: async () => {
    const playerName = useUserPreferencesStore.getState().playerName
    if (!playerName) {
      set({ playerNameValidationError: 'Player name is required' })
      return false
    }
    set({
      isLoading: true,
      playerNameValidationError: undefined,
      roomIdValidationError: undefined,
      lobbyError: undefined,
    })
    try {
      if (lobbyRoomRef.current) {
        await get().leaveLobbyRoom()
      }
      const room = await colyseusClientRef.current.create<LobbySchema>('lobby_room', { name: playerName })
      lobbyRoomRef.current = room
      wireRoom(room, set, get)
      set({
        isLoading: false,
        connectionLost: false,
        failedRetries: 0,
        roomId: room.roomId,
      })
      return true
    } catch (error) {
      set({ isLoading: false })
      if (error instanceof ServerError && error.code === 4111) {
        set({ playerNameValidationError: String(error.message) })
        return false
      }
      if (error instanceof ServerError && error.code === 4112) {
        set({ roomIdValidationError: String(error.message) })
        return false
      }
      set({ lobbyError: error })
      return false
    }
  },

  leaveLobbyRoom: async () => {
    const room = lobbyRoomRef.current
    if (!room) {
      set({ lobby: initialLobby, connectionLost: false })
      return
    }
    try {
      intentionalLeaveRef.current = true
      await room.leave(true)
    } finally {
      lobbyRoomRef.current = null
      set({
        lobby: initialLobby,
        roomId: undefined,
        connectionLost: false,
        failedRetries: 0,
        isLoading: false,
      })
    }
  },

  retryJoinLobbyRoom: async () => {
    const roomId = lobbyRoomRef.current?.roomId
    if (!roomId) {
      set({ roomIdValidationError: 'Party code is required' })
      return false
    }
    const playerName = useUserPreferencesStore.getState().playerName
    if (!playerName) {
      set({ playerNameValidationError: 'Player name is required' })
      return false
    }
    set({ isLoading: true, lobbyError: undefined })
    try {
      if (lobbyRoomRef.current) {
        await get().leaveLobbyRoom()
      }
      const room = await colyseusClientRef.current.joinById<LobbySchema>(roomId, { name: playerName })
      lobbyRoomRef.current = room
      wireRoom(room, set, get)
      set({
        isLoading: false,
        connectionLost: false,
        failedRetries: 0,
        roomId: room.roomId,
      })
      return true
    } catch (error) {
      const failedRetries = get().failedRetries + 1
      set({ isLoading: false, connectionLost: true, failedRetries })
      if (error instanceof ServerError && error.code === 4111) {
        set({ playerNameValidationError: String(error.message) })
        return false
      }
      if (error instanceof ServerError && error.code === 4112) {
        set({ roomIdValidationError: String(error.message) })
        return false
      }
      set({ lobbyError: error })
      return false
    }
  },

  sendLobbyRoomMessage<T>(type: string | number, message?: T): void {
    const room = lobbyRoomRef.current
    if (!room) {
      return
    }
    room.send<T>(type, message)
  },
}))
