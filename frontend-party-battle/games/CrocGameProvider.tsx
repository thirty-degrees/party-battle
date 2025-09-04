import { usePlayerName } from '@/index/PlayerNameProvider';
import { Client, Room } from 'colyseus.js';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CrocGame } from 'types-party-battle';

export type CrocGameContextType = {
  room?: Room<CrocGame>;
  isLoading: boolean;
  joinCrocGame: (roomId: string) => void;
  leaveCrocGame: () => void;
};

const CrocGameContext = createContext<CrocGameContextType | undefined>(
  undefined
);

export const useCrocGameContext = () => {
  const context = useContext(CrocGameContext);
  if (!context) {
    throw new Error(
      'useCrocGameContext must be used within a CrocGameProvider'
    );
  }
  return context;
};

export const CrocGameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room<CrocGame> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const { playerName } = usePlayerName();

  const joinCrocGame = useCallback(
    (roomId: string) => {
      setIsLoading(true);
      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      client
        .joinById<CrocGame>(roomId, {
          name: playerName,
        })
        .then((joinedRoom) => {
          joinedRoom.onStateChange((state) => {
            if (state.gameState === 'finished') {
              router.replace('/lobby');
            }
          });

          setRoom(joinedRoom);
          setIsLoading(false);
        });
    },
    [playerName]
  );

  const leaveCrocGame = useCallback(() => {
    if (room) {
      room.leave();
      setRoom(undefined);
    }
  }, [room]);

  const value = useMemo(
    () => ({
      room,
      isLoading,
      joinCrocGame,
      leaveCrocGame,
    }),
    [room, isLoading, joinCrocGame, leaveCrocGame]
  );

  return (
    <CrocGameContext.Provider value={value}>
      {children}
    </CrocGameContext.Provider>
  );
};
