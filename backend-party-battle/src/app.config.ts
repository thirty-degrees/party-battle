import config from '@colyseus/tools'

import { Type } from '@colyseus/core/build/utils/types'
import { Encoder } from '@colyseus/schema'
import { Room } from 'colyseus'
import { GameSchema, GameType } from 'types-party-battle/types/GameSchema'
import { LobbyRoom } from './rooms/LobbyRoom'
import { PickCardsGameRoom } from './rooms/PickCardsGameRoom'
import { PotatoGameRoom } from './rooms/PotatoGameRoom'
import { SnakeGameRoom } from './rooms/SnakeGameRoom'

const LOBBY_ROOM_NAME = 'lobby_room'

export const gameRooms: ({
  readonly gameType: GameType
  readonly roomName: string
} & Type<Room<GameSchema>>)[] = [PickCardsGameRoom, SnakeGameRoom, PotatoGameRoom]

export default config({
  initializeGameServer: (gameServer) => {
    gameServer.define(LOBBY_ROOM_NAME, LobbyRoom)
    gameRooms.forEach((gameRoom) => {
      gameServer.define(gameRoom.roomName, gameRoom)
    })
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
    Encoder.BUFFER_SIZE = 16 * 1024 // 16 KB
  },
})
