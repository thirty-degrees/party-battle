import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { Heading } from "@/components/ui/heading";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading size="xl" style={styles.roomName}>
          {roomId || "Room"}
        </Heading>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  roomName: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
