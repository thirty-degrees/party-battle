import 'expo-sqlite/localStorage/install'
import { StateStorage } from 'zustand/middleware'

export const storage: StateStorage<void> = {
  getItem: (k: string) => {
    return globalThis.localStorage.getItem(k)
  },
  setItem: (k: string, v: string) => {
    globalThis.localStorage.setItem(k, v)
  },
  removeItem: (k: string) => {
    globalThis.localStorage.removeItem(k)
  },
}
