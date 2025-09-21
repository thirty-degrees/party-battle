import { usePlayerName } from '@/src/storage/PlayerNameProvider'
import { Client, Room } from 'colyseus.js'
import Constants from 'expo-constants'
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { GameSchema } from 'types-party-battle/types/GameSchema'

export type GameRoomContextType<TGameSchema extends GameSchema> = {
  gameRoom?: Room<TGameSchema>
  isLoading: boolean
  joinGameRoom: (roomId: string) => Promise<void>
  leaveGameRoom: () => void
}

const GameRoomContext = createContext<GameRoomContextType<GameSchema> | undefined>(undefined)

export const useGameRoomContext = <TGameSchema extends GameSchema>() => {
  const context = useContext(GameRoomContext) as GameRoomContextType<TGameSchema> | undefined
  if (!context) {
    throw new Error('useGameRoomContext must be used within a GameRoomProvider')
  }
  return context
}

export const GameRoomProvider = <TGameSchema extends GameSchema>({
  children,
}: {
  children: React.ReactNode
}) => {
  const [gameRoom, setGameRoom] = useState<Room<TGameSchema> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const hasJoinedRef = useRef(false)
  const { trimmedPlayerName } = usePlayerName()

  const joinGameRoom = useCallback(
    async (roomId: string) => {
      if (hasJoinedRef.current || gameRoom) {
        return
      }

      hasJoinedRef.current = true
      setIsLoading(true)

      try {
        const client = new Client(Constants.expoConfig?.extra?.backendUrl)
        const joinedRoom = await client.joinById<TGameSchema>(roomId, {
          name: trimmedPlayerName,
        })

        setGameRoom(joinedRoom)

        const off = joinedRoom.onStateChange((state) => {
          if (state.status !== undefined) {
            setIsLoading(false)
            off.clear()
          }
        })
      } catch (error) {
        setError(new Error('Failed to join game room', { cause: error }))
      }
    },
    [trimmedPlayerName, gameRoom]
  )

  const leaveGameRoom = useCallback(() => {
    if (gameRoom) {
      gameRoom.leave()
      setGameRoom(undefined)
    }
  }, [gameRoom])

  const value = useMemo<GameRoomContextType<TGameSchema>>(
    () => ({
      gameRoom,
      isLoading,
      joinGameRoom,
      leaveGameRoom,
    }),
    [gameRoom, isLoading, joinGameRoom, leaveGameRoom]
  )

  if (error) {
    throw error
  }

  return (
    <GameRoomContext.Provider value={value as unknown as GameRoomContextType<GameSchema>}>
      {children}
    </GameRoomContext.Provider>
  )
}
