import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, View } from "react-native";

import { RainbowText } from "@/components/RainbowText";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input, InputField } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import Constants from "expo-constants";

// Only import Colyseus on web for now
let Client: any = null;
let Room: any = null;

if (Platform.OS === "web") {
  const colyseus = require("colyseus.js");
  Client = colyseus.Client;
  Room = colyseus.Room;
}

// Type for room reference
type RoomType = any;

export default function HomeScreen() {
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState<string>("Idle");
  const roomRef = useRef<RoomType | null>(null);

  const handleJoin = async () => {
    if (Platform.OS !== "web") {
      setStatus("Colyseus is only supported on web for now");
      return;
    }

    if (!Client) {
      setStatus("Colyseus client not available");
      return;
    }

    try {
      setStatus("Connecting...");
      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const room = await client.joinOrCreate("my_room", {
        name: playerName || "Player",
      });
      roomRef.current = room;
      setStatus(`Joined room: ${room.roomId}`);

      // Navigate to room screen
      router.push({
        pathname: "/room",
        params: { roomId: room.roomId },
      });

      room.onMessage("message", (message: unknown) => {
        // eslint-disable-next-line no-console
        console.log("[Colyseus] message:", message);
      });

      room.onLeave((code: number) => {
        setStatus(`Left room (code ${code})`);
        roomRef.current = null;
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setStatus("Failed to join room");
    }
  };

  return (
    <View className="flex-1 justify-center gap-2 items-center p-4 bg-background-0">
      <View className="flex-row items-center gap-2">
        <RainbowText text="Party" />
        <Heading size="xl">Battle</Heading>
      </View>
      <Text>Enter a name and join the room.</Text>
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
          placeholder="Enter Text here..."
        />
      </Input>
      <Button size="md" action="primary" onPress={handleJoin} className="mt-20">
        <ButtonText>Join</ButtonText>
      </Button>
    </View>
  );
}
