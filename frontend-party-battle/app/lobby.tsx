import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useLobbyContext } from "@/lobby/LobbyProvider";
import { useRouter } from "expo-router";
import PlayerList from "@/lobby/PlayerList";
import SafeAreaPlaceholder from "@/components/SafeAreaPlaceholder";
import useColyseusState from "@/colyseus/useColyseusState";

export default function LobbyScreen() {
  const { room } = useLobbyContext();
  const players = useColyseusState(room!, state => Array.from(state.players?.entries() || []));
  const currentGame = useColyseusState(room!, state => state.currentGame);
  const currentGameRoomId = useColyseusState(room!, state => state.currentGameRoomId);

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      switch (currentGame) {
        case "croc":
          router.push(`/games/croc-game?roomId=${currentGameRoomId}`);
          break;
        case "snake":
          throw new Error("Snake game redirection not implemented yet");
        default:
          throw new Error(`Unknown game type: ${currentGameRoomId}`);
      }
    }
  }, [currentGame, currentGameRoomId, router]);

  const onReady = () => {
    try {
      room!.send("ready");
      setIsReady(true);
    } catch (error) {
      console.error("Failed to send ready status:", error);
    }
  };

  const backgroundColorClasses = "bg-background-0 dark:bg-background-950";

  return (
    <View className="flex-1">
      <SafeAreaPlaceholder position="top" className={backgroundColorClasses} />
      <View className={`flex-1 justify-between gap-2 p-4 ${backgroundColorClasses}`}>
        <View className="flex-row">

          <Text className="text-lg font-semibold">Lobby</Text>
        </View>

        <View className="flex-row flex-1">
          <PlayerList
            players={players}
            currentPlayerId={room?.sessionId}
            onGameStart={onReady}
          />
        </View>

        <View className="iflex-row">
          <Button
            action={isReady ? "positive" : "secondary"}
            onPress={onReady}
            disabled={isReady}
          >
            <ButtonText>{isReady ? "Ready" : "Set Ready"}</ButtonText>
          </Button>
        </View>
      </View>
      <SafeAreaPlaceholder position="bottom" className={backgroundColorClasses} />
    </View>
  );
}
