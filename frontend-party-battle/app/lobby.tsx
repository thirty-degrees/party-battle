import React from "react";
import { View, Text, ScrollView } from "react-native";

import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { PlayerState } from "@/types/game";

interface LobbyScreenProps {
  players?: PlayerState[];
  currentPlayerId?: string;
  onGameStart?: () => void;
}

export default function LobbyScreen({
  players = [],
  currentPlayerId,
  onGameStart,
}: LobbyScreenProps) {
  return (
    <View className="flex-1 bg-black justify-between items-center p-4 pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-400 mb-4 text-center">
          Players ({players.length})
        </Text>

        <ScrollView className="max-h-64">
          {players.map((player, index) => {
            const isCurrentPlayer = player.id === currentPlayerId;
            return (
              <View
                key={index}
                className={`rounded-lg p-3 mb-2 flex-row items-center border ${
                  isCurrentPlayer
                    ? "bg-blue-900 border-blue-600"
                    : "bg-gray-900 border-gray-700"
                }`}
              >
                <View
                  className={`w-3 h-3 rounded-full mr-3 ${
                    isCurrentPlayer ? "bg-blue-400" : "bg-green-500"
                  }`}
                />
                <Text
                  className={`font-medium ${
                    isCurrentPlayer ? "text-blue-200" : "text-white"
                  }`}
                >
                  {player.name}
                </Text>
              </View>
            );
          })}
        </ScrollView>
      </View>

      {/* Start Game Button */}
      <View className="w-full max-w-md mt-6">
        <Button onPress={onGameStart} variant="solid" action="primary">
          <ButtonText>Start</ButtonText>
        </Button>
      </View>
    </View>
  );
}
