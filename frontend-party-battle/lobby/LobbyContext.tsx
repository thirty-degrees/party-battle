import { Room } from "colyseus.js";
import { createContext, useContext } from "react";
import { Lobby } from "types-party-battle";

export type LobbyContextType = {
  room?: Room<Lobby>;
};

const LobbyContext = createContext<LobbyContextType>({
  room: undefined,
});

export default LobbyContext;

export function useLobbyContext() {
  return useContext(LobbyContext);
}
