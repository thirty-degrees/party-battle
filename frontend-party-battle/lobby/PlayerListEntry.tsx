import { CheckIcon, CloseIcon, Icon } from "@/components/ui/icon";
import { View, Text } from "react-native";
import { LobbyPlayer } from "types-party-battle";

interface PlayerListEntryProps {
  player?: LobbyPlayer;
  isCurrentPlayer: boolean;
  place?: number;
  totalScore?: number;
  lastRoundScore?: number;
}

export default function PlayerListEntry({
  player,
  isCurrentPlayer,
  place,
  totalScore,
  lastRoundScore
}: PlayerListEntryProps) {
  const containerStyles = (isCurrentPlayer
    ? "rounded-lg p-3 mb-2 flex-row items-center border bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-600"
    : "rounded-lg p-3 mb-2 flex-row items-center border bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700") +
    (!player ? " border-dashed" : "");

  const textStyles = isCurrentPlayer
    ? "font-medium text-blue-800 dark:text-blue-200"
    : "font-medium text-black dark:text-white";

  return (
    <View className={containerStyles}>
      <View className="flex-[1]">
        <Text className={textStyles}>
          {player ? `${place}.` : "..."}
        </Text>
      </View>

      <View className="flex-[3]">
        <Text className={textStyles}>
          {player?.name ?? "..."}
        </Text>
      </View>

      <View className="flex-[2] items-center">
        <Text className={`${textStyles} text-center`}>
          {player && lastRoundScore !== undefined
            ? `${lastRoundScore >= 0 ? '+' : ''}${lastRoundScore}`
            : "..."
          }
        </Text>
      </View>

      <View className="flex-[2] items-center">
        <Text className={`${textStyles} text-center`}>
          {player && totalScore !== undefined ? totalScore : "..."}
        </Text>
      </View>

      <View className="flex-[1] items-center">
        {player ? (
          player.ready ? (
            <Text className={`${textStyles} text-center`}>
              <Icon as={CheckIcon} className="text-green-600 dark:text-green-100" />
            </Text>
          ) : (
            <Text className={`${textStyles} text-center`}>
              <Icon as={CloseIcon} className="text-red-600 dark:text-red-400" />
            </Text>
          )
        ) : (
          <Text className={`${textStyles} text-center`}>
            ...
          </Text>
        )}
      </View>
    </View>
  );
}
