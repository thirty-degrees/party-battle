import { View, Text, Button } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { CrocGameProvider, useCrocGameContext } from "@/games/CrocGameProvider";
import { Spinner } from "@/components/ui/spinner";
import { usePlayerName } from "@/index/PlayerNameProvider";
import { ButtonText } from "@/components/ui/button";

function CrocGameContent() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { state, isLoading, joinCrocGame } = useCrocGameContext();

  useEffect(() => {
    if (roomId) {
      joinCrocGame(roomId);
    }
  }, [roomId, joinCrocGame]);

  // useEffect(() => {
  //   if (roomId && !room) {
  //     joinCrocGame(roomId);
  //   }
  // }, [roomId, room, joinCrocGame]);

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
      <Button action="primary" onPress={() => joinCrocGame(roomId)}>
        <ButtonText>Join Croc Game</ButtonText>
      </Button>
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
