import FloatingKeyboardInputPreview from '@/components/floatingkeyboardinputPreview'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { PartyPopperIcon } from '@/components/ui/icon'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import useToastHelper from '@/components/ui/useToastHelper'
import { useLobbyStore } from '@/src/lobby/useLobbyStore'
import { usePartyCode, usePlayerName } from '@/src/storage/userPreferencesStore'
import { OverlayContainer } from '@gluestack-ui/core/overlay/aria'
import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'

export function JoinSection() {
  const { partyCode: storedPartyCode, setPartyCode } = usePartyCode()
  const [draft, setDraft] = useState(storedPartyCode)
  const { partyCode } = useLocalSearchParams<{ partyCode?: string }>()
  const { createRoom, joinById, isLoading, playerNameValidationError } = useLobbyStore(
    useShallow((state) => ({
      createRoom: state.createRoom,
      joinById: state.joinById,
      isLoading: state.isLoading,
      playerNameValidationError: state.playerNameValidationError,
    }))
  )
  const { playerName } = usePlayerName()
  const { showError } = useToastHelper()

  useEffect(() => {
    if (partyCode) {
      setDraft(partyCode)
      setPartyCode(partyCode)
    }
  }, [partyCode, setPartyCode])

  const [isFloatingKeyboardInputVisible, setIsFloatingKeyboardInputVisible] = useState(false)

  useEffect(() => {
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      setIsFloatingKeyboardInputVisible(false)
    })
    return () => {
      hide.remove()
    }
  }, [setIsFloatingKeyboardInputVisible])

  const onChangeDraft = (code: string) => {
    setDraft(code)
    setPartyCode(code.trim())
  }

  const handleCreateRoom = async () => {
    const success = await createRoom()
    if (!success) {
      const errorMessage = playerNameValidationError
      showError('Failed to create party', errorMessage ?? '')
      return
    }

    router.push({
      pathname: '/lobby',
    })
  }

  const handleJoinRoom = async (gameRoomId: string) => {
    const success = await joinById(gameRoomId)

    if (!success) {
      const errorMessage = playerNameValidationError
      showError('Failed to join party', errorMessage ?? '')
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
          value={draft}
          onChangeText={onChangeDraft}
          placeholder="Enter Party Code"
          returnKeyType="join"
          enablesReturnKeyAutomatically
          onSubmitEditing={() => {
            if (!playerName || !draft.trim() || isLoading) return
            handleJoinRoom(draft.trim())
          }}
          onFocus={() => setIsFloatingKeyboardInputVisible(true)}
          style={{ width: 200, textAlign: 'center' }}
        />
      </Input>
      <Button
        size="xl"
        action="primary"
        onPress={() => handleJoinRoom(draft.trim())}
        isDisabled={!playerName || !draft.trim() || isLoading}
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
          value={draft}
          onChangeText={onChangeDraft}
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
