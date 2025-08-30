import { Room } from "colyseus.js";
import { CrocGame } from "types-party-battle";
import { View, Text } from "react-native";
import useColyseusState from "@/colyseus/useColyseusState";

type CrocGameProps = {
  room: Room<CrocGame>;
}


export default function CrocGameView({ room }: CrocGameProps) {
  const gameState = useColyseusState(room!, state => state.gameState);

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">
        Croc Mini Game
      </Text>
      <Text className="text-black dark:text-white text-lg">
        Room State: {JSON.stringify(gameState)}
      </Text>
    </View>
  );
}