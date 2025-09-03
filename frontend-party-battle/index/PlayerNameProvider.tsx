import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from './storage';

type PlayerNameContextType = {
  playerName: string;
  setPlayerName: (name: string) => void;
  isLoading: boolean;
};

const PlayerNameContext = createContext<PlayerNameContextType | undefined>(
  undefined
);

export const usePlayerName = () => {
  const context = useContext(PlayerNameContext);
  if (!context) {
    throw new Error('usePlayerName must be used within a PlayerNameProvider');
  }
  return context;
};

export const PlayerNameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [playerName, setPlayerNameState] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    storage.getItem('playerName').then((v) => {
      if (!active) return;
      if (v !== null) setPlayerNameState(v);
      setIsLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoading && playerName && playerName.trim() !== '') {
      storage.setItem('playerName', playerName);
    }
  }, [playerName, isLoading]);

  const setPlayerName = (name: string) => {
    setPlayerNameState(name);
  };

  const value: PlayerNameContextType = {
    playerName,
    setPlayerName,
    isLoading,
  };

  return (
    <PlayerNameContext.Provider value={value}>
      {children}
    </PlayerNameContext.Provider>
  );
};
