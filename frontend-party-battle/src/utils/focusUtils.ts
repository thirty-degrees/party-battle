import { Platform } from 'react-native'

export function blurActiveElement(): void {
  if (Platform.OS !== 'web') return

  setTimeout(() => {
    if (document.activeElement) {
      ;(document.activeElement as HTMLElement).blur()
    }
  }, 0)
}
