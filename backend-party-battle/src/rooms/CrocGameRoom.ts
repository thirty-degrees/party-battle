import { Client } from "@colyseus/core";
import { CrocGameSchema, GameType, PlayerSchema, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";

export class CrocGameRoom extends BaseGameRoom<CrocGameSchema> {
  static readonly gameType: GameType = "croc";
  static readonly roomName: string = "croc_game_room";
  hotToothIndex = 0;
  private currentPlayerIndex = 0;
  private playerTurnTimer: NodeJS.Timeout | null = null;
  private eliminatedPlayers: string[] = [];
  private playerScores: Map<string, number> = new Map();

  override getGameType(): GameType {
    return CrocGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.state = new CrocGameSchema("waiting");
    this.hotToothIndex = Math.floor(Math.random() * 12);
    this.state.teethCount = 12;
    
    options.playerNames.forEach(playerName => {
      const playerSchema = new PlayerSchema(playerName);
      this.state.inGamePlayers.push(playerSchema);
    });

    this.onMessage("tooth_pressed", (client, message: { index: number }) => {
      const playerName = this.getPlayerNameBySessionId(client.sessionId);
      if (playerName && playerName === this.state.currentPlayer) {
        this.state.pressedTeethIndex.push(message.index);
        
        if (message.index === this.hotToothIndex) {
          this.handleHotToothPressed(playerName, options);
        } else {
          this.advanceToNextPlayer(options);
        }
      }
    });
  }

  override onJoin(client: Client, options: { name: string }) {
    super.onJoin(client, options);
    
    if (this.state.players.length === this.playerConnections.size) {
      this.startGame();
    }
  }

  private startGame() {
    this.state.status = "playing";
    this.currentPlayerIndex = 0;
    this.setCurrentPlayer();
    this.startPlayerTurn();
  }

  private setCurrentPlayer() {
    if (this.state.inGamePlayers.length > 0) {
      this.state.currentPlayer = this.state.inGamePlayers[this.currentPlayerIndex].name;
    }
  }

  private startPlayerTurn() {
    this.clearPlayerTurnTimer();
    this.playerTurnTimer = setTimeout(() => {
      this.handlePlayerTimeout();
    }, 5000);
  }

  private advanceToNextPlayer(_options: { lobbyRoomId: string, playerNames: string[] }) {
    this.clearPlayerTurnTimer();
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.state.inGamePlayers.length;
    this.setCurrentPlayer();
    this.startPlayerTurn();
  }

  private handlePlayerTimeout() {
    this.clearPlayerTurnTimer();
    // will be changed later to just the player loses the game, not everyone
    this.finishGame();
  }

  private clearPlayerTurnTimer() {
    if (this.playerTurnTimer) {
      clearTimeout(this.playerTurnTimer);
      this.playerTurnTimer = null;
    }
  }

  private getPlayerNameBySessionId(sessionId: string): string | null {
    for (const [playerName, playerSessionId] of this.playerConnections.entries()) {
      if (playerSessionId === sessionId) {
        return playerName;
      }
    }
    return null;
  }

  private handleHotToothPressed(playerName: string, options: { lobbyRoomId: string, playerNames: string[] }) {
    this.eliminatedPlayers.push(playerName);
    const eliminationOrder = this.eliminatedPlayers.length - 1;
    this.playerScores.set(playerName, eliminationOrder);

    const playerIndex = this.state.inGamePlayers.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
      this.state.inGamePlayers.splice(playerIndex, 1);
    }

    if (this.state.inGamePlayers.length === 1) {
      const lastPlayer = this.state.inGamePlayers[0].name;
      this.playerScores.set(lastPlayer, this.eliminatedPlayers.length);
      this.finishGame(options);
    } else {
      this.resetForNextRound();
    }
  }

  private resetForNextRound() {
    this.hotToothIndex = Math.floor(Math.random() * 12);
    this.state.pressedTeethIndex.clear();
    this.currentPlayerIndex = 0;
    this.setCurrentPlayer();
    this.startPlayerTurn();
  }

  override getScores(): Score[] {
    const scores: Score[] = [];
    
    this.playerScores.forEach((score, playerName) => {
      scores.push({ playerName, value: score });
    });

    this.state.inGamePlayers.forEach(player => {
      if (!this.playerScores.has(player.name)) {
        scores.push({ playerName: player.name, value: this.eliminatedPlayers.length });
      }
    });

    return scores;
  }

  override onDispose() {
    this.clearPlayerTurnTimer();
    super.onDispose();
  }
}
