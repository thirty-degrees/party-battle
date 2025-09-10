import { ConnectionLostModal } from '@/components/ui/modal/connection-lost-modal'
import { Client, Room } from 'colyseus.js'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { LobbySchema } from 'types-party-battle'

export type LobbyRoomContextType = {
  lobbyRoom?: Room<LobbySchema>
  isLoading: boolean
  joinLobbyRoom: (roomId: string, playerName: string) => Promise<void>
  createLobbyRoom: (playerName: string) => Promise<void>
  leaveLobbyRoom: () => Promise<void>
}

const LobbyRoomContext = createContext<LobbyRoomContextType | undefined>(undefined)

export const useLobbyRoomContext = () => {
  const context = useContext(LobbyRoomContext)
  if (!context) {
    throw new Error('useLobbyRoomContext must be used within a LobbyRoomProvider')
  }
  return context
}

export const LobbyRoomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lobbyRoom, setLobbyRoom] = useState<Room<LobbySchema> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [storedRoomId, setStoredRoomId] = useState<string | undefined>(undefined)
  const [connectionLost, setConnectionLost] = useState(false)
  const [canRetry, setCanRetry] = useState(false)
  const isLeaving = useRef(false)

  const attachListeners = useCallback((room: Room<LobbySchema>) => {
    room.onLeave(() => {
      if (isLeaving.current) return
      setConnectionLost(true)
      setCanRetry(true)
    })
    room.onError(() => {
      setConnectionLost(true)
      setCanRetry(true)
    })
  }, [])

  const joinLobbyRoom = useCallback(
    async (roomId: string, playerName: string) => {
      try {
        setIsLoading(true)
        const client = new Client(Constants.expoConfig?.extra?.backendUrl)
        const joinedRoom = await client.joinById<LobbySchema>(roomId, {
          name: playerName,
        })
        setLobbyRoom(joinedRoom)
        setStoredRoomId(joinedRoom.roomId)
        attachListeners(joinedRoom)
        setConnectionLost(false)
        setCanRetry(false)
      } catch (error) {
        console.error('Failed to join lobby:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [attachListeners]
  )

  const createLobbyRoom = useCallback(
    async (playerName: string) => {
      try {
        setIsLoading(true)
        const client = new Client(Constants.expoConfig?.extra?.backendUrl)
        const createdRoom = await client.create<LobbySchema>('lobby_room', {
          name: playerName,
        })
        setLobbyRoom(createdRoom)
        setStoredRoomId(createdRoom.roomId)
        attachListeners(createdRoom)
        setConnectionLost(false)
        setCanRetry(false)
      } catch (error) {
        console.error('Failed to create lobby:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [attachListeners]
  )

  const leaveLobbyRoom = useCallback(async () => {
    if (lobbyRoom) {
      try {
        isLeaving.current = true
        await lobbyRoom.leave()
      } catch {}
      isLeaving.current = false
    }
    setLobbyRoom(undefined)
    setStoredRoomId(undefined)
    setConnectionLost(false)
    setCanRetry(false)
  }, [lobbyRoom])

  const retryLobbyRoom = useCallback(async () => {
    if (!storedRoomId) return
    try {
      setIsLoading(true)
      const client = new Client(Constants.expoConfig?.extra?.backendUrl)
      const room = await client.reconnect<LobbySchema>(storedRoomId)
      setLobbyRoom(room)
      setStoredRoomId(room.roomId)
      attachListeners(room)
      setConnectionLost(false)
      setCanRetry(false)
    } catch {
      setConnectionLost(true)
      setCanRetry(false)
    } finally {
      setIsLoading(false)
    }
  }, [storedRoomId, attachListeners])

  const handleLeaveParty = useCallback(async () => {
    await leaveLobbyRoom()
    router.replace('/')
  }, [leaveLobbyRoom])

  const value: LobbyRoomContextType = useMemo(
    () => ({
      lobbyRoom,
      isLoading,
      joinLobbyRoom,
      createLobbyRoom,
      leaveLobbyRoom,
    }),
    [lobbyRoom, isLoading, joinLobbyRoom, createLobbyRoom, leaveLobbyRoom]
  )

  return (
    <LobbyRoomContext.Provider value={value}>
      {children}
      <ConnectionLostModal
        isOpen={connectionLost}
        onRetry={retryLobbyRoom}
        onLeave={handleLeaveParty}
        canRetry={canRetry}
        isLoading={isLoading}
      />
    </LobbyRoomContext.Provider>
  )
}
