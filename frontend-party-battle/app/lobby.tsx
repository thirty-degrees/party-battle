import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useLobbyContext } from "@/lobby/LobbyProvider";
import { Lobby, GameType, LobbyPlayer } from "types-party-battle";
import { useRouter } from "expo-router";
import PlayerList from "@/lobby/PlayerList";
import SafeAreaPlaceholder from "@/components/SafeAreaPlaceholder";
import useColyseusState from "@/colyseus/useColyseusState";

export default function LobbyScreen() {
  const { room } = useLobbyContext();
  const selector = (s: Lobby): [string, LobbyPlayer][] => Array.from(s.players?.entries() || []);
  const players = useColyseusState(room!, selector);
  const playersCount = players.length;
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  console.log(`players (${playersCount}):`);
  console.log(players);

  useEffect(() => {
    const redirectGame = (gameType: GameType, roomId: string) => {
      switch (gameType) {
        case "croc":
          router.push(`/games/croc-game?roomId=${roomId}`);
          break;
        case "snake":
          throw new Error("Snake game redirection not implemented yet");
        default:
          throw new Error(`Unknown game type: ${gameType}`);
      }
    };

    const roomOnStateChange = room?.onStateChange((state: Lobby) => {
      if (state.currentGame && state.currentGameRoomId) {
        redirectGame(state.currentGame, state.currentGameRoomId);
      }
    });

    return () => {
      if (roomOnStateChange) {
        roomOnStateChange.clear();
      }
    };
  }, [room, router]);

  const onReady = () => {
    if (!room) return;

    try {
      room.send("ready");
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
            playersCount={playersCount}
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
