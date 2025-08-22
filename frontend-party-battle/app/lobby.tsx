import React from "react";
import { View } from "react-native";

import { Heading } from "@/components/ui/heading";

export default function LobbyScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center">
      <Heading size="xl" className="text-2xl font-bold text-black">
        Lobby
      </Heading>
    </View>
  );
}
