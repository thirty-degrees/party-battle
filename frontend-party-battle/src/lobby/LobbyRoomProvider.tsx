import { Client, Room } from 'colyseus.js'
import Constants from 'expo-constants'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import { LobbySchema } from 'types-party-battle'

export type LobbyRoomContextType = {
  lobbyRoom?: Room<LobbySchema>
  isLoading: boolean
  joinLobbyRoom: (roomId: string, playerName: string) => Promise<void>
  createLobbyRoom: (playerName: string) => Promise<void>
  leaveLobbyRoom: () => void
}

const LobbyRoomContext = createContext<LobbyRoomContextType | undefined>(
  undefined
)

export const useLobbyRoomContext = () => {
  const context = useContext(LobbyRoomContext)
  if (!context) {
    throw new Error(
      'useLobbyRoomContext must be used within a LobbyRoomProvider'
    )
  }
  return context
}

export const LobbyRoomProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lobbyRoom, setLobbyRoom] = useState<Room<LobbySchema> | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(false)

  const joinLobbyRoom = useCallback(
    async (roomId: string, playerName: string) => {
      try {
        setIsLoading(true)
        const client = new Client(Constants.expoConfig?.extra?.backendUrl)
        const joinedRoom = await client.joinById<LobbySchema>(roomId, {
          name: playerName,
        })
        setLobbyRoom(joinedRoom)
      } catch (error) {
        console.error('Failed to join lobby:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const createLobbyRoom = useCallback(async (playerName: string) => {
    try {
      setIsLoading(true)
      const client = new Client(Constants.expoConfig?.extra?.backendUrl)
      const createdRoom = await client.create<LobbySchema>('lobby_room', {
        name: playerName,
      })
      setLobbyRoom(createdRoom)
    } catch (error) {
      console.error('Failed to create lobby:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const leaveLobbyRoom = useCallback(() => {
    if (lobbyRoom) {
      lobbyRoom.leave()
      setLobbyRoom(undefined)
    }
  }, [lobbyRoom])

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
    </LobbyRoomContext.Provider>
  )
}
