import { View, Text, ScrollView } from "react-native";

import { LobbyPlayer, MAX_AMOUNT_OF_PLAYERS } from "types-party-battle";
import PlayerListEntry from "./PlayerListEntry";

interface LobbyScreenProps {
  players: [string, LobbyPlayer][];
  currentPlayerId?: string;
  onGameStart?: () => void;
}

export default function PlayerList({
  players,
  currentPlayerId,
}: LobbyScreenProps) {
  return (
    <View className="flex-1 justify-between pt-8">
      <View className="w-full max-w-md">
        <Text className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Players ({players.length} / {MAX_AMOUNT_OF_PLAYERS})
        </Text>

        <View className="gap-2">
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
          {Array.from({ length: MAX_AMOUNT_OF_PLAYERS - players.length }, (_, index) => {
            return (
              <PlayerListEntry
                key={`placeholder-${index}`}
                isCurrentPlayer={false}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
}
