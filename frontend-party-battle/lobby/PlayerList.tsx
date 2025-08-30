import { View, Text, ScrollView } from "react-native";

import { LobbyPlayer, MAX_AMOUNT_OF_PLAYERS } from "types-party-battle";
import PlayerListEntry from "./PlayerListEntry";

interface LobbyScreenProps {
  players: [string, LobbyPlayer][];
  playersCount: number;
  currentPlayerId?: string;
  onGameStart?: () => void;
}

export default function PlayerList({
  players,
  playersCount,
  currentPlayerId,
}: LobbyScreenProps) {

  console.log("playersCount:");
  console.log(playersCount);
  return (
    <View className="flex-1 justify-between p-4 pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Players ({players.length} / {MAX_AMOUNT_OF_PLAYERS})
        </Text>

        <ScrollView className="max-h-64">
          {players.map(([playerId, player]) => {
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
