import { Input, InputField } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'

export type FloatingKeyboardInputPreviewSourceBinding = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export type FloatingKeyboardInputPreviewProps = {
  activeSource: string | null
  sources: Record<string, FloatingKeyboardInputPreviewSourceBinding>
  size?: 'sm' | 'md' | 'lg' | 'xl'
  width?: number
  autoFocus?: boolean
  isDisabled?: boolean
}

export default function FloatingKeyboardInputPreview({
  activeSource,
  sources,
  size = 'xl',
  width = 200,
  autoFocus = true,
  isDisabled = false,
}: FloatingKeyboardInputPreviewProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const onWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height)
      setIsKeyboardVisible(true)
    })
    const onDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height)
      setIsKeyboardVisible(true)
    })

    const onWillHide = Keyboard.addListener('keyboardWillHide', () => {
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    })
    const onDidHide = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    })

    return () => {
      onWillShow.remove()
      onDidShow.remove()
      onWillHide.remove()
      onDidHide.remove()
    }
  }, [])

  if (!isKeyboardVisible || !activeSource) return null

  const current = sources[activeSource]
  if (!current) return null

  const placeholder = current.placeholder ?? 'Type here...'

  return (
    <View
      className="bg-background-0 dark:bg-background-900 border-t border-outline-300 dark:border-outline-700 px-2 py-2 items-center justify-center"
      style={{ position: 'absolute', left: 0, right: 0, bottom: keyboardHeight }}
      pointerEvents="box-none"
    >
      <Input variant="outline" size={size} isDisabled={isDisabled} style={{ width }}>
        <InputField
          value={current.value}
          onChangeText={current.onChangeText}
          placeholder={placeholder}
          autoFocus={autoFocus}
          style={{ width, textAlign: 'center' }}
        />
      </Input>
    </View>
  )
}
