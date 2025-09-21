import { useCallback } from 'react'
import { useStorageContext } from './StorageProvider'

const IS_PARTY_CODE_VISIBLE_KEY = 'isPartyCodeVisible'
const IS_PARTY_CODE_VISIBLE_DEFAULT = 'false'

export const useIsPartyCodeVisible = () => {
  const { getStorageValue, setStorageValue } = useStorageContext()

  const value = getStorageValue(IS_PARTY_CODE_VISIBLE_KEY) ?? IS_PARTY_CODE_VISIBLE_DEFAULT

  const setIsVisible = useCallback(
    (isVisible: boolean) => {
      const newValue = isVisible ? 'true' : 'false'
      setStorageValue(IS_PARTY_CODE_VISIBLE_KEY, newValue)
    },
    [setStorageValue]
  )

  return {
    isVisible: value === 'true',
    setIsVisible,
  }
}
