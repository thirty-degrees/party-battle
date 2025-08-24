import { Room, Client } from "@colyseus/core";
import { matchMaker } from "@colyseus/core";
import { LobbyRoomState, LobbyPlayerState } from "./schema/LobbyRoomState";
import { CrocMiniGameRoom } from "./CrocMiniGameRoom";

export class LobbyRoom extends Room<LobbyRoomState> {
  maxClients = 8;
  private gameRoomId: string | null = null;
  private playersInGame = new Set<string>();

  onCreate(options: any) {
    this.autoDispose = false;
    console.log("LobbyRoom created:", this.roomId);

    this.setState(new LobbyRoomState());

    if (options.roomName) {
      this.state.roomName = options.roomName;
    }
    if (options.maxPlayers) {
      this.state.maxPlayers = options.maxPlayers;
      this.maxClients = options.maxPlayers;
    }

    this.onMessage("end_game", (client, message) => {
      if (this.state.currentMiniGame === null) {
        return;
      }

      console.log("Game ended. Returning to lobby.");
      this.state.currentMiniGame = null;

      // Reset all players' ready state when game ends
      this.state.players.forEach((player) => {
        player.ready = false;
      });

      this.broadcast("game_ended", { timestamp: Date.now() });
    });

    this.onMessage("ready", (client, message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        console.log(`Player ${player.name} is ready for next game`);
        player.ready = true;
        this.broadcast("player_ready", {
          playerId: client.sessionId,
          playerName: player.name,
        });

        this.checkAllPlayersReady();
      }
    });

    this.onMessage("create_game_room", (client, message) => {
      console.log(`Player ${client.sessionId} requested game room creation`);
      this.createGameRoomRequest(client);
    });

    this.onMessage("reset_ready", (client, message) => {
      console.log(`Player ${client.sessionId} reset ready state`);
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = false;
        console.log(`Player ${player.name} ready state reset to false`);
      }
    });

    this.onMessage("return_from_game", (client, message) => {
      console.log(`Player ${client.sessionId} returned from game`);
      const player = this.state.players.get(client.sessionId);
      if (player) {
        player.ready = false;
        this.playersInGame.delete(client.sessionId);
        console.log(
          `Player ${player.name} returned from game, ready state reset`
        );

        this.broadcast("player_returned", {
          playerId: client.sessionId,
          playerName: player.name,
          timestamp: Date.now(),
        });
      }
    });
  }

  onJoin(client: Client, options: any) {
    console.log(`Player ${client.sessionId} joined lobby`);

    const player = new LobbyPlayerState();
    const requestedName =
      options.name || `Player_${client.sessionId.substr(0, 5)}`;

    // Check if name is already taken
    const existingNames = Array.from(this.state.players.values()).map(
      (p) => p.name
    );
    let finalName = requestedName;
    let counter = 1;

    while (existingNames.includes(finalName)) {
      finalName = `${requestedName}_${counter}`;
      counter++;
    }

    player.name = finalName;
    player.id = client.sessionId;
    player.ready = false;

    this.state.players.set(client.sessionId, player);

    console.log(`Lobby now has ${this.state.players.size} players`);
    this.broadcast("player_joined", {
      playerId: client.sessionId,
      playerName: player.name,
      totalPlayers: this.state.players.size,
    });
  }

  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    this.state.players.delete(client.sessionId);
    if (player) {
      console.log(`Player ${player.name} left lobby (consented: ${consented})`);

      this.broadcast("player_left", {
        playerId: client.sessionId,
        playerName: player.name,
        totalPlayers: this.state.players.size,
      });
    }
  }

  onDispose() {
    console.log("Lobby room disposing:", this.roomId);
  }

  private async checkAllPlayersReady() {
    const allPlayers = Array.from(this.state.players.values());
    const allReady = allPlayers.every((player) => player.ready);

    if (allReady && allPlayers.length > 0) {
      await this.createCrocGameRoom();
    }
  }

  private async createGameRoomRequest(client: Client) {
    console.log("Creating game room via matchMaker...");

    try {
      const gameRoom = await matchMaker.createRoom("croc_mini_game_room", {
        lobbyRoomId: this.roomId,
        playerCount: this.state.players.size,
        requestedBy: client.sessionId,
      });

      this.gameRoomId = gameRoom.roomId;
      console.log(`Created croc game room via matchMaker: ${this.gameRoomId}`);

      console.log(`Broadcasting game_started with room ID: ${this.gameRoomId}`);
      this.broadcast("game_started", {
        gameRoomId: this.gameRoomId,
        gameType: "croc",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to create game room via matchMaker:", error);
      this.broadcast("game_room_error", {
        error: "Failed to create game room",
        timestamp: Date.now(),
      });
    }
  }

  private async createCrocGameRoom() {
    console.log("All players ready! Creating croc game room.");

    try {
      const gameRoom = await matchMaker.createRoom("croc_mini_game_room", {
        lobbyRoomId: this.roomId,
        playerCount: this.state.players.size,
      });

      this.gameRoomId = gameRoom.roomId;
      this.playersInGame.clear();

      // Mark all players as in game and reset their ready state
      this.state.players.forEach((player, sessionId) => {
        this.playersInGame.add(sessionId);
        player.ready = false; // Reset ready state when game starts
      });

      console.log(`Created croc game room via matchMaker: ${this.gameRoomId}`);

      console.log(`Broadcasting game_started with room ID: ${this.gameRoomId}`);
      this.broadcast("game_started", {
        gameRoomId: this.gameRoomId,
        gameType: "croc",
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error("Failed to create croc game room via matchMaker:", error);
      this.broadcast("game_room_error", {
        error: "Failed to create game room",
        timestamp: Date.now(),
      });
    }
  }

  private movePlayersBackToLobby() {
    console.log("Moving players back to lobby");
    this.state.players.forEach((player) => {
      player.ready = false;
    });
    this.playersInGame.clear();
    this.gameRoomId = null;

    this.broadcast("return_to_lobby", {
      timestamp: Date.now(),
    });
  }
}
