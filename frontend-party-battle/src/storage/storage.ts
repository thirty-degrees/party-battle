import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

type StorageDriver = {
  getItem: (k: string) => Promise<string | null>
  setItem: (k: string, v: string) => Promise<void>
  removeItem: (k: string) => Promise<void>
}

const webDriver: StorageDriver = {
  getItem: async (k) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null
      return window.localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: async (k, v) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.setItem(k, v)
    } catch {}
  },
  removeItem: async (k) => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return
      window.localStorage.removeItem(k)
    } catch {}
  },
}

const nativeDriver: StorageDriver = {
  getItem: (k) => AsyncStorage.getItem(k),
  setItem: (k, v) => AsyncStorage.setItem(k, v),
  removeItem: (k) => AsyncStorage.removeItem(k),
}

export const storage: StorageDriver = Platform.OS === 'web' ? webDriver : nativeDriver
