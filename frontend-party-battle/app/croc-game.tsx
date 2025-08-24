import React, { useEffect, useState, useRef } from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Client } from "colyseus.js";
import { CrocMiniGameRoomState } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Constants from "expo-constants";

type RoomType = any;

export default function CrocGamePage() {
  const router = useRouter();
  const { gameRoomId, playerName, lobbyRoomId } = useLocalSearchParams<{
    gameRoomId: string;
    playerName: string;
    lobbyRoomId: string;
  }>();

  const [gameRoom, setGameRoom] = useState<RoomType | null>(null);
  const [gameRoomState, setGameRoomState] =
    useState<CrocMiniGameRoomState | null>(null);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const roomRef = useRef<RoomType | null>(null);

  useEffect(() => {
    if (!gameRoomId || !playerName || !lobbyRoomId) {
      console.error("Missing gameRoomId, playerName, or lobbyRoomId");
      router.replace("/");
      return;
    }

    const joinGameRoom = async () => {
      try {
        setIsConnecting(true);
        const client = new Client(Constants.expoConfig?.extra?.backendUrl);

        console.log("Joining croc game room by ID:", gameRoomId);
        const gameRoomInstance = await client.joinById(gameRoomId, {
          name: playerName,
        });

        setGameRoom(gameRoomInstance);
        roomRef.current = gameRoomInstance;
        console.log("Joined croc game room:", gameRoomInstance.roomId);

        gameRoomInstance.onStateChange((state: any) => {
          console.log("Croc game state changed:", state);
          setGameRoomState(state as CrocMiniGameRoomState);
        });

        gameRoomInstance.onMessage("player_joined", (message: any) => {
          console.log("Player joined croc game:", message);
        });

        gameRoomInstance.onMessage("player_left", (message: any) => {
          console.log("Player left croc game:", message);
        });

        gameRoomInstance.onMessage("game_started", (message: any) => {
          console.log("Croc game started:", message);
          setGameStarted(true);
        });

        gameRoomInstance.onMessage("game_ended", (message: any) => {
          console.log("Croc game ended:", message);
        });

        gameRoomInstance.onMessage("score_update", (message: any) => {
          console.log("Score update:", message);
        });

        gameRoomInstance.onMessage("player_ready", (message: any) => {
          console.log("Player ready in croc game:", message);
        });

        gameRoomInstance.onLeave((code: number) => {
          console.log("Left croc game room, code:", code);
          setGameRoom(null);
          roomRef.current = null;

          // Notify the lobby that we're returning
          if (lobbyRoomId) {
            const lobbyClient = new Client(
              Constants.expoConfig?.extra?.backendUrl
            );
            lobbyClient
              .joinById(lobbyRoomId, { name: playerName })
              .then((lobbyRoom) => {
                lobbyRoom.send("return_from_game");
                lobbyRoom.leave();
              })
              .catch((error) => {
                console.error("Failed to notify lobby of return:", error);
              });
          }

          router.replace(`/room?roomId=${lobbyRoomId}`);
        });

        gameRoomInstance.onError((code: number, message?: string) => {
          console.error("[Croc Game] Error:", code, message);
          setGameRoom(null);
          roomRef.current = null;
          router.replace(`/room?roomId=${lobbyRoomId}`);
        });

        // Automatically send ready message when joining
        console.log("Sending player_ready");
        gameRoomInstance.send("player_ready");

        setIsConnecting(false);
      } catch (error) {
        console.error("Failed to join croc game room:", error);
        setIsConnecting(false);
        router.replace(`/room?roomId=${lobbyRoomId}`);
      }
    };

    joinGameRoom();

    return () => {
      if (roomRef.current) {
        roomRef.current.leave();
      }
    };
  }, [gameRoomId, playerName, router]);

  const handleLeaveRoom = () => {
    if (roomRef.current) {
      console.log("Leaving croc game room");

      // Notify the lobby that we're returning
      if (lobbyRoomId) {
        const lobbyClient = new Client(Constants.expoConfig?.extra?.backendUrl);
        lobbyClient
          .joinById(lobbyRoomId, { name: playerName })
          .then((lobbyRoom) => {
            lobbyRoom.send("return_from_game");
            lobbyRoom.leave();
          })
          .catch((error) => {
            console.error("Failed to notify lobby of return:", error);
          });
      }

      roomRef.current.leave();
    }
  };

  if (isConnecting) {
    return (
      <View className="flex-1 bg-white dark:bg-black justify-center items-center">
        <Spinner size="large" color="#3B82F6" />
        <Text className="text-gray-600 dark:text-gray-400 mt-4 text-center">
          Connecting to game...
        </Text>
      </View>
    );
  }

  if (!gameRoom) {
    return (
      <View className="flex-1 bg-white dark:bg-black justify-center items-center">
        <Text className="text-black dark:text-white text-xl mb-4">
          Failed to connect to game
        </Text>
        <Button
          onPress={() => router.replace(`/room?roomId=${lobbyRoomId}`)}
          className="bg-blue-500 dark:bg-blue-500"
        >
          <Text className="text-white dark:text-white">Return to Lobby</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-black justify-center items-center space-y-6">
      <Text className="text-black dark:text-white text-2xl font-bold">Croc Mini Game</Text>

      <Text className="text-black dark:text-white text-xl">
        Game started: {gameStarted.toString()}
      </Text>

      {gameRoomState && (
        <View className="items-center space-y-2">
          <Text className="text-black dark:text-white text-lg">
            Players: {Object.keys(gameRoomState.players || {}).length}
          </Text>
          <Text className="text-black dark:text-white text-lg">
            Game State: {gameRoomState.gameState}
          </Text>
          <Text className="text-black dark:text-white text-lg">
            Hot Tooth Index: {gameRoomState.hotThootIndex}
          </Text>
        </View>
      )}

      <View className="space-y-4">
        <Button onPress={handleLeaveRoom} className="bg-red-500 dark:bg-red-500">
          <Text className="text-white dark:text-white">Leave Game</Text>
        </Button>
      </View>
    </View>
  );
}
