import { ReactElement } from 'react'
import { Keyboard, Platform, TouchableWithoutFeedback } from 'react-native'

type TouchableDismissKeyboardProps = {
  children: ReactElement
  enabled?: boolean
  accessible?: boolean
}

export default function TouchableDismissKeyboard({
  children,
  enabled = true,
  accessible = false,
}: TouchableDismissKeyboardProps) {
  if (!enabled) return children
  if (Platform.OS === 'web') return children
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={accessible}>
      {children}
    </TouchableWithoutFeedback>
  )
}
