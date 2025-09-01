import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import RainbowText from "@/components/RainbowText";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { JoinRoomModal } from "@/components/ui/modal/join-room-modal";

import { usePlayerName } from "@/index/PlayerNameProvider";
import { useLobbyContext } from "@/lobby/LobbyProvider";
import { PLAYER_NAME_MAX_LENGTH } from "types-party-battle";

export default function HomeScreen() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const {
    playerName,
    setPlayerName,
    isLoading: isLoadingPlayerName,
  } = usePlayerName();

  const { createLobby, joinLobby, isLoading } = useLobbyContext();

  const trimPlayerName = () => {
    const trimmedName = playerName!.trim();
    setPlayerName(trimmedName);
    return trimmedName;
  };

  const handleCreateRoom = async () => {
    const trimmedName = trimPlayerName();

    await createLobby(trimmedName);

    router.push({
      pathname: "/lobby",
    });
  };

  const handleJoinRoom = async (roomId: string) => {
    const trimmedName = trimPlayerName();

    await joinLobby(roomId, trimmedName);

    router.push({
      pathname: "/lobby",
    });

    setShowJoinModal(false);
  };

  return (
    <View className="flex-1 p-4 justify-center items-center bg-background-0 dark:bg-background-950">
      <View className="max-w-md w-full justify-center gap-40 items-center ">
        <View className="flex-row items-center justify-between w-full">
          <Text size="lg">Name</Text>
          <Input
            variant="outline"
            size="lg"
            isDisabled={isLoadingPlayerName}
            isInvalid={false}
            isReadOnly={false}
            className="flex-1"
            style={{ maxWidth: 180 }}
          >
            <InputField
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Enter your name..."
              autoComplete="username"
              maxLength={PLAYER_NAME_MAX_LENGTH}
            />
          </Input>
        </View>
        <View className="flex-row items-center gap-2">
          <Heading size="4xl">
            <RainbowText text="Party" className="text-6xl" />
            <Text className="text-6xl"> Battle</Text>
          </Heading>
        </View>
        <View className="flex-col w-full gap-2">
          <View className="flex-row items-center justify-between w-full">
            <Text size="lg">Create Party</Text>
            <Button
              size="md"
              action="primary"
              onPress={handleCreateRoom}
              isDisabled={!playerName?.trim() || isLoading}
              style={{ width: 125, paddingHorizontal: 8 }}
            >
              <ButtonText>{isLoading ? "Loading..." : "CREATE"}</ButtonText>
            </Button>
          </View>
          <View className="flex-row items-center justify-between w-full">
            <Text size="lg">Join Party</Text>
            <View className="flex-row gap-2">
              <Button
                size="md"
                action="primary"
                onPress={() => setShowJoinModal(true)}
                isDisabled={!playerName?.trim() || isLoading}
                style={{ width: 125, paddingHorizontal: 8 }}
              >
                <ButtonText>{isLoading ? "Loading..." : "PARTY CODE"}</ButtonText>
              </Button>
              <Button
                size="md"
                action="primary"
                onPress={() => setShowJoinModal(true)}
                isDisabled={!playerName?.trim() || isLoading}
                style={{ width: 125, paddingHorizontal: 8 }}
              >
                <ButtonText>{isLoading ? "Loading..." : "SCAN QR"}</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </View>

      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
        isLoading={isLoading}
      />
    </View>
  );
}
