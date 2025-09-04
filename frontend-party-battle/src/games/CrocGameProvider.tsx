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
import { CrocGameSchema } from 'types-party-battle'

export type CrocGameContextType = {
  room?: Room<CrocGameSchema>
  isLoading: boolean
  joinCrocGame: (roomId: string) => void
  leaveCrocGame: () => void
}

const CrocGameContext = createContext<CrocGameContextType | undefined>(
  undefined
)

export const useCrocGameContext = () => {
  const context = useContext(CrocGameContext)
  if (!context) {
    throw new Error('useCrocGameContext must be used within a CrocGameProvider')
  }
  return context
}

export const CrocGameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room<CrocGameSchema> | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const hasJoinedRef = useRef(false)
  const { playerName } = usePlayerName()

  const joinCrocGame = useCallback(
    (roomId: string) => {
      if (hasJoinedRef.current || room) {
        return
      }

      hasJoinedRef.current = true
      setIsLoading(true)
      const client = new Client(Constants.expoConfig?.extra?.backendUrl)
      client
        .joinById<CrocGameSchema>(roomId, {
          name: playerName,
        })
        .then((joinedRoom) => {
          joinedRoom.onStateChange((state) => {
            if (state.gameState === 'finished') {
              router.replace('/lobby')
            }
          })

          setRoom(joinedRoom)
          setIsLoading(false)
        })
    },
    [playerName, room]
  )

  const leaveCrocGame = useCallback(() => {
    if (room) {
      room.leave()
      setRoom(undefined)
    }
  }, [room])

  const value = useMemo(
    () => ({
      room,
      isLoading,
      joinCrocGame,
      leaveCrocGame,
    }),
    [room, isLoading, joinCrocGame, leaveCrocGame]
  )

  return (
    <CrocGameContext.Provider value={value}>
      {children}
    </CrocGameContext.Provider>
  )
}
