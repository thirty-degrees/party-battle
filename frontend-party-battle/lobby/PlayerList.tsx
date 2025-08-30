import { View, Text, ScrollView } from "react-native";

import { LobbyPlayer, MAX_AMOUNT_OF_PLAYERS } from "types-party-battle";
import { MapSchema } from "@colyseus/schema";
import PlayerListEntry from "./PlayerListEntry";

interface LobbyScreenProps {
  players?: MapSchema<LobbyPlayer, string>;
  currentPlayerId?: string;
  onGameStart?: () => void;
}

export default function PlayerList({
  players,
  currentPlayerId,
}: LobbyScreenProps) {
  const playersArray = players ? Array.from(players.values()) : [];

  return (
    <View className="flex-1 justify-between p-4 pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Players ({playersArray.length} / {MAX_AMOUNT_OF_PLAYERS})
        </Text>

        <ScrollView className="max-h-64">
          {playersArray.map((player, index) => {
            const playerId = Array.from(players?.keys() || [])[index];
            const isCurrentPlayer = playerId === currentPlayerId;
            return (
              <PlayerListEntry
                key={playerId}
                player={player}
                isCurrentPlayer={isCurrentPlayer}
              />
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
