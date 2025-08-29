import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";

import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { NameInputModal } from "@/components/ui/modal/name-input-modal";
import { QrCodeModal } from "@/components/ui/modal/qr-code-modal";
import { ShareIcon } from "@/components/ui/icon";
import Constants from "expo-constants";
import PlayerList from "../components/player-list";
import { useRoomStore } from "@/hooks/useRoomStore";
import { PlayerState, LobbyRoomState } from "@/types/game";

import { Client } from "colyseus.js";
import useStorage from "@/hooks/useStorage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type RoomType = any;

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const { room: globalRoom, setRoom: setGlobalRoom } = useRoomStore();

  const [playerName, setPlayerName, isLoading] = useStorage("playerName");
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const roomRef = useRef<RoomType | null>(null);
  const insets = useSafeAreaInsets();

  const handleStateChange = useCallback((state: LobbyRoomState) => {
    console.log("State changed:", state);
    const playersArray: PlayerState[] = [];

    if (state.players) {
      const playersMap = state.players as any;
      if (playersMap && typeof playersMap.forEach === "function") {
        playersMap.forEach((player: any, key: string) => {
          playersArray.push({
            name: player.name,
            id: key,
            ready: player.ready,
          });

          // Update stored name with the server-assigned name if this is the current player
          if (
            key === roomRef.current?.sessionId &&
            player.name !== playerName
          ) {
            console.log(
              `Updating stored name from "${playerName}" to "${player.name}"`
            );
            setPlayerName(player.name);
          }
        });
      }
    }

    console.log("Players array:", playersArray);
    setPlayers(playersArray);
  }, [playerName, setPlayerName]);

  const handleNameSubmit = (name: string) => {
    setPlayerName(name);
    setShowNamePrompt(false);
  };

  const handleNameCancel = () => {
    router.replace("/");
  };

  useEffect(() => {
    if (!isLoading && !playerName) {
      setShowNamePrompt(true);
    }
  }, [isLoading, playerName]);

  useEffect(() => {
    const joinRoom = async () => {
      if (!playerName || !roomId) return;

      try {
        if (globalRoom) {
          roomRef.current = globalRoom;
          setCurrentPlayerId(playerName);

          globalRoom.onStateChange(handleStateChange);

          globalRoom.onMessage("game_started", async (message: any) => {
            console.log("Game started:", message);
            if (message.gameRoomId) {
              router.push({
                pathname: "/croc-game",
                params: {
                  gameRoomId: message.gameRoomId,
                  playerName: playerName,
                  lobbyRoomId: roomId || "",
                },
              });
            }
          });

          globalRoom.onMessage("return_to_lobby", (_message: any) => {
            console.log("Returning to lobby");
            // Force a state refresh when returning to lobby
            if (globalRoom.state) {
              handleStateChange(globalRoom.state);
            }
          });

          globalRoom.onMessage("player_returned", (message: any) => {
            console.log("Player returned from game:", message);
            // Force a state refresh when a player returns
            if (globalRoom.state) {
              handleStateChange(globalRoom.state);
            }
          });

          // Initial state load
          if (globalRoom.state) {
            handleStateChange(globalRoom.state);
          }

          // Reset ready state when returning to lobby
          globalRoom.send("reset_ready");

          return;
        }

        const client = new Client(Constants.expoConfig?.extra?.backendUrl);

        const roomInstance = await client.joinById<LobbyRoomState>(roomId, {
          name: playerName,
        });

        roomRef.current = roomInstance;
        setGlobalRoom(roomInstance);
        setCurrentPlayerId(playerName);

        roomInstance.onStateChange(handleStateChange);

        roomInstance.onMessage("game_started", async (message: any) => {
          console.log("Game started:", message);
          if (message.gameRoomId) {
            router.push({
              pathname: "/croc-game",
              params: {
                gameRoomId: message.gameRoomId,
                playerName: playerName,
                lobbyRoomId: roomId || "",
              },
            });
          }
        });

        roomInstance.onMessage("return_to_lobby", (_message: any) => {
          console.log("Returning to lobby");
          // Force a state refresh when returning to lobby
          if (roomInstance.state) {
            handleStateChange(roomInstance.state);
          }
        });

        roomInstance.onMessage("player_returned", (message: any) => {
          console.log("Player returned from game:", message);
          // Force a state refresh when a player returns
          if (roomInstance.state) {
            handleStateChange(roomInstance.state);
          }
        });

        // Initial state load
        if (roomInstance.state) {
          handleStateChange(roomInstance.state);
        }

        // Reset ready state when returning to lobby
        roomInstance.send("reset_ready");

        roomInstance.onLeave((_code: number) => {
          setGlobalRoom(null);
          roomRef.current = null;
        });

        roomInstance.onError((code: number, message?: string) => {
          console.error("[Colyseus] Error:", code, message);
          router.replace({
            pathname: "/error",
            params: {
              error: `Room error: ${message}`,
              from: "room",
            },
          });
        });
      } catch (error) {
        console.error("Failed to join room:", error);

        router.replace({
          pathname: "/error",
          params: {
            error: "Failed to join room",
            from: "room",
          },
        });
      }
    };

    if (playerName && roomId) {
      joinRoom();
    }

    return () => {
      if (roomRef.current) {
        // Remove all listeners before leaving
        roomRef.current.removeAllListeners();
        roomRef.current.leave();
      }
    };
  }, [playerName, roomId, globalRoom, handleStateChange, setGlobalRoom]);

  const startGame = () => {
    console.log("Sending ready...");
    if (roomRef.current) {
      roomRef.current.send("ready");
    }
  };

  const getRoomUrl = () => {
    if (typeof window !== "undefined") {
      const baseUrl = window.location.origin;
      return `${baseUrl}/room?roomId=${roomId}`;
    }
    return `https://your-app-domain.com/room?roomId=${roomId}`;
  };

  const renderCurrentScreen = () => {
    return (
      <PlayerList
        players={players}
        currentPlayerId={currentPlayerId}
        onGameStart={startGame}
      />
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-black">
      <Box style={{ height: insets.top }}></Box>
      {/* Top Bar */}
      <View className="bg-white dark:bg-black border-b border-gray-400 dark:border-gray-600 px-4 py-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-black dark:text-white">
          {playerName}
        </Text>
        {globalRoom && (
          <Button
            size="sm"
            action="secondary"
            onPress={() => setShowQrCode(true)}
          >
            <ButtonIcon as={ShareIcon} />
            <ButtonText>Invite Players</ButtonText>
          </Button>
        )}
      </View>

      <View className="flex-1 p-1">
        <Card className="flex-1 m-1 bg-white dark:bg-black border-gray-400 dark:border-gray-600">
          {renderCurrentScreen()}
        </Card>
      </View>

      <NameInputModal
        isOpen={showNamePrompt}
        onClose={handleNameCancel}
        onSubmit={handleNameSubmit}
      />

      <QrCodeModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        roomId={roomId || ""}
        roomUrl={getRoomUrl()}
      />
    </View>
  );
}
