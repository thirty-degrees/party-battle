import FloatingKeyboardInputPreview from '@/components/floatingkeyboardinputPreview'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { PartyPopperIcon } from '@/components/ui/icon'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import useToastHelper from '@/components/ui/useToastHelper'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePlayerName } from '@/src/storage/userPreferencesStore'
import { OverlayContainer } from '@gluestack-ui/core/overlay/aria'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

export function JoinSection() {
  const [gameRoomId, setGameRoomId] = useState('')
  const { partyCode } = useLocalSearchParams<{ partyCode?: string }>()
  const { createLobbyRoom, joinLobbyRoom, isLoading, playerNameValidationError, roomIdValidationError } =
    useLobbyStore(
      useShallow((state) => ({
        createLobbyRoom: state.createLobbyRoom,
        joinLobbyRoom: state.joinLobbyRoom,
        isLoading: state.isLoading,
        playerNameValidationError: state.playerNameValidationError,
        roomIdValidationError: state.roomIdValidationError,
      }))
    )
  const { playerName } = usePlayerName()
  const { showError } = useToastHelper()

  useEffect(() => {
    if (partyCode) {
      setGameRoomId(partyCode)
    }
  }, [partyCode])

  const [isFloatingKeyboardInputVisible, setIsFloatingKeyboardInputVisible] = useState(false)

  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsFloatingKeyboardInputVisible(false)
    })
    return () => {
      hide.remove()
    }
  }, [setIsFloatingKeyboardInputVisible])

  const handleCreateRoom = async () => {
    await createLobbyRoom()

    router.push({
      pathname: '/lobby',
    })
  }

  const handleJoinRoom = async (gameRoomId: string) => {
    const success = await joinLobbyRoom(gameRoomId)

    if (!success) {
      const errorMessage = playerNameValidationError || roomIdValidationError || 'Failed to join party'
      showError('Failed to join party', errorMessage)
      return
    }

    router.push({
      pathname: '/lobby',
    })
  }

  return (
    <View className="flex-col items-center justify-center w-full gap-2">
      <Input
        variant="outline-with-bg"
        size="xl"
        isInvalid={false}
        isDisabled={isLoading}
        style={{ width: 200 }}
      >
        <InputField
          value={gameRoomId}
          onChangeText={setGameRoomId}
          placeholder="Enter Party Code"
          returnKeyType="join"
          enablesReturnKeyAutomatically
          onSubmitEditing={() => {
            if (!playerName || !gameRoomId.trim() || isLoading) return
            handleJoinRoom(gameRoomId.trim())
          }}
          onFocus={() => setIsFloatingKeyboardInputVisible(true)}
          style={{ width: 200, textAlign: 'center' }}
        />
      </Input>
      <Button
        size="xl"
        action="primary"
        onPress={() => handleJoinRoom(gameRoomId.trim())}
        isDisabled={!playerName || !gameRoomId.trim() || isLoading}
        style={{ width: 200, paddingHorizontal: 8 }}
      >
        <ButtonText>{isLoading ? 'Loading...' : 'JOIN'}</ButtonText>
      </Button>
      <View className="flex-row items-center justify-center w-full">
        <Text size="lg" className="text-typography-600 dark:text-typography-400">
          or host{' '}
        </Text>
        <Button
          className="gap-1"
          variant="link"
          size="lg"
          action="primary"
          onPress={handleCreateRoom}
          isDisabled={!playerName || isLoading}
        >
          <ButtonText>your own party</ButtonText>
          <ButtonIcon className="text-typography-900 dark:text-typography-0" size="md" as={PartyPopperIcon} />
        </Button>
      </View>

      <OverlayContainer>
        <FloatingKeyboardInputPreview
          value={gameRoomId}
          onChangeText={setGameRoomId}
          placeholder="Enter Party Code"
          isVisible={isFloatingKeyboardInputVisible}
          size="xl"
          width={200}
          autoFocus
          isDisabled={isLoading}
          returnKeyType="join"
        />
      </OverlayContainer>
    </View>
  )
}
