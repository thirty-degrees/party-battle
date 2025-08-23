export interface PlayerState {
  name: string;
  id?: string; // Optional ID for the session ID
}

export interface GameRoomState {
  players: { [key: string]: PlayerState };
}
