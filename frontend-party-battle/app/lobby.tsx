import React, { useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useLobbyContext } from "@/lobby/LobbyProvider";
import { Lobby, GameType } from "types-party-battle";
import { useRouter } from "expo-router";
import PlayerList from "@/lobby/player-list";

export default function LobbyScreen() {
  const { room } = useLobbyContext();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  room?.onStateChange((state: Lobby) => {
    if (state.currentGame) {
      redirectGame(state.currentGame, room.roomId);
    }
  });

  const redirectGame = (gameType: GameType, roomId: string) => {
    console.log("redirectGame() - gameType:", gameType, "roomId:", roomId);

    switch (gameType) {
      case "croc":
        router.push(`/games/croc-game?roomId=${roomId}`);
        break;
      case "snake":
        console.log("Snake game redirection not implemented yet");
        break;
      default:
        console.log("Unknown game type:", gameType);
        break;
    }
  };

  const onReady = () => {
    if (!room) return;

    try {
      room.send("ready");
      setIsReady(true);
      console.log("Ready status sent to server");
    } catch (error) {
      console.error("Failed to send ready status:", error);
    }
  };

  return (
    <View className="flex-1 justify-center gap-4 items-center p-4 bg-background-0 dark:bg-background-950">
      <Text className="text-lg font-semibold">Lobby screen</Text>

      <PlayerList
        players={room?.state?.players}
        currentPlayerId={room?.sessionId}
        onGameStart={onReady}
      />

      <View className="items-center gap-2">
        <Text className="text-sm text-typography-500 dark:text-typography-400">
          Ready Status: {isReady ? "Ready" : "Not Ready"}
        </Text>

        <Button
          action={isReady ? "positive" : "secondary"}
          onPress={onReady}
          disabled={isReady}
        >
          <ButtonText>{isReady ? "Ready" : "Set Ready"}</ButtonText>
        </Button>
      </View>
    </View>
  );
}
