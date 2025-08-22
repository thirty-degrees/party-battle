import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";

import { RainbowText } from "@/components/RainbowText";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Constants from "expo-constants";
import { useRoomStore } from "@/hooks/useRoomStore";

const { Client } = require("colyseus.js");

export default function HomeScreen() {
  const [playerName, setPlayerName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { setRoom } = useRoomStore();

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      return;
    }

    setIsCreating(true);

    try {
      localStorage.setItem("playerName", playerName.trim());

      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const room = await client.create("my_room", {
        name: playerName.trim(),
      });

      // Store the room instance in the global store
      setRoom(room);

      router.push({
        pathname: "/room",
        params: {
          roomId: room.roomId,
        },
      });
      setIsCreating(false);
    } catch (error) {
      console.error("Failed to create room:", error);
      setIsCreating(false);
    }
  };

  return (
    <View className="flex-1 justify-center gap-2 items-center p-4 bg-background-0">
      <View className="flex-row items-center gap-2">
        <RainbowText text="Party" />
        <Heading size="xl">Battle</Heading>
      </View>
      <Text>Enter a name and create a room.</Text>
      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Enter your name..."
        />
      </Input>
      <Button
        size="md"
        action="primary"
        onPress={handleCreateRoom}
        className="mt-20"
        isDisabled={!playerName.trim() || isCreating}
      >
        <ButtonText>{isCreating ? "Creating..." : "Create Room"}</ButtonText>
      </Button>
    </View>
  );
}
