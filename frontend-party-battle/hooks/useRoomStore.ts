import { LobbyRoomState } from "@/types/game";
import { Room } from "colyseus.js";
import { useState, useCallback, useEffect } from "react";

let globalRoom: Room<LobbyRoomState> | null = null;
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function useRoomStore() {
  const [room, setRoomState] = useState<Room<LobbyRoomState> | null>(globalRoom);

  const setRoom = useCallback((newRoom: Room<LobbyRoomState> | null) => {
    globalRoom = newRoom;
    setRoomState(newRoom);
    notifyListeners();
  }, []);

  // Subscribe to global changes
  useEffect(() => {
    const listener = () => {
      setRoomState(globalRoom);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return {
    room,
    setRoom,
  };
}
