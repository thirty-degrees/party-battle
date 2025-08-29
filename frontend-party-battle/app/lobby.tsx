import React from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";

export default function HomeScreen() {
  return (
    <View className="flex-1 justify-center gap-2 items-center p-4 bg-background-0 dark:bg-background-950">
      <Text>Lobby screen</Text>
    </View>
  );
}
