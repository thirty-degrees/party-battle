import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Client, Room } from "colyseus.js";
import Constants from "expo-constants";
import { CrocGame } from "types-party-battle";
import useStorage from "@/index/useStorage";
import { Spinner } from "@/components/ui/spinner";

export default function CrocGameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const [room, setRoom] = useState<Room<CrocGame> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [playerName] = useStorage("playerName");

  const joinRoom = () => {
    if (roomId && playerName && !room) {
      try {
        setIsLoading(true);
        const client = new Client(Constants.expoConfig?.extra?.backendUrl);
        const joinedRoom = client
          .joinById<CrocGame>(roomId, {
            name: playerName,
          })
          .then((joinedRoom) => {
            console.log("Joined room:", joinedRoom.roomId);
            console.log("Initial state:", joinedRoom.state);
            console.log("Initial gameState:", joinedRoom.state.gameState);
            console.log("Initial gameType:", joinedRoom.state.gameType);
            setRoom(joinedRoom);
          });
      } catch (error) {
        console.error("Failed to join croc game:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    joinRoom();
    console.log("useEffect()");
  }, [roomId, playerName]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-black justify-center items-center">
        <Spinner size="large" />
        <Text className="text-black dark:text-white text-lg mt-4">
          Joining game...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room State: {room?.state.gameState}
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room ID: {roomId}
      </Text>
    </View>
  );
}
