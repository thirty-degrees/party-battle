import { rgbColorToString } from 'types-party-battle/types/RGBColorSchema'
import { useLobbyStore } from './useLobbyStore'

export const usePlayerColorString = (playerName: string) => {
  return useLobbyStore((state) => {
    const color = Object.values(state.view.players).find(
      (p: { name: string; color?: { r: number; g: number; b: number } }) => p.name === playerName
    )?.color
    return color ? rgbColorToString(color) : undefined
  })
}
