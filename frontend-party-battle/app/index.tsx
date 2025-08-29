import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import RainbowText from "@/components/rainbow-text";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { JoinRoomModal } from "@/components/ui/modal/join-room-modal";
import { useToastHelper } from "@/components/ui/toast-helper";
import Constants from "expo-constants";
import { useRoomStore } from "@/hooks/useRoomStore";

import { Client } from "colyseus.js";
import useStorage from "@/hooks/useStorage";

export default function HomeScreen() {
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { setRoom } = useRoomStore();
  const [playerName, setPlayerName, isLoadingPlayerName] = useStorage("playerName");
  const toast = useToastHelper();

  const handleCreateRoom = async () => {
    if (!playerName) {
      return;
    }

    setIsCreating(true);

    try {
      const trimmedName = playerName.trim();
      setPlayerName(trimmedName);

      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const room = await client.create("lobby_room", {
        name: trimmedName,
      });

      setRoom(room);

      router.push({
        pathname: "/room",
        params: {
          roomId: room.roomId,
        },
      });
      setIsCreating(false);
    } catch (e) {
      console.error("Error creating room:", e);

      toast.showError("Error", "Failed to create room. Please try again.");
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!playerName?.trim()) {
      toast.showError("Error", "Please enter your name first.");
      return;
    }

    setIsJoining(true);

    try {
      const trimmedName = playerName.trim();
      setPlayerName(trimmedName);

      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const room = await client.joinById(roomId, {
        name: trimmedName,
      });

      setRoom(room);

      router.push({
        pathname: "/room",
        params: {
          roomId: room.roomId,
        },
      });
      setShowJoinModal(false);
      setIsJoining(false);
    } catch (e) {
      console.error("Error joining room:", e);

      toast.showError(
        "Error",
        "Failed to join room. Please check the room ID and try again."
      );
      setIsJoining(false);
    }
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
          isDisabled={!playerName?.trim() || isCreating}
        >
          <ButtonText>{isCreating ? "Creating..." : "Create Room"}</ButtonText>
        </Button>
        <Button
          size="md"
          action="secondary"
          onPress={() => setShowJoinModal(true)}
          isDisabled={!playerName?.trim() || isJoining}
        >
          <ButtonText>{isJoining ? "Joining..." : "Join Room"}</ButtonText>
        </Button>
      </View>

      <JoinRoomModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onJoin={handleJoinRoom}
        isLoading={isJoining}
      />
    </View>
  );
}
