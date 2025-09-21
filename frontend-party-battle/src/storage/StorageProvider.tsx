import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { storage } from './storage'

type StorageState = Record<string, string | null>

type StorageContextType = {
  getStorageValue: (key: string) => string | null
  setStorageValue: (key: string, value: string | null) => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const useStorageContext = () => {
  const context = useContext(StorageContext)
  if (!context) {
    throw new Error('useStorageContext must be used within a StorageProvider')
  }
  return context
}

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageState, setStorageState] = useState<StorageState>(() => {
    return {}
  })

  const getStorageValue = useCallback(
    (key: string) => {
      if (key in storageState) {
        return storageState[key]
      }

      return storage.getItem(key)
    },
    [storageState]
  )

  const setStorageValue = useCallback((key: string, value: string | null) => {
    if (value !== null) {
      storage.setItem(key, value)
    } else {
      storage.removeItem(key)
    }

    setStorageState((prev) => ({ ...prev, [key]: value }))
  }, [])

  const contextValue = useMemo(
    () => ({
      storageState,
      getStorageValue,
      setStorageValue,
    }),
    [storageState, getStorageValue, setStorageValue]
  )

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>
}
