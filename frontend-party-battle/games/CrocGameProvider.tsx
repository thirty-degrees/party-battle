import { Client, Room } from "colyseus.js";
import React, { createContext, useContext, useState, useCallback } from "react";
import Constants from "expo-constants";
import { CrocGame } from "types-party-battle";
import { usePlayerName } from "@/index/PlayerNameProvider";

export type CrocGameContextType = {
  state?: CrocGame;
  isLoading: boolean;
  joinCrocGame: (roomId: string) => Promise<void>;
  leaveCrocGame: () => void;
};

const CrocGameContext = createContext<CrocGameContextType | undefined>(
  undefined
);

export const useCrocGameContext = () => {
  const context = useContext(CrocGameContext);
  if (!context) {
    throw new Error(
      "useCrocGameContext must be used within a CrocGameProvider"
    );
  }
  return context;
};

export const CrocGameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room<CrocGame> | undefined>(undefined);
  const [state, setState] = useState<CrocGame | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { playerName } = usePlayerName();

  const joinCrocGame = useCallback(
    async (roomId: string) => {
      if (!playerName) {
        console.error("Player name not available");
        return;
      }

      try {
        setIsLoading(true);
        const client = new Client(Constants.expoConfig?.extra?.backendUrl);
        const joinedRoom = await client.joinById<CrocGame>(roomId, {
          name: playerName,
        });
        console.log("Joined croc game room:", joinedRoom.roomId);
        console.log("Initial state:", joinedRoom.state);
        console.log("Initial gameState:", joinedRoom.state.gameState);
        console.log("Initial gameType:", joinedRoom.state.gameType);

        joinedRoom.onStateChange((state) => {
          setState(state);
        });

        setRoom(joinedRoom);
      } catch (error) {
        console.error("Failed to join croc game:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [playerName]
  );

  const leaveCrocGame = useCallback(() => {
    if (room) {
      room.leave();
      setRoom(undefined);
    }
  }, [room]);

  const value: CrocGameContextType = {
    state,
    isLoading,
    joinCrocGame,
    leaveCrocGame,
  };

  return (
    <CrocGameContext.Provider value={value}>
      {children}
    </CrocGameContext.Provider>
  );
};
