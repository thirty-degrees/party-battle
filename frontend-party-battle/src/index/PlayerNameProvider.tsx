import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from './storage'

type PlayerNameContextType = {
  playerName: string
  trimmedPlayerName: string
  setPlayerName: (name: string) => void
  isLoading: boolean
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
  const [playerName, setPlayerName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    storage.getItem('playerName').then((v) => {
      if (!active) return
      if (v !== null) setPlayerName(v)
      setIsLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!isLoading && playerName && playerName.trim() !== '') {
      storage.setItem('playerName', playerName)
    }
  }, [playerName, isLoading])

  const trimmedPlayerName = useMemo(() => playerName.trim(), [playerName])

  const value = useMemo<PlayerNameContextType>(
    () => ({
      playerName,
      trimmedPlayerName,
      setPlayerName,
      isLoading,
    }),
    [playerName, trimmedPlayerName, isLoading]
  )

  return <PlayerNameContext.Provider value={value}>{children}</PlayerNameContext.Provider>
}
