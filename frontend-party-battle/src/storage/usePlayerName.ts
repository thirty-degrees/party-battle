import { useMemo } from 'react'
import { useStorage } from './StorageProvider'

export const usePlayerName = () => {
  const { value: playerName, setValue: setPlayerName, isLoading } = useStorage('playerName')

  const trimmedPlayerName = useMemo(() => {
    return playerName?.trim() || ''
  }, [playerName])

  return {
    playerName,
    trimmedPlayerName,
    setPlayerName,
    isLoading,
  }
}
