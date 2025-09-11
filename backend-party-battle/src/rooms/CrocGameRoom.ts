import { Client, Delayed } from "@colyseus/core";
import { CrocGameSchema, GameType, PlayerSchema, Score } from "types-party-battle";
import { BaseGameRoom } from "../games/BaseGameRoom";
import { assignScoresByOrder } from "../scores/assignScoresByOrder";

export class CrocGameRoom extends BaseGameRoom<CrocGameSchema> {
  static readonly gameType: GameType = "croc";
  static readonly roomName: string = "croc_game_room";
  private readonly cardCount = 12;
  hotCardIndex = 0;
  private currentPlayerIndex = 0;
  private playerTurnTimer: Delayed | null = null;
  private eliminatedPlayers: string[] = [];
  private readonly playerTurnTimeout = 20000;

  override getGameType(): GameType {
    return CrocGameRoom.gameType;
  }

  override onCreate(options: { lobbyRoomId: string, playerNames: string[] }) {
    super.onCreate(options);
    this.clock.start();
    this.state = new CrocGameSchema("waiting");
    this.hotCardIndex = Math.floor(Math.random() * this.cardCount);
    this.state.cardCount = this.cardCount;
    
    options.playerNames.forEach(playerName => {
      const playerSchema = new PlayerSchema(playerName);
      this.state.inGamePlayers.push(playerSchema);
    });

    this.onMessage("CardPressed", (client, message: { index: number }) => {
      const playerName = this.getPlayerNameBySessionId(client.sessionId);
      if (playerName && playerName === this.state.currentPlayer) {
        this.state.pressedCardIndex.push(message.index);
        
        if (message.index === this.hotCardIndex) {
          this.handleHotCardPressed(playerName);
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
    
    this.state.timeWhenTimerIsOver = this.clock.currentTime + this.playerTurnTimeout;
    
    this.playerTurnTimer = this.clock.setTimeout(() => {
      this.handlePlayerTimeout();
    }, this.playerTurnTimeout);
  }

  private advanceToNextPlayer(_options: { lobbyRoomId: string, playerNames: string[] }) {
    this.clearPlayerTurnTimer();
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.state.inGamePlayers.length;
    this.setCurrentPlayer();
    this.startPlayerTurn();
  }

  private handlePlayerTimeout() {
    this.clearPlayerTurnTimer();
    const currentPlayerName = this.state.currentPlayer;
    if (currentPlayerName) {
      this.handleHotCardPressed(currentPlayerName);
    }
  }

  private clearPlayerTurnTimer() {
    if (this.playerTurnTimer) {
      this.playerTurnTimer.clear();
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

  private handleHotCardPressed(playerName: string) {
    this.eliminatedPlayers.push(playerName);

    const playerIndex = this.state.inGamePlayers.findIndex(player => player.name === playerName);
    if (playerIndex !== -1) {
      this.state.inGamePlayers.splice(playerIndex, 1);
    }

    if (this.state.inGamePlayers.length === 1) {
      this.finishGame();
    } else {
      this.resetForNextRound();
    }
  }

  private resetForNextRound() {
    this.hotCardIndex = Math.floor(Math.random() * this.cardCount);
    this.state.pressedCardIndex.clear();
    this.currentPlayerIndex = 0;
    this.setCurrentPlayer();
    this.startPlayerTurn();
  }

  override getScores(): Score[] {
    const playerGroups: string[][] = [];

    for (const playerName of this.eliminatedPlayers) {
      playerGroups.push([playerName]);
    }

    if (this.state.inGamePlayers.length > 0) {
      const remainingPlayers = this.state.inGamePlayers.map(player => player.name);
      playerGroups.push(remainingPlayers);
    }

    return assignScoresByOrder(playerGroups);
  }

  override onDispose() {
    this.clearPlayerTurnTimer();
    super.onDispose();
  }
}
