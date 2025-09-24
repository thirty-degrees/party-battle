import FloatingKeyboardInputPreview from '@/components/floatingkeyboardinputPreview'
import TouchableDismissKeyboard from '@/components/touchable-dismiss-keyboard'
import { JoinSection } from '@/src/index/JoinSection'
import { LogoSection } from '@/src/index/LogoSection'
import { NameSection } from '@/src/index/NameSection'
import { StoreBadges } from '@/src/index/StoreBadges'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function HomeScreen() {
  const [gameRoomId, setGameRoomId] = useState('')
  const { partyCode } = useLocalSearchParams<{ partyCode?: string }>()

  const { isLoading } = useLobbyRoomContext()
  const [validationError, setValidationError] = useState<string | undefined>(undefined)
  const [activeFloatingSource, setActiveFloatingSource] = useState<'partyCode' | null>(null)

  useEffect(() => {
    if (partyCode) {
      setGameRoomId(partyCode)
    }
  }, [partyCode])

  return (
    <>
      <TouchableDismissKeyboard>
        <SafeAreaView className="flex-1 items-center bg-background-0 dark:bg-background-950">
          <View className="flex-1 w-full max-w-md p-4 ">
            <View className="flex-1 w-full justify-around  items-center">
              <NameSection validationError={validationError} setValidationError={setValidationError} />
              <LogoSection />
              <JoinSection
                gameRoomId={gameRoomId}
                setGameRoomId={setGameRoomId}
                setValidationError={setValidationError}
                onActiveSourceChange={setActiveFloatingSource}
              />
            </View>
            <View className="h-10 mt-[15%]">
              <StoreBadges />
            </View>
          </View>

          <FloatingKeyboardInputPreview
            activeSource={activeFloatingSource}
            sources={{
              partyCode: {
                value: gameRoomId,
                onChangeText: setGameRoomId,
                placeholder: 'Enter Party Code',
              },
            }}
            size="xl"
            width={200}
            autoFocus
            isDisabled={isLoading}
            returnKeyType="join"
          />
        </SafeAreaView>
      </TouchableDismissKeyboard>
    </>
  )
}
