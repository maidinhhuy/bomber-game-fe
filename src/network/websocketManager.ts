import type { GameData, ServerMessage, GameEvent } from '../core';
import { CONFIG } from '../core';
import { Utils } from '../utils';
import { GameStateManager } from '../managers';

export class WebSocketManager {
  private gameData: GameData;
  private gameStateManager: GameStateManager;
  private onGameStateUpdate: () => void;
  private onUIUpdate: () => void;

  constructor(gameData: GameData, onGameStateUpdate: () => void, onUIUpdate: () => void) {
    this.gameData = gameData;
    this.gameStateManager = new GameStateManager(gameData);
    this.onGameStateUpdate = onGameStateUpdate;
    this.onUIUpdate = onUIUpdate;
  }

  connect(): void {
    const token = Utils.getTokenFromSession();
    // Connect to the WebSocket server with the token
    this.gameData.socket = new WebSocket(`${CONFIG.WS_URL}?token=${token}`);
    this.gameData.socket.onopen = () => {
      console.log("Connected to WebSocket server");
      this.onUIUpdate();
    };

    this.gameData.socket.onmessage = (event) => {
      try {
        const receivedMessage: ServerMessage = JSON.parse(event.data);
        this.handleMessage(receivedMessage);
      } catch (e) {
        console.error("JSON parsing error:", e, event.data);
      }
    };

    this.gameData.socket.onclose = (event) => {
      console.log("Disconnected from WebSocket server. Code:", event.code, "Reason:", event.reason);
      this.gameData.state = null;
      this.gameData.myPlayerId = null;
      this.onUIUpdate();
      setTimeout(() => this.connect(), CONFIG.RECONNECT_DELAY);
    };

    this.gameData.socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      this.onUIUpdate();
    };
  }

  private handleMessage(message: ServerMessage): void {
    if (typeof message === "number") {
      // this.handlePlayerId(message);
    } else if ('Tick' in message) {
      this.handleTickCount(message.Tick);
    }
    else if ('GameMap' in message) {
      this.handleGameState(message);
    } else if ('PlayerMoved' in message) {
      this.handlePlayerMoved(message.PlayerMoved);
    } else if ('BombPlaced' in message) {
      this.handleBombPlaced(message.BombPlaced);
    } else if ('BombExploded' in message) {
      this.handleBombExploded(message.BombExploded);
    } else if ('Reconnect' in message) {
      this.handleReconnect(message);
    } else if ('PlayerDied' in message) {
      this.handlePlayerDied(message.PlayerDied);
    } else if ('PlayerRevived' in message) {
      this.handlePlayerRevived(message.PlayerRevived);
    }
  }

  private handlePlayerRevived(playerRevived: { player_id: number; x: number; y: number }): void {
    this.gameStateManager.updatePlayerRevived(playerRevived.player_id, playerRevived.x, playerRevived.y);
    this.onGameStateUpdate();
    this.onUIUpdate();
  }

  private handlePlayerDied(playerDied: { player_id: number }): void {
    this.gameStateManager.updatePlayerDied(playerDied.player_id);
    this.onGameStateUpdate();
    this.onUIUpdate();
  }

  private handleTickCount(tick: any): void {
    this.gameData.tick_count = tick.tick_count;
    this.onGameStateUpdate();
    // this.onUIUpdate();
  }


  private handleGameState(message: { GameMap: any }): void {
    this.gameStateManager.updateGameState(message.GameMap);
    this.onGameStateUpdate();
    this.onUIUpdate();
  }

  private handleReconnect(message: { Reconnect: any }): void {
    this.gameData.myPlayerId = message.Reconnect.player_id;
    // Find the player in the game state
    const player = this.gameData.state?.players[message.Reconnect.player_id];
    if (player) {
      this.gameData.myName = player.name;
      Utils.assignBombColor(player.id, this.gameData);
    };
    this.onGameStateUpdate()
    this.onUIUpdate();
  }

  private handlePlayerMoved(playerMoved: { player_id: number; x: number; y: number }): void {
    this.gameStateManager.updatePlayerPosition(playerMoved.player_id, playerMoved.x, playerMoved.y);
    this.onGameStateUpdate();
  }

  private handleBombPlaced(bombPlaced: { bomb: any }): void {
    this.gameStateManager.addBomb(bombPlaced.bomb);
    this.onGameStateUpdate();
  }

  private handleBombExploded(bombExploded: any): void {
    const explosions = bombExploded.explosions || [];
    this.gameStateManager.addExplosions(explosions);
    this.updateGameBombs(bombExploded.bombs || []);
    // Update game map
    if (bombExploded.game_map) {
      this.gameStateManager.updateGameMap({
        map: bombExploded.game_map
      });
    }

    // Cleanup expired explosions
    this.gameStateManager.cleanupExpiredExplosions();

    this.onGameStateUpdate();
  }

  updateGameBombs(bombs: any[]): void {
    this.gameData.bombs.bombs = bombs;
    this.onGameStateUpdate();
  }

  sendGameEvent(event: GameEvent): void {
    if (this.gameData.socket && this.gameData.socket.readyState === WebSocket.OPEN) {
      this.gameData.socket.send(JSON.stringify(event));
    }
  }
}
