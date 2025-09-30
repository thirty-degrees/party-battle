import FloatingKeyboardInputPreview from '@/components/floatingkeyboardinputPreview'
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button'
import { PartyPopperIcon } from '@/components/ui/icon'
import { Input, InputField } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Toast, ToastTitle, useToast } from '@/components/ui/toast'
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
  const { createRoom, joinById, isLoading, roomError, invalidRoomId, resetInvalidRoomId } = useLobbyStore(
    useShallow((state) => ({
      createRoom: state.createRoom,
      joinById: state.joinById,
      isLoading: state.isLoading,
      roomError: state.roomError,
      invalidRoomId: state.invalidRoomId,
      resetInvalidRoomId: state.resetInvalidRoomId,
    }))
  )
  const { playerName } = usePlayerName()
  const toast = useToast()

  const showError = (title: string) => {
    toast.show({
      render: () => (
        <Toast action="error" variant="solid">
          <ToastTitle>{title}</ToastTitle>
        </Toast>
      ),
    })
  }

  useEffect(() => {
    if (partyCode) {
      setDraft(partyCode)
      setPartyCode(partyCode.trim())
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
    resetInvalidRoomId()
  }

  const handleCreateRoom = async () => {
    if (!playerName || isLoading) return
    const { success, roomId } = await createRoom(storedPartyCode)
    if (!success) {
      showError('Failed to create party')
      return
    }

    if (roomId) {
      setPartyCode(roomId)
    }

    router.push({
      pathname: '/lobby',
    })
  }

  const handleJoinRoom = async () => {
    if (!playerName || !storedPartyCode || isLoading) return

    const { success } = await joinById(storedPartyCode)

    if (!success) {
      showError('Failed to join party')
      return
    }

    router.push({
      pathname: '/lobby',
    })
  }

  if (roomError) {
    throw roomError
  }

  return (
    <View className="flex-col items-center justify-center w-full gap-2">
      <View className="items-center">
        <Text size="md" className="text-error-800 dark:text-error-700">
          {invalidRoomId ? 'Room not found' : ' '}
        </Text>
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
            onSubmitEditing={handleJoinRoom}
            onFocus={() => setIsFloatingKeyboardInputVisible(true)}
            style={{ width: 200, textAlign: 'center' }}
          />
        </Input>
      </View>
      <Button
        size="xl"
        action="primary"
        onPress={handleJoinRoom}
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
