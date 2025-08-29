import { LobbyRoomState } from "@/games/game";
import { Room } from "colyseus.js";
import { createContext, useContext } from "react";

export type LobbyContextType = {
  room?: Room<LobbyRoomState>;
};

const LobbyContext = createContext<LobbyContextType>({
  room: undefined,
});

export default LobbyContext;

export function useLobbyContext() {
  return useContext(LobbyContext);
}