import { router } from "expo-router";
import { useState } from "react";
import { View } from "react-native";

import RainbowText from "@/components/rainbow-text";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { JoinRoomModal } from "@/components/ui/modal/join-room-modal";

import useStorage from "@/index/useStorage";
import { useLobbyContext } from "@/lobby/LobbyProvider";

export default function HomeScreen() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [playerName, setPlayerName, isLoadingPlayerName] = useStorage("playerName");

  const { createLobby, joinLobby, isLoading } = useLobbyContext();

  const trimPlayerName = () => {
    const trimmedName = playerName!.trim();
    setPlayerName(trimmedName);
    return trimmedName;
  }

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
    <View className="flex-1 justify-center gap-2 items-center p-4 bg-background-0 dark:bg-background-950">
      <View className="flex-row items-center gap-2">
        <RainbowText text="Party" />
        <Heading size="xl">Battle</Heading>
      </View>
      <Text>Enter a name and create a room.</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={isLoadingPlayerName}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Enter your name..."
          autoComplete="username"
        />
      </Input>
      <View className="flex-col gap-2 mt-20">
        <Button
          size="md"
          action="primary"
          onPress={handleCreateRoom}
          isDisabled={!playerName?.trim() || isLoading}
        >
          <ButtonText>{isLoading ? "Loading..." : "Create Room"}</ButtonText>
        </Button>
        <Button
          size="md"
          action="secondary"
          onPress={() => setShowJoinModal(true)}
          isDisabled={!playerName?.trim() || isLoading}
        >
          <ButtonText>{isLoading ? "Loading..." : "Join Room"}</ButtonText>
        </Button>
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
