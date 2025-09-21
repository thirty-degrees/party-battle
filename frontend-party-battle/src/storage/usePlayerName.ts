import { useEffect, useMemo, useState } from 'react'
import { storage } from './storage'

const PLAYER_NAME_KEY = 'playerName'

export const usePlayerName = () => {
  const [playerName, setPlayerName] = useState<string | null>(() => storage.getItem(PLAYER_NAME_KEY))

  useEffect(() => {
    const currentValue = storage.getItem(PLAYER_NAME_KEY)
    setPlayerName(currentValue)
  }, [])

  const trimmedPlayerName = useMemo(() => {
    return playerName?.trim() || ''
  }, [playerName])

  const setPlayerNameValue = useMemo(() => {
    return (value: string | null) => {
      setPlayerName(value)
      if (value !== null) {
        storage.setItem(PLAYER_NAME_KEY, value)
      } else {
        storage.removeItem(PLAYER_NAME_KEY)
      }
    }
  }, [])

  return {
    playerName,
    trimmedPlayerName,
    setPlayerName: setPlayerNameValue,
  }
}
