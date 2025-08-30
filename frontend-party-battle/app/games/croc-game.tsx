import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { CrocGameProvider, useCrocGameContext } from "@/games/CrocGameProvider";
import { Spinner } from "@/components/ui/spinner";
import CrocGameView from "@/games/CrocGameView";

function CrocGameContent() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { room, isLoading, joinCrocGame } = useCrocGameContext();

  useEffect(() => {
    if (roomId) {
      joinCrocGame(roomId);
    }
  }, [roomId, joinCrocGame]);

  if (isLoading || !room) {
    return (
      <View className="flex-1 bg-white dark:bg-black justify-center items-center">
        <Spinner size="large" />
        <Text className="text-black dark:text-white text-lg mt-4">
          Joining game...
        </Text>
      </View>
    );
  }

  return <CrocGameView room={room} />;
}

export default function CrocGameScreen() {
  return (
    <CrocGameProvider>
      <CrocGameContent />
    </CrocGameProvider>
  );
}
