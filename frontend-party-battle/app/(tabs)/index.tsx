import type { Room } from "colyseus.js";
import { Client } from "colyseus.js";
import React, { useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { SERVER_ENDPOINT } from "@/expo-env.d";

export default function HomeScreen() {
  const [playerName, setPlayerName] = useState("");
  const [status, setStatus] = useState<string>("Idle");
  const roomRef = useRef<Room | null>(null);

  const handleJoin = async () => {
    try {
      setStatus("Connecting...");
      const client = new Client(SERVER_ENDPOINT);
      const room = await client.joinOrCreate("my_room", {
        name: playerName || "Player",
      });
      roomRef.current = room;
      setStatus(`Joined room: ${room.roomId}`);

      room.onMessage("message", (message: unknown) => {
        // eslint-disable-next-line no-console
        console.log("[Colyseus] message:", message);
      });

      room.onLeave((code) => {
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
        <ThemedText type="subtitle">Connect to Colyseus</ThemedText>
        <ThemedText>Enter a name and join the room.</ThemedText>
        <View style={styles.inputRow}>
          <TextInput
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Your name"
            placeholderTextColor="#888"
            style={styles.textInput}
            autoCapitalize="none"
            returnKeyType="done"
          />
          <Pressable
            onPress={handleJoin}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Join
            </ThemedText>
          </Pressable>
        </View>
        <ThemedText>Status: {status}</ThemedText>
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
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 12, android: 8, default: 10 }),
    color: "#111",
    backgroundColor: "#fff",
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#2563eb",
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: "#1d4ed8",
  },
  buttonText: {
    color: "#fff",
  },
});
