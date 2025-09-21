import 'expo-sqlite/localStorage/install'

export const storage = {
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
