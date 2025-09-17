import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { storage } from './storage'

type StorageState = {
  value: string | null
  isLoading: boolean
}

type StorageContextType = {
  getStorageState: (key: string) => StorageState | undefined
  ensureLoaded: (key: string) => void
  setStorageValue: (key: string, value: string | null) => Promise<void>
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
      return ctx.setStorageValue(key, value)
    },
    [ctx, key]
  )

  return {
    value: state?.value ?? null,
    setValue,
    isLoading: state?.isLoading ?? true,
  }
}

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storageStates, setStorageStates] = useState<Record<string, StorageState>>({})
  const inflight = useRef<Set<string>>(new Set())

  const getStorageState = useCallback((key: string) => storageStates[key], [storageStates])

  const ensureLoaded = useCallback(
    (key: string) => {
      if (storageStates[key]?.isLoading === false || inflight.current.has(key)) return
      inflight.current.add(key)
      setStorageStates((prev) => ({ ...prev, [key]: { value: prev[key]?.value ?? null, isLoading: true } }))
      storage
        .getItem(key)
        .then((value) => {
          setStorageStates((prev) => ({ ...prev, [key]: { value, isLoading: false } }))
        })
        .catch((error) => {
          console.warn('Failed to load storage value for key:', key, error)
          setStorageStates((prev) => ({
            ...prev,
            [key]: { value: prev[key]?.value ?? null, isLoading: false },
          }))
        })
        .finally(() => {
          inflight.current.delete(key)
        })
    },
    [storageStates]
  )

  const setStorageValue = useCallback(async (key: string, value: string | null) => {
    setStorageStates((prev) => ({ ...prev, [key]: { value, isLoading: false } }))
    try {
      if (value !== null) {
        await storage.setItem(key, value)
      } else {
        await storage.removeItem(key)
      }
    } catch (error) {
      console.warn('Failed to set storage value for key:', key, error)
      setStorageStates((prev) => ({
        ...prev,
        [key]: { value: prev[key]?.value ?? null, isLoading: false },
      }))
      throw error
    }
  }, [])

  const contextValue = useMemo<StorageContextType>(
    () => ({ getStorageState, ensureLoaded, setStorageValue }),
    [getStorageState, ensureLoaded, setStorageValue]
  )

  return <StorageContext.Provider value={contextValue}>{children}</StorageContext.Provider>
}
