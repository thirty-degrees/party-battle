import React, { useState, useCallback, useEffect } from "react";

type RoomType = any;

let globalRoom: RoomType | null = null;
let listeners: Array<() => void> = [];

const notifyListeners = () => {
  listeners.forEach((listener) => listener());
};

export function useRoomStore() {
  const [room, setRoomState] = useState<RoomType | null>(globalRoom);

  const setRoom = useCallback((newRoom: RoomType | null) => {
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
