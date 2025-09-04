import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { Client, Room } from 'colyseus.js'
import Constants from 'expo-constants'
import { router } from 'expo-router'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import { GameSchema } from 'types-party-battle'

export type GameRoomContextType<TGameSchema extends GameSchema> = {
  gameRoom?: Room<TGameSchema>
  isLoading: boolean
  joinGameRoom: (roomId: string) => void
  leaveGameRoom: () => void
}

const GameRoomContext = createContext<
  GameRoomContextType<GameSchema> | undefined
>(undefined)

export const useGameRoomContext = <TGameSchema extends GameSchema>() => {
  const context = useContext(GameRoomContext) as
    | GameRoomContextType<TGameSchema>
    | undefined
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
  const [gameRoom, setGameRoom] = useState<Room<TGameSchema> | undefined>(
    undefined
  )
  const [isLoading, setIsLoading] = useState(false)
  const hasJoinedRef = useRef(false)
  const { playerName } = usePlayerName()

  const joinGameRoom = useCallback(
    (roomId: string) => {
      if (hasJoinedRef.current || gameRoom) {
        return
      }

      hasJoinedRef.current = true
      setIsLoading(true)
      const client = new Client(Constants.expoConfig?.extra?.backendUrl)
      client
        .joinById<TGameSchema>(roomId, {
          name: playerName,
        })
        .then((joinedRoom) => {
          joinedRoom.onStateChange((state) => {
            if (state.status === 'finished') {
              router.replace('/lobby')
            }
          })

          setGameRoom(joinedRoom)
          setIsLoading(false)
        })
    },
    [playerName, gameRoom]
  )

  const leaveGameRoom = useCallback(() => {
    if (gameRoom) {
      gameRoom.leave()
      setGameRoom(undefined)
    }
  }, [gameRoom])

  const value = useMemo(
    () => ({
      gameRoom,
      isLoading,
      joinGameRoom,
      leaveGameRoom,
    }),
    [gameRoom, isLoading, joinGameRoom, leaveGameRoom]
  )

  return (
    <GameRoomContext.Provider value={value as GameRoomContextType<GameSchema>}>
      {children}
    </GameRoomContext.Provider>
  )
}
