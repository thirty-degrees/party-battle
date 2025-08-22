import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

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
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Heading size="md">Connect to Colyseus</Heading>
        <Text>Enter a name and join the room.</Text>
        {Platform.OS !== "web" && (
          <Text style={styles.warningText}>
            Note: Colyseus is only supported on web for now
          </Text>
        )}
        <View style={styles.inputRow}>
          <Input size="md" variant="outline" style={styles.inputContainer}>
            <InputField
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Your name"
              autoCapitalize="none"
              returnKeyType="done"
            />
          </Input>
          <Button
            size="md"
            action="primary"
            onPress={handleJoin}
            style={styles.button}
          >
            <ButtonText>Join</ButtonText>
          </Button>
        </View>
        <Text>Status: {status}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  contentContainer: {
    width: "100%",
    maxWidth: 400,
    gap: 16,
    alignItems: "center",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  inputContainer: {
    flex: 1,
  },
  button: {
    minWidth: 80,
  },
  warningText: {
    color: "#f59e0b",
    textAlign: "center",
  },
});
