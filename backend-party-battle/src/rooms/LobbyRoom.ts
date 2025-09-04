import { Client, matchMaker, Room } from "@colyseus/core";
import {
  GameHistory,
  GameHistorySchema,
  GameType,
  LobbyPlayer,
  LobbySchema,
  MAX_AMOUNT_OF_PLAYERS,
  ScoreSchema
} from "types-party-battle";
import { gameTypeToRoomNameMap } from "../app.config";

export class LobbyRoom extends Room<LobbySchema> {
  onCreate(_options: { name: string }) {
    console.log(`LobbyRoom.onCreate: roomId: '${this.roomId}'`);

    this.autoDispose = true;
    this.maxClients = MAX_AMOUNT_OF_PLAYERS;
    this.state = new LobbySchema();

    this.onMessage('SetPlayerReady', async (client: Client, ready: boolean) => {
      const player = this.state.players.get(client.sessionId);
      console.log(`LobbyRoom.onMessage(SetPlayerReady): roomId: '${this.roomId}', playerName: '${player.name}', ready: ${ready}`);

      player.ready = ready;

      if (this.areAllPlayersReady()) {
        await this.createGameRoom("croc");
      }
    });

    this.presence.subscribe("score-" + this.roomId, (data: GameHistory) => {
      console.log(`LobbyRoom.presence.subscribe(score-${this.roomId})}`);

      const gameHistory = new GameHistorySchema(data.gameType);
      data.scores.forEach((score) => {
        const scoreSchema = new ScoreSchema(score.playerName, score.value);
        gameHistory.scores.push(scoreSchema);
      });
      this.state.gameHistories.push(gameHistory);

      this.state.players.forEach((player) => {
        player.ready = false;
      });
      this.state.currentGameRoomId = null;
      this.state.currentGame = null;
    });
  }

  onJoin(client: Client, options: { name: string }) {
    console.log(`LobbyRoom.onJoin: roomId: '${this.roomId}', playerName: '${options.name}'`);
    const player = new LobbyPlayer();
    player.name = options.name;
    player.ready = false;
    this.state.players.set(client.sessionId, player);
  }

  onLeave(client: Client, _consented: boolean) {
    console.log(`LobbyRoom.onLeave: roomId: '${this.roomId}', playerId: '${client.sessionId}'`);
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    console.log(`LobbyRoom.onDispose: roomId: '${this.roomId}'`);
  }

  private areAllPlayersReady(): boolean {
    const allPlayers = Array.from(this.state.players.values());
    const allReady = allPlayers.every((player) => player.ready);

    return allReady && allPlayers.length > 0;
  }

  private async createGameRoom(gameType: GameType): Promise<void> {
    console.log(`LobbyRoom.createGameRoom: lobbyRoomId: '${this.roomId}', gameType: '${gameType}'`);

    const roomName = gameTypeToRoomNameMap[gameType];

    const gameRoom = await matchMaker.createRoom(roomName, {
      lobbyRoomId: this.roomId,
    });

    this.state.currentGame = gameType;
    this.state.currentGameRoomId = gameRoom.roomId;
  }
}
