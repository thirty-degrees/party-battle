import { useEffect, useState } from "react";
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { useRouter } from "expo-router";
import PlayerList from "@/lobby/PlayerList";
import SafeAreaPlaceholder from "@/components/SafeAreaPlaceholder";
import useColyseusState from "@/colyseus/useColyseusState";
import { Room } from "colyseus.js";
import { Lobby, GameType, KeyValuePair } from "types-party-battle";

export interface PlayerData {
  name: string;
  ready: boolean;
}

export interface GameHistoryData {
  gameType: GameType;
  scores: KeyValuePair<number>[];
}

interface LobbyContentProps {
  room: Room<Lobby>;
}

export default function LobbyContent({ room }: LobbyContentProps) {
  const players = useColyseusState(room, state =>
    Array.from(state.players?.entries() || []).map(([id, player]) => [
      id,
      { name: player.name, ready: player.ready }
    ] as [string, PlayerData])
  );
  const gameHistory = useColyseusState(room, state =>
    Array.from(state.gameHistory?.entries() || []).map(([id, game]) => [
      id,
      { gameType: game.gameType, scores: game.scores }
    ] as [string | number, GameHistoryData])
  );
  const currentGame = useColyseusState(room, state => state.currentGame);
  const currentGameRoomId = useColyseusState(room, state => state.currentGameRoomId);

  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (currentGame && currentGameRoomId) {
      switch (currentGame) {
        case "croc":
          router.push(`/games/croc?roomId=${currentGameRoomId}`);
          break;
        case "snake":
          throw new Error("Snake game redirection not implemented yet");
        default:
          throw new Error(`Unknown game type: ${currentGameRoomId}`);
      }
    }
  }, [currentGame, currentGameRoomId, router]);

  const onToggleReady = () => {
    room.send("ready", !isReady);
    setIsReady(prev => !prev);
  };


  return (
    <View className="flex-1 bg-background-0 dark:bg-background-950">
      <SafeAreaPlaceholder position="top" />
      <View className="flex-1 p-4 justify-center items-center">
        <View className="flex-1 max-w-md w-full justify-around items-center">
          <View className="flex-row items-center justify-end w-full">
            <Text className="text-2xl font-semibold">Lobby</Text>
          </View>

          <View className="flex-row w-full">
            <PlayerList
              players={players}
              gameHistory={gameHistory}
              currentPlayerId={room.sessionId}
            />
          </View>

          <View className="flex-row w-full justify-center">
            <Button
              size="xl"
              action={"primary"}
              onPress={onToggleReady}
            >
              <ButtonText>{isReady ? "CANCEL" : "PLAY"}</ButtonText>
            </Button>
          </View>
        </View>
      </View>
      <SafeAreaPlaceholder position="bottom" />
    </View>
  );
}
