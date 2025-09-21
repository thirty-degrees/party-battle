import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native'

import FloatingKeyboardInputPreview from '@/components/floatingkeyboardinputPreview'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import useToastHelper from '@/components/ui/useToastHelper'

import RainbowText from '@/components/rainbow-text'
import { StoreBadges } from '@/src/index/StoreBadges'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { usePlayerName } from '@/src/storage/PlayerNameProvider'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PLAYER_NAME_MAX_LENGTH } from 'types-party-battle/consts/config'

export default function HomeScreen() {
  const [gameRoomId, setGameRoomId] = useState('')
  const { partyCode } = useLocalSearchParams<{ partyCode?: string }>()
  const { playerName, trimmedPlayerName, setPlayerName } = usePlayerName()

  const { createLobbyRoom, joinLobbyRoom, isLoading } = useLobbyRoomContext()
  const [validationError, setValidationError] = useState<string | undefined>(undefined)
  const { showError } = useToastHelper()
  const [activeFloatingSource, setActiveFloatingSource] = useState<'playerName' | 'partyCode' | null>(null)

  useEffect(() => {
    if (partyCode) {
      setGameRoomId(partyCode)
    }
  }, [partyCode])

  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setActiveFloatingSource(null)
    })
    return () => {
      hide.remove()
    }
  }, [])

  const handleCreateRoom = async () => {
    await createLobbyRoom()

    router.push({
      pathname: '/lobby',
    })
  }

  const handleJoinRoom = async (gameRoomId: string) => {
    const validationError = await joinLobbyRoom(gameRoomId)

    if (validationError) {
      setValidationError(validationError)
      showError('Failed to join party', validationError)
      return
    }

    router.push({
      pathname: '/lobby',
    })
  }

  const onChangePlayerName = (name: string) => {
    setPlayerName(name)
    setValidationError(undefined)
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <SafeAreaView className="flex-1 items-center bg-background-0 dark:bg-background-950">
          <View className="flex-1 w-full max-w-md justify-between  p-4 items-center">
            <View className="flex-col items-center gap-4 w-full mt-10">
              <Text size="xl" style={{ width: 200, textAlign: 'center' }}>
                Name
              </Text>
              <Input
                variant="outline"
                size="xl"
                isInvalid={!!validationError}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 200,
                }}
              >
                <InputField
                  aria-label="Username"
                  value={playerName || ''}
                  onChangeText={onChangePlayerName}
                  placeholder="Enter your name..."
                  autoComplete="username"
                  maxLength={PLAYER_NAME_MAX_LENGTH}
                  style={{ width: 200, textAlign: 'center' }}
                />
              </Input>
            </View>
            <View className="flex-row items-center gap-2">
              <Heading size="4xl">
                <RainbowText text="Party" className="text-6xl" />
                <Text className="text-6xl"> Battle</Text>
              </Heading>
            </View>
            <View className="w-full gap-12">
              <View className="flex-col w-full gap-3">
                <View className="flex-col items-center justify-center w-full gap-2">
                  <Input
                    variant="outline"
                    size="xl"
                    isInvalid={false}
                    isDisabled={isLoading}
                    style={{ width: 200 }}
                  >
                    <InputField
                      value={gameRoomId}
                      onChangeText={setGameRoomId}
                      placeholder="Enter Party Code"
                      autoCapitalize="characters"
                      returnKeyType="join"
                      enablesReturnKeyAutomatically
                      onSubmitEditing={() => {
                        if (!trimmedPlayerName || !gameRoomId.trim() || isLoading) return
                        handleJoinRoom(gameRoomId.trim())
                      }}
                      onFocus={() => setActiveFloatingSource('partyCode')}
                      style={{ width: 200, textAlign: 'center' }}
                    />
                  </Input>
                  <Button
                    size="xl"
                    action="primary"
                    onPress={() => handleJoinRoom(gameRoomId.trim())}
                    isDisabled={!trimmedPlayerName || !gameRoomId.trim() || isLoading}
                    style={{ width: 200, paddingHorizontal: 8 }}
                  >
                    <ButtonText>{isLoading ? 'Loading...' : 'JOIN'}</ButtonText>
                  </Button>
                </View>
                <View className="flex-row items-center justify-center w-full">
                  <Text size="lg">or host </Text>
                  <Button
                    variant="link"
                    size="lg"
                    action="primary"
                    onPress={handleCreateRoom}
                    isDisabled={!trimmedPlayerName || isLoading}
                  >
                    <ButtonText>your own party 🎉</ButtonText>
                  </Button>
                </View>
              </View>
              <View className="h-10">
                <StoreBadges />
              </View>
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
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  )
}
