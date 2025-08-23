import React from "react";
import { View, Text, ScrollView } from "react-native";

import { Heading } from "@/components/ui/heading";
import { PlayerState } from "@/types/game";

interface LobbyScreenProps {
  players?: PlayerState[];
}

export default function LobbyScreen({ players = [] }: LobbyScreenProps) {
  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <Heading size="xl" className="text-2xl font-bold text-black mb-6">
        Lobby
      </Heading>

      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-700 mb-4">
          Players ({players.length})
        </Text>

        <ScrollView className="max-h-64">
          {players.map((player, index) => (
            <View
              key={index}
              className="bg-gray-100 rounded-lg p-3 mb-2 flex-row items-center"
            >
              <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
              <Text className="text-gray-800 font-medium">{player.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
