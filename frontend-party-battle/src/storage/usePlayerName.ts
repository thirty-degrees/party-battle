import { useMemo } from 'react'
import { useStorageContext } from './StorageProvider'

const PLAYER_NAME_KEY = 'playerName'
const PLAYER_NAME_DEFALT = undefined

export const usePlayerName = () => {
  const { getStorageValue, setStorageValue } = useStorageContext()

  const playerName = getStorageValue(PLAYER_NAME_KEY) ?? PLAYER_NAME_DEFALT

  const trimmedPlayerName = useMemo(() => {
    return playerName?.trim() || ''
  }, [playerName])

  const setPlayerNameValue = useMemo(() => {
    return (value: string | null) => {
      setStorageValue(PLAYER_NAME_KEY, value)
    }
  }, [setStorageValue])

  return {
    playerName,
    trimmedPlayerName,
    setPlayerName: setPlayerNameValue,
  }
}
