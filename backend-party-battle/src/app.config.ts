import config from "@colyseus/tools";

/**
 * Import your Room files
 */
import { GameType } from "types-party-battle";
import { CrocGameRoom } from "./rooms/CrocGameRoom";
import { LobbyRoom } from "./rooms/LobbyRoom";
import { SnakeGameRoom } from "./rooms/SnakeGameRoom";

export enum RoomName {
  LOBBY_ROOM = "lobby_room",
  CROC_GAME_ROOM = "croc_game_room",
  SNAKE_GAME_ROOM = "snake_game_room",
}

export const gameTypeToRoomNameMap: Record<GameType, RoomName> = {
  croc: RoomName.CROC_GAME_ROOM,
  snake: RoomName.SNAKE_GAME_ROOM,
};

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(RoomName.LOBBY_ROOM, LobbyRoom);
    gameServer.define(RoomName.CROC_GAME_ROOM, CrocGameRoom);
    gameServer.define(RoomName.SNAKE_GAME_ROOM, SnakeGameRoom);
  },

  initializeExpress: (_app) => {
    /**
     * Bind your custom express routes here:
     * Read more: https://expressjs.com/en/starter/basic-routing.html
     */
    /*
    app.get("/hello_world", (req, res) => {
      res.send("It's time to kick ass and chew bubblegum!");
    });
    */

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    /*
    if (process.env.NODE_ENV !== "production") {
      app.use("/", playground());
    }
    */

    /**
     * Use @colyseus/monitor
     * It is recommended to protect this route with a password
     * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
     */
    // app.use("/monitor", monitor());
  },

  beforeListen: () => {
    /**
     * Before before gameServer.listen() is called.
     */
  },
});
