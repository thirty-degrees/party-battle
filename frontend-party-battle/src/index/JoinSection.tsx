import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { PartyPopperIcon } from '@/components/ui/icon'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import useToastHelper from '@/components/ui/useToastHelper'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { usePlayerName } from '@/src/storage/PlayerNameProvider'
import { router } from 'expo-router'
import { useEffect } from 'react'
import { Keyboard, View } from 'react-native'

interface JoinSectionProps {
  gameRoomId: string
  setGameRoomId: (id: string) => void
  setValidationError: (error: string | undefined) => void
  onShowFloatingKeyboardInput: (isVisible: boolean) => void
}

export function JoinSection({
  gameRoomId,
  setGameRoomId,
  setValidationError,
  onShowFloatingKeyboardInput,
}: JoinSectionProps) {
  const { createLobbyRoom, joinLobbyRoom, isLoading } = useLobbyRoomContext()
  const { trimmedPlayerName } = usePlayerName()
  const { showError } = useToastHelper()

  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      onShowFloatingKeyboardInput(false)
    })
    return () => {
      hide.remove()
    }
  }, [onShowFloatingKeyboardInput])

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
            if (!trimmedPlayerName || !gameRoomId.trim() || isLoading) return
            handleJoinRoom(gameRoomId.trim())
          }}
          onFocus={() => onShowFloatingKeyboardInput(true)}
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
      <View className="flex-row items-center justify-center w-full">
        <Text size="lg">or host </Text>
        <Button
          variant="link"
          size="lg"
          action="primary"
          onPress={handleCreateRoom}
          isDisabled={!trimmedPlayerName || isLoading}
        >
          <ButtonText>your own party</ButtonText>
          <ButtonIcon className="text-typography-0 dark:text-typography-0" as={PartyPopperIcon} />
        </Button>
      </View>
    </View>
  )
}
