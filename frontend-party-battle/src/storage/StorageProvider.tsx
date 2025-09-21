import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { storage } from './storage'

type StorageState = {
  value: string | null
}

type StorageContextType = {
  getStorageState: (key: string) => StorageState | undefined
  ensureLoaded: (key: string) => void
  setStorageValue: (key: string, value: string | null) => void
}

const StorageContext = createContext<StorageContextType | undefined>(undefined)

export const useStorage = (key: string) => {
  const ctx = useContext(StorageContext)
  if (!ctx) throw new Error('useStorage must be used within a StorageProvider')

  const state = ctx.getStorageState(key)

  useEffect(() => {
    ctx.ensureLoaded(key)
  }, [ctx, key])

  const setValue = useCallback(
    (value: string | null) => {
      ctx.setStorageValue(key, value)
    },
    [ctx, key]
  )

  const value = useMemo(() => {
    if (state) return state.value
    try {
      return storage.getItem(key)
    } catch (error) {
      console.warn('Failed to read storage value for key:', key, error)
      return null
    }
  }, [key, state])

  return { value, setValue }
}

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageStates, setStorageStates] = useState<Record<string, StorageState>>({})

  const getStorageState = useCallback((key: string) => storageStates[key], [storageStates])

  const ensureLoaded = useCallback((key: string) => {
    setStorageStates((prev) => {
      if (prev[key]) return prev
      let value: string | null = null
      try {
        value = storage.getItem(key)
      } catch (error) {
        console.warn('Failed to load storage value for key:', key, error)
      }
      return { ...prev, [key]: { value } }
    })
  }, [])

  const setStorageValue = useCallback((key: string, value: string | null) => {
    setStorageStates((prev) => ({ ...prev, [key]: { value } }))
    try {
      if (value !== null) {
        storage.setItem(key, value)
      } else {
        storage.removeItem(key)
      }
    } catch (error) {
      console.warn('Failed to set storage value for key:', key, error)
      let fallbackValue: string | null = null
      try {
        fallbackValue = storage.getItem(key)
      } catch (readError) {
        console.warn('Failed to read storage value for key after error:', key, readError)
      }
      setStorageStates((prev) => ({ ...prev, [key]: { value: fallbackValue } }))
      throw error
    }
  }, [])

  const contextValue = useMemo<StorageContextType>(
    () => ({ getStorageState, ensureLoaded, setStorageValue }),
    [getStorageState, ensureLoaded, setStorageValue]
  )

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>
}
