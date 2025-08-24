import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

import { Heading } from "@/components/ui/heading";
import { Card } from "@/components/ui/card";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import Constants from "expo-constants";
import LobbyScreen from "./lobby";
import { useRoomStore } from "@/hooks/useRoomStore";
import { PlayerState, LobbyRoomState } from "@/types/game";

const { Client, Room } = require("colyseus.js");

type RoomType = any;

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const { room: globalRoom, setRoom: setGlobalRoom } = useRoomStore();

  const [playerName, setPlayerName] = useState<string>("");
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>("");

  const roomRef = useRef<RoomType | null>(null);

  const handleStateChange = (state: LobbyRoomState) => {
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

          // Update local storage with the server-assigned name if this is the current player
          if (
            key === roomRef.current?.sessionId &&
            player.name !== playerName
          ) {
            console.log(
              `Updating stored name from "${playerName}" to "${player.name}"`
            );
            localStorage.setItem("playerName", player.name);
            setPlayerName(player.name);
          }
        });
      }
    }

    console.log("Players array:", playersArray);
    setPlayers(playersArray);
  };

  const showWebNamePrompt = () => {
    console.log("Using web prompt");
    const name = prompt("Please enter your name to join the room");
    console.log("Prompt result:", name);

    if (name && name.trim()) {
      localStorage.setItem("playerName", name.trim());
      setPlayerName(name.trim());
    } else {
      router.replace("/");
    }
  };

  const showMobileNameAlert = () => {
    console.log("Using mobile Alert.prompt");
    Alert.prompt(
      "Enter Your Name",
      "Please enter your name to join the room",
      [
        {
          text: "Cancel",
          onPress: () => router.replace("/"),
          style: "cancel",
        },
        {
          text: "Join",
          onPress: (name) => {
            console.log("Alert.prompt result:", name);
            if (name && name.trim()) {
              localStorage.setItem("playerName", name.trim());
              setPlayerName(name.trim());
            } else {
              router.replace("/");
            }
          },
        },
      ],
      "plain-text",
      "",
      "default"
    );
  };

  useEffect(() => {
    const storedPlayerName = localStorage.getItem("playerName");

    if (!storedPlayerName) {
      if (Platform.OS === "web") {
        showWebNamePrompt();
      } else {
        showMobileNameAlert();
      }
    } else {
      console.log("Found stored player name:", storedPlayerName);
      setPlayerName(storedPlayerName);
    }
  }, []);

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

          globalRoom.onMessage("return_to_lobby", (message: any) => {
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

        const roomInstance = await client.joinById(roomId, {
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

        roomInstance.onMessage("return_to_lobby", (message: any) => {
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

        roomInstance.onLeave((code: number) => {
          setGlobalRoom(null);
          roomRef.current = null;
        });

        roomInstance.onError((code: number, message: string) => {
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
  }, [playerName, roomId]);

  const startGame = () => {
    console.log("Sending ready...");
    if (roomRef.current) {
      roomRef.current.send("ready");
    }
  };

  const requestGameRoom = () => {
    console.log("Requesting game room creation...");
    if (roomRef.current) {
      roomRef.current.send("create_game_room");
    }
  };

  const renderCurrentScreen = () => {
    return (
      <LobbyScreen
        players={players}
        currentPlayerId={currentPlayerId}
        onGameStart={startGame}
      />
    );
  };

  return (
    <View className="flex-1 bg-black">
      {/* Top Bar */}
      <View className="bg-black border-b border-gray-600 px-4 py-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-white">{playerName}</Text>
        {globalRoom && (
          <Badge variant="outline" action="muted" size="sm">
            <BadgeText>{globalRoom.roomId}</BadgeText>
          </Badge>
        )}
      </View>

      {/* Main Content */}
      <View className="flex-1 p-1">
        <Card className="flex-1 m-1 bg-black border-gray-600">
          {renderCurrentScreen()}
        </Card>
      </View>
    </View>
  );
}
