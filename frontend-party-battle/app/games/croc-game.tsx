import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function CrocGameScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room ID: {roomId}
      </Text>
    </View>
  );
}
