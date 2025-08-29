import { Room, Client } from "@colyseus/core";
import {
  CrocMiniGameRoomState,
  CrocPlayerState,
} from "./schema/CrocMiniGameRoomState";

// TODO: Create an abstract MiniGameRoom class to avoid code duplication when adding more mini-games
// This would include common functionality like player management, game state transitions, and message handling
export class CrocMiniGameRoom extends Room<CrocMiniGameRoomState> {
  maxClients = 8;
  private gameTimer: NodeJS.Timeout | null = null;
  private playerScores: { [key: string]: number } = {};
  private playerReady: { [key: string]: boolean } = {};
  private disposeTimer: NodeJS.Timeout | null = null;

  onCreate(options: unknown) {
    this.autoDispose = false;
    console.log(
      "CrocMiniGameRoom created:",
      this.roomId,
      "with options:",
      options
    );

    this.state = new CrocMiniGameRoomState();

    this.onMessage("player_ready", (client, _message) => {
      const player = this.state.players.get(client.sessionId);
      if (player) {
        this.playerReady[client.sessionId] = true;
        console.log(`Player ${player.name} is ready`);

        this.checkAllPlayersReady();
      }
    });

    this.onMessage("croc_hit", (client, _message) => {
      if (this.state.gameState !== "playing") {
        return;
      }

      const player = this.state.players.get(client.sessionId);
      if (player) {
        this.playerScores[client.sessionId] =
          (this.playerScores[client.sessionId] || 0) + 1;
        console.log(
          `Player ${player.name} hit croc! Score: ${this.playerScores[client.sessionId]
          }`
        );

        this.broadcast("score_update", {
          playerId: client.sessionId,
          playerName: player.name,
          score: this.playerScores[client.sessionId],
        });
      }
    });
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`Player ${client.sessionId} joined croc game`);

    const player = new CrocPlayerState();
    player.name = options.name || `Player_${client.sessionId.substr(0, 5)}`;
    player.id = client.sessionId;

    this.state.players.set(client.sessionId, player);
    this.playerScores[client.sessionId] = 0;
    this.playerReady[client.sessionId] = false;

    console.log(`Croc game now has ${this.state.players.size} players`);
    console.log(`Room ${this.roomId} is now active with players`);
    this.broadcast("player_joined", {
      playerId: client.sessionId,
      playerName: player.name,
      totalPlayers: this.state.players.size,
    });
  }

  onLeave(client: Client, consented: boolean) {
    const player = this.state.players.get(client.sessionId);
    if (player) {
      console.log(
        `Player ${player.name} left croc game (consented: ${consented})`
      );

      this.broadcast("player_left", {
        playerId: client.sessionId,
        playerName: player.name,
        totalPlayers: this.state.players.size,
      });
    }
  }

  onDispose() {
    console.log(
      "CrocMiniGameRoom disposing:",
      this.roomId,
      "with",
      this.state.players.size,
      "players"
    );

    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    if (this.disposeTimer) {
      clearTimeout(this.disposeTimer);
      this.disposeTimer = null;
    }
  }

  private checkAllPlayersReady() {
    const allPlayers = Array.from(this.state.players.values());
    const allReady = allPlayers.every((player) => this.playerReady[player.id]);

    if (allReady && allPlayers.length > 0) {
      this.startGame();
    }
  }

  private startGame() {
    console.log("All players ready! Starting croc game.");
    this.state.gameState = "playing";

    this.broadcast("game_started", {
      timestamp: Date.now(),
    });
  }

  private endGame() {
    console.log("Croc game ended!");
    this.state.gameState = "finished";

    if (this.gameTimer) {
      clearInterval(this.gameTimer);
      this.gameTimer = null;
    }

    this.broadcast("game_ended", {
      playerScores: this.playerScores,
      timestamp: Date.now(),
    });
  }
}
