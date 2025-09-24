import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { storage } from './storage'

const IS_PARTY_CODE_VISIBLE_KEY = 'isPartyCodeVisible'
const IS_PARTY_CODE_VISIBLE_DEFAULT = 'true'

type IsPartyCodeVisibleContextType = {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}

const IsPartyCodeVisibleContext = createContext<IsPartyCodeVisibleContextType | undefined>(undefined)

export const useIsPartyCodeVisible = () => {
  const context = useContext(IsPartyCodeVisibleContext)
  if (!context) {
    throw new Error('useIsPartyCodeVisible must be used within an IsPartyCodeVisibleProvider')
  }
  return context
}

export const IsPartyCodeVisibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisibleState] = useState<boolean>(() => {
    const value = storage.getItem(IS_PARTY_CODE_VISIBLE_KEY) ?? IS_PARTY_CODE_VISIBLE_DEFAULT
    return value === 'true'
  })

  const setIsVisible = useCallback((isVisible: boolean) => {
    const newValue = isVisible ? 'true' : 'false'
    storage.setItem(IS_PARTY_CODE_VISIBLE_KEY, newValue)
    setIsVisibleState(isVisible)
  }, [])

  const contextValue = useMemo(
    () => ({
      isVisible,
      setIsVisible,
    }),
    [isVisible, setIsVisible]
  )

  return (
    <IsPartyCodeVisibleContext.Provider value={contextValue}>{children}</IsPartyCodeVisibleContext.Provider>
  )
}
