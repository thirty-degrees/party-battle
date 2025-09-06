import { router, useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { View } from 'react-native'

import RainbowText from '@/components/RainbowText'
import { Button, ButtonText } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'
import { Input, InputField } from '@/components/ui/input'
import { JoinRoomModal } from '@/components/ui/modal/join-room-modal'
import { Text } from '@/components/ui/text'

import SafeAreaPlaceholder from '@/components/SafeAreaPlaceholder'
import { usePlayerName } from '@/src/index/PlayerNameProvider'
import { useLobbyRoomContext } from '@/src/lobby/LobbyRoomProvider'
import { PLAYER_NAME_MAX_LENGTH } from 'types-party-battle'

export default function HomeScreen() {
  const [showJoinModal, setShowJoinModal] = useState(false)
  const { partyCode } = useLocalSearchParams<{ partyCode?: string }>()
  const { playerName, setPlayerName, isLoading: isLoadingPlayerName } = usePlayerName()

  const { createLobbyRoom, joinLobbyRoom, isLoading } = useLobbyRoomContext()

  const trimPlayerName = () => {
    const trimmedName = playerName!.trim()
    setPlayerName(trimmedName)
    return trimmedName
  }

  const handleCreateRoom = async () => {
    const trimmedName = trimPlayerName()

    await createLobbyRoom(trimmedName)

    router.push({
      pathname: '/lobby',
    })
  }

  const handleJoinRoom = async (roomId: string) => {
    const trimmedName = trimPlayerName()

    await joinLobbyRoom(roomId, trimmedName)

    router.push({
      pathname: '/lobby',
    })

    setShowJoinModal(false)
  }

  return (
    <View className="flex-1 bg-background-0 dark:bg-background-950">
      <SafeAreaPlaceholder position="top" />
      <View className="flex-1 p-4 items-center">
        <View className="flex-1 max-w-md w-full justify-evenly items-center">
          <View className="flex-col items-center gap-4 w-full">
            <Text size="xl" style={{ width: 200, textAlign: 'center' }}>
              Name
            </Text>
            <Input
              variant="outline"
              size="xl"
              isDisabled={isLoadingPlayerName}
              isInvalid={false}
              isReadOnly={false}
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 200,
              }}
            >
              <InputField
                aria-label="Username"
                value={playerName}
                onChangeText={setPlayerName}
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
          <View className="flex-col w-full gap-4">
            {partyCode && (
              <View className="flex-row items-center justify-center w-full">
                <Button
                  size="xl"
                  action="primary"
                  variant="solid"
                  onPress={() => handleJoinRoom(partyCode)}
                  isDisabled={!playerName?.trim() || isLoading}
                  style={{ width: 200, paddingHorizontal: 8 }}
                >
                  <ButtonText>{isLoading ? 'Loading...' : `JOIN ${partyCode}`}</ButtonText>
                </Button>
              </View>
            )}
            <View className="flex-row items-center justify-center w-full">
              <View className="flex-row gap-2">
                <Button
                  size="xl"
                  action="primary"
                  onPress={() => setShowJoinModal(true)}
                  isDisabled={!playerName?.trim() || isLoading}
                  style={{ width: 200, paddingHorizontal: 8 }}
                >
                  <ButtonText>{isLoading ? 'Loading...' : 'JOIN PARTY'}</ButtonText>
                </Button>
              </View>
            </View>
            <View className="flex-row items-center justify-center w-full">
              <Button
                size="xl"
                action="primary"
                variant="outline"
                onPress={handleCreateRoom}
                isDisabled={!playerName?.trim() || isLoading}
                style={{ width: 200, paddingHorizontal: 8 }}
              >
                <ButtonText>{isLoading ? 'Loading...' : 'CREATE PARTY'}</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </View>
      <SafeAreaPlaceholder position="bottom" />

      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
        isLoading={isLoading}
      />
    </View>
  )
}
