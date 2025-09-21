import { SQLiteStorage } from 'expo-sqlite/kv-store'
import { Platform } from 'react-native'

type StorageDriver = {
  getItem: (k: string) => string | null
  setItem: (k: string, v: string) => void
  removeItem: (k: string) => void
}

const getWebLocalStorage = () => {
  if (typeof window === 'undefined') return undefined
  return window.localStorage
}

const webDriver: StorageDriver = {
  getItem: (k) => {
    try {
      const localStorage = getWebLocalStorage()
      if (!localStorage) return null
      return localStorage.getItem(k)
    } catch {
      return null
    }
  },
  setItem: (k, v) => {
    try {
      const localStorage = getWebLocalStorage()
      if (!localStorage) return
      localStorage.setItem(k, v)
    } catch {}
  },
  removeItem: (k) => {
    try {
      const localStorage = getWebLocalStorage()
      if (!localStorage) return
      localStorage.removeItem(k)
    } catch {}
  },
}

const sqliteStorage = new SQLiteStorage('party-battle-storage')

const nativeDriver: StorageDriver = {
  getItem: (k) => {
    try {
      return sqliteStorage.getItemSync(k)
    } catch {
      return null
    }
  },
  setItem: (k, v) => {
    try {
      sqliteStorage.setItemSync(k, v)
    } catch {}
  },
  removeItem: (k) => {
    try {
      sqliteStorage.removeItemSync(k)
    } catch {}
  },
}

export const storage: StorageDriver = Platform.OS === 'web' ? webDriver : nativeDriver
