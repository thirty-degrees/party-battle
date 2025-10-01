import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import { storage } from './storage'

interface UserPreferencesState {
  playerName: string
  setPlayerName: (value: string) => void
  partyCode: string
  setPartyCode: (value: string) => void
  isPartyCodeVisible: boolean
  setIsPartyCodeVisible: (isVisible: boolean) => void
  potatoSwipeCount: number
  setPotatoSwipeCount: (value: number) => void
}

export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      playerName: '',
      setPlayerName: (value: string) => set({ playerName: value }),
      partyCode: '',
      setPartyCode: (value: string) => set({ partyCode: value }),
      isPartyCodeVisible: true,
      setIsPartyCodeVisible: (isVisible: boolean) => set({ isPartyCodeVisible: isVisible }),
      potatoSwipeCount: 0,
      setPotatoSwipeCount: (value: number) => set({ potatoSwipeCount: value }),
    }),
    {
      name: 'user-preferences',
      storage: createJSONStorage<UserPreferencesState, void>(() => storage),
    }
  )
)

export const usePlayerName = () =>
  useUserPreferencesStore(
    useShallow((s) => ({
      playerName: s.playerName,
      setPlayerName: s.setPlayerName,
    }))
  )

export const useIsPartyCodeVisible = () =>
  useUserPreferencesStore(
    useShallow((s) => ({
      isPartyCodeVisible: s.isPartyCodeVisible,
      setIsPartyCodeVisible: s.setIsPartyCodeVisible,
    }))
  )

export const usePartyCode = () =>
  useUserPreferencesStore(
    useShallow((s) => ({
      partyCode: s.partyCode,
      setPartyCode: s.setPartyCode,
    }))
  )

export const useSwipeHintVisibility = () =>
  useUserPreferencesStore(
    useShallow((s) => ({
      showSwipeHint: s.potatoSwipeCount < 3,
      potatoSwipeCount: s.potatoSwipeCount,
      setPotatoSwipeCount: s.setPotatoSwipeCount,
    }))
  )
