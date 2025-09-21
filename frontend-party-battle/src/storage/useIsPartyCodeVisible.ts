import { useCallback, useEffect, useState } from 'react'
import { storage } from './storage'

const IS_PARTY_CODE_VISIBLE_KEY = 'isPartyCodeVisible'

export const useIsPartyCodeVisible = () => {
  const [value, setValue] = useState<string | null>(() => storage.getItem(IS_PARTY_CODE_VISIBLE_KEY))

  useEffect(() => {
    const currentValue = storage.getItem(IS_PARTY_CODE_VISIBLE_KEY)
    setValue(currentValue)
  }, [])

  const setIsVisible = useCallback((isVisible: boolean) => {
    const newValue = isVisible ? 'true' : 'false'
    setValue(newValue)
    storage.setItem(IS_PARTY_CODE_VISIBLE_KEY, newValue)
  }, [])

  return {
    isVisible: value === 'true',
    setIsVisible,
  }
}
