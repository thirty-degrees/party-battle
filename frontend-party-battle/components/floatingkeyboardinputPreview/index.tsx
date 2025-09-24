import { Input, InputField } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Dimensions, Keyboard, ReturnKeyTypeOptions, View } from 'react-native'

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
  returnKeyType?: ReturnKeyTypeOptions
}

export default function FloatingKeyboardInputPreview({
  activeSource,
  sources,
  size = 'xl',
  width = 200,
  autoFocus = true,
  isDisabled = false,
  returnKeyType,
}: FloatingKeyboardInputPreviewProps) {
  const [keyboardHeight, setKeyboardHeight] = useState(0)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  useEffect(() => {
    const onWillShow = Keyboard.addListener('keyboardWillShow', (e) => {
      const windowHeight = Dimensions.get('window').height
      const keyboardTop = e.endCoordinates.screenY
      const overlap = Math.max(0, windowHeight - keyboardTop)
      setKeyboardHeight(overlap)
      setIsKeyboardVisible(true)
    })
    const onDidShow = Keyboard.addListener('keyboardDidShow', (e) => {
      const windowHeight = Dimensions.get('window').height
      const keyboardTop = e.endCoordinates.screenY
      const overlap = Math.max(0, windowHeight - keyboardTop)
      setKeyboardHeight(overlap)
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
      className="px-2 py-2 items-center justify-center"
      style={{ position: 'absolute', left: 0, right: 0, bottom: keyboardHeight }}
      pointerEvents="box-none"
    >
      <Input variant="outline-with-bg" size={size} isDisabled={isDisabled} style={{ width }}>
        <InputField
          value={current.value}
          onChangeText={current.onChangeText}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onBlur={() => Keyboard.dismiss()}
          style={{ width, textAlign: 'center' }}
          returnKeyType={returnKeyType}
        />
      </Input>
    </View>
  )
}
