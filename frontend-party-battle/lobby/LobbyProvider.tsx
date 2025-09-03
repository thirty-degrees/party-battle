import { Client, Room } from 'colyseus.js';
import Constants from 'expo-constants';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Lobby } from 'types-party-battle';

export type LobbyContextType = {
  room?: Room<Lobby>;
  isLoading: boolean;
  joinLobby: (roomId: string, playerName: string) => Promise<void>;
  createLobby: (playerName: string) => Promise<void>;
  leaveLobby: () => void;
};

const LobbyContext = createContext<LobbyContextType | undefined>(undefined);

export const useLobbyContext = () => {
  const context = useContext(LobbyContext);
  if (!context) {
    throw new Error('useLobbyContext must be used within a LobbyProvider');
  }
  return context;
};

export const LobbyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [room, setRoom] = useState<Room<Lobby> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const joinLobby = useCallback(async (roomId: string, playerName: string) => {
    try {
      setIsLoading(true);
      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const joinedRoom = await client.joinById<Lobby>(roomId, {
        name: playerName,
      });
      setRoom(joinedRoom);
    } catch (error) {
      console.error('Failed to join lobby:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLobby = useCallback(async (playerName: string) => {
    try {
      setIsLoading(true);
      const client = new Client(Constants.expoConfig?.extra?.backendUrl);
      const createdRoom = await client.create<Lobby>('lobby_room', {
        name: playerName,
      });
      setRoom(createdRoom);
    } catch (error) {
      console.error('Failed to create lobby:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const leaveLobby = useCallback(() => {
    if (room) {
      room.leave();
      setRoom(undefined);
    }
  }, [room]);

  const value: LobbyContextType = {
    room,
    isLoading,
    joinLobby,
    createLobby,
    leaveLobby,
  };

  return (
    <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
  );
};
