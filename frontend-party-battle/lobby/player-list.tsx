import React from "react";
import { View, Text, ScrollView } from "react-native";

import { Button, ButtonText } from "@/components/ui/button";
import { LobbyPlayer } from "types-party-battle";

interface LobbyScreenProps {
  players?: LobbyPlayer[];
  currentPlayerId?: string;
  onGameStart?: () => void;
}

export default function PlayerList({
  players = [],
  currentPlayerId,
  onGameStart,
}: LobbyScreenProps) {
  const currentPlayer = players.find(
    (player) => player.name === currentPlayerId
  );
  const isCurrentPlayerReady = currentPlayer?.ready || false;

  return (
    <View className="flex-1 bg-white dark:bg-black justify-between items-center p-4 pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-4 text-center">
          Players ({players.length})
        </Text>

        <ScrollView className="max-h-64">
          {players.map((player, index) => {
            const isCurrentPlayer = player.name === currentPlayerId;
            return (
              <View
                key={index}
                className={`rounded-lg p-3 mb-2 flex-row items-center border ${isCurrentPlayer
                    ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600"
                    : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700"
                  }`}
              >
                <View
                  className={`w-3 h-3 rounded-full mr-3 ${isCurrentPlayer
                      ? "bg-blue-600 dark:bg-blue-400"
                      : "bg-green-500 dark:bg-green-500"
                    }`}
                />
                <Text
                  className={`font-medium ${isCurrentPlayer
                      ? "text-blue-800 dark:text-blue-200"
                      : "text-black dark:text-white"
                    }`}
                >
                  {player.name}
                </Text>
                {player.ready && (
                  <View className="ml-auto bg-green-400 dark:bg-green-600 px-2 py-1 rounded-full">
                    <Text className="text-xs text-black dark:text-white font-medium">
                      ✓
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      </View>

      <View className="w-full max-w-md mt-6">
        <Button
          onPress={onGameStart}
          variant="solid"
          action={isCurrentPlayerReady ? "secondary" : "primary"}
          disabled={isCurrentPlayerReady}
        >
          <ButtonText>{isCurrentPlayerReady ? "Ready!" : "Ready"}</ButtonText>
        </Button>
      </View>
    </View>
  );
}
