import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Platform, Text, View } from "react-native";

import { Heading } from "@/components/ui/heading";
import Constants from "expo-constants";
import LobbyScreen from "./lobby";
import { useRoomStore } from "@/hooks/useRoomStore";

const { Client, Room } = require("colyseus.js");

type RoomType = any;

type RoomScreen = "lobby" | "game";

export default function RoomScreen() {
  const { roomId } = useLocalSearchParams<{ roomId?: string }>();
  const { room: globalRoom, setRoom: setGlobalRoom } = useRoomStore();
  const [currentScreen, setCurrentScreen] = useState<RoomScreen>("lobby");
  const [playerName, setPlayerName] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<number>(0);
  const roomRef = useRef<RoomType | null>(null);

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
        // If we already have a room from the global store, use it
        if (globalRoom) {
          roomRef.current = globalRoom;

          // Set up the state change listener
          globalRoom.onStateChange((state: any) => {
            const count = state.players?.$items?.size || 0;
            setPlayerCount(count);
          });

          return;
        }

        // Otherwise, join the room
        const client = new Client(Constants.expoConfig?.extra?.backendUrl);

        const roomInstance = await client.joinById(roomId, {
          name: playerName,
        });

        roomRef.current = roomInstance;
        setGlobalRoom(roomInstance);

        roomInstance.onStateChange((state: any) => {
          const count = state.players?.$items?.size || 0;
          setPlayerCount(count);
        });

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

  const switchScreen = (screen: RoomScreen) => {
    setCurrentScreen(screen);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "lobby":
        return <LobbyScreen />;
      case "game":
        return (
          <View className="flex-1 bg-blue-900 justify-center items-center">
            <Heading size="xl" className="text-2xl font-bold text-white">
              Game Screen
            </Heading>
            <Text className="text-gray-300 mt-2">
              Game content will go here
            </Text>
          </View>
        );
      default:
        return <LobbyScreen />;
    }
  };

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 justify-center items-center">
        <Heading size="xl" className="text-2xl font-bold text-white">
          Party Battle
        </Heading>
        <Text className="text-gray-400 mt-2">Player: {playerName}</Text>
        {globalRoom && (
          <Text className="text-gray-400 mt-1">
            Room ID: {globalRoom.roomId}
          </Text>
        )}
        <Text className="text-gray-400 mt-1">Players Count: {playerCount}</Text>
      </View>

      {renderCurrentScreen()}
    </View>
  );
}
