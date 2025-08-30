import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { CrocGameProvider, useCrocGameContext } from "@/games/CrocGameProvider";
import { Spinner } from "@/components/ui/spinner";

function CrocGameContent() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { state, isLoading, joinCrocGame } = useCrocGameContext();

  useEffect(() => {
    if (roomId) {
      joinCrocGame(roomId);
    }
  }, [roomId, joinCrocGame]);

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
        Room State: {state?.gameState}
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room ID: {roomId}
      </Text>
    </View>
  );
}

export default function CrocGameScreen() {
  return (
    <CrocGameProvider>
      <CrocGameContent />
    </CrocGameProvider>
  );
}
