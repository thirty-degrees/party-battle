export type MiniGameTypes = "croc" | null;
export interface PlayerState {
  name: string;
  id?: string;
  ready?: boolean;
}

export interface LobbyPlayerState {
  name: string;
  id: string;
  ready: boolean;
}

export interface GameHistory {
  gameType: string;
  timestamp: number;
  duration: number;
  playerScores: { [key: string]: number };
}

export interface CrocPlayerState {
  name: string;
  id: string;
}

export interface CrocMiniGameRoomState {
  players: { [key: string]: CrocPlayerState };
  gameState: "waiting" | "playing" | "finished";
  hotThootIndex: number;
}
