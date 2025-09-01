import { View, Text } from "react-native";
import { LobbyPlayer } from "types-party-battle";

interface PlayerListEntryProps {
  player?: LobbyPlayer;
  isCurrentPlayer: boolean;
}

export default function PlayerListEntry({ player, isCurrentPlayer }: PlayerListEntryProps) {
  const containerStyles = isCurrentPlayer
    ? "rounded-lg p-3 mb-2 flex-row items-center border bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600"
    : "rounded-lg p-3 mb-2 flex-row items-center border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700";

  const textStyles = isCurrentPlayer
    ? "font-medium text-blue-800 dark:text-blue-200"
    : "font-medium text-black dark:text-white";

  return (
    <View className={containerStyles}>
      <Text className={textStyles}>
        {player?.name}
      </Text>
      {player?.ready && (
        <View className="ml-auto bg-green-400 dark:bg-green-600 px-2 py-1 rounded-full">
          <Text className="text-xs text-black dark:text-white font-medium">
            ✓
          </Text>
        </View>
      )}
    </View>
  );
}
