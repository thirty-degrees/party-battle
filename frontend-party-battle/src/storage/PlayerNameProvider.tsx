import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { storage } from './storage'

const PLAYER_NAME_KEY = 'playerName'
const PLAYER_NAME_DEFAULT = null

type PlayerNameContextType = {
  playerName: string | null
  trimmedPlayerName: string
  setPlayerName: (value: string | null) => void
}

const PlayerNameContext = createContext<PlayerNameContextType | undefined>(undefined)

export const usePlayerName = () => {
  const context = useContext(PlayerNameContext)
  if (!context) {
    throw new Error('usePlayerName must be used within a PlayerNameProvider')
  }
  return context
}

export const PlayerNameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [playerName, setPlayerNameState] = useState<string | null>(() => {
    return storage.getItem(PLAYER_NAME_KEY) ?? PLAYER_NAME_DEFAULT
  })

  const trimmedPlayerName = useMemo(() => {
    return playerName?.trim() || ''
  }, [playerName])

  const setPlayerName = useCallback((value: string | null) => {
    if (value !== null) {
      storage.setItem(PLAYER_NAME_KEY, value)
    } else {
      storage.removeItem(PLAYER_NAME_KEY)
    }

    setPlayerNameState(value)
  }, [])

  const contextValue = useMemo(
    () => ({
      playerName,
      trimmedPlayerName,
      setPlayerName,
    }),
    [playerName, trimmedPlayerName, setPlayerName]
  )

  return <PlayerNameContext.Provider value={contextValue}>{children}</PlayerNameContext.Provider>
}
