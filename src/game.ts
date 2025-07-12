import type { GameData } from './core';
import { CONFIG } from './core';
import { AssetManager, UIManager, GameStateManager } from './managers';
import { WebSocketManager } from './network';
import { Renderer } from './rendering';
import { InputHandler } from './input';

export class BomberManGame {
  private canvas: HTMLCanvasElement;
  private gameData: GameData;
  private assetManager: AssetManager;
  private uiManager: UIManager;
  private gameStateManager: GameStateManager;
  private websocketManager: WebSocketManager;
  private renderer: Renderer;
  private inputHandler: InputHandler;

  constructor() {
    // Initialize canvas
    this.canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
    if (!this.canvas) {
      throw new Error("Could not find canvas element with id 'gameCanvas'");
    }

    // Setup canvas dimensions
    this.canvas.width = CONFIG.BOARD_WIDTH * CONFIG.TILE_SIZE;
    this.canvas.height = CONFIG.BOARD_HEIGHT * CONFIG.TILE_SIZE;

    // Initialize game data
    this.gameData = {
      tick_count: 0,
      socket: null,
      state: null,
      players: new Map(),
      bombs: { bombs: [], explosions: [] },
      myPlayerId: null,
      myName: null,
      countPlayerAlive: 0,
      lastMoveSendTime: 0,
      playerBombColors: {},
      nextColorIndex: 0
    };

    // Initialize managers
    this.assetManager = AssetManager.getInstance();
    this.uiManager = new UIManager();
    this.gameStateManager = new GameStateManager(this.gameData);
    this.renderer = new Renderer(this.canvas);

    // Initialize WebSocket manager with callbacks
    this.websocketManager = new WebSocketManager(
      this.gameData,
      () => this.onGameStateUpdate(),
      () => this.onUIUpdate()
    );
    // Connect WebSocket
    this.websocketManager.connect();

    // Initialize input handler
    this.inputHandler = new InputHandler(
      this.gameData,
      (event) => this.websocketManager.sendGameEvent(event)
    );
  }

  async init(): Promise<void> {
    try {
      // Wait for assets to load
      await new Promise<void>((resolve) => {
        this.assetManager.onAssetsLoaded(resolve);
      });

      // Initialize input handling
      this.inputHandler.init();

      // Setup player name input handler

      // Connect to WebSocket
      this.websocketManager.connect();
      this.setupPlayerNameHandler(undefined);

      console.log("Bomber Man game initialized successfully!");
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  }

  private onGameStateUpdate(): void {
    if (this.gameData.myPlayerId) {
      this.setupPlayerNameHandler(this.gameData.myName?.toString());
    }
    
    // Cleanup expired explosions using GameStateManager
    this.gameStateManager.cleanupExpiredExplosions();
    
    // Update player count using GameStateManager
    this.gameStateManager.updatePlayerCount();
    
    this.renderer.drawGame(this.gameData);
  }

  private onUIUpdate(): void {
    if (this.gameData.socket?.readyState === WebSocket.OPEN) {
      this.uiManager.updateStatus("Connected!", "connected");
    } else {
      this.uiManager.updateStatus("Disconnected. Attempting to reconnect...", "disconnected");
    }
    if (this.gameData.players) {
      const target = document.querySelector('.game-canvas') as HTMLInputElement;
      const gameCanvas = document.getElementById("gameCanvas");
      if (gameCanvas) {
        gameCanvas.classList.remove("game-canvas");
        target.classList.add("game-canvas");
      }
    }

    if (this.gameData.state) {
      this.uiManager.updateScoreboard(this.gameData);
      // this.uiManager.updateCurrentPlayer(this.gameData);

      if (this.gameStateManager.isGameOver()) {
        this.uiManager.showGameOverMessage(
          this.gameData,
          this.gameStateManager,
          () => this.websocketManager.sendGameEvent({ ResetGame: null })
        );
      } else {
        this.uiManager.hideGameOverMessage();
      }
    }
  }

  public setupPlayerNameHandler(playerName: string | undefined): void {
    const playerNameInputs = document.querySelectorAll('.player-name') as NodeListOf<HTMLInputElement>;

    if (playerName) {
      this.showGameBoard();
    }

    playerNameInputs.forEach(input => {
      input.addEventListener('change', (e: any) => {
        const eventToSend = { JoinGame: { name: e.target?.value } };
        this.websocketManager.sendGameEvent(eventToSend);
        this.showGameBoard();
      });
    });
  }

  private showGameBoard(): void {
    let target = document.querySelector(".player-name") as HTMLInputElement;
    const gameCanvas = document.getElementById("gameCanvas");
    if (gameCanvas) {
      gameCanvas.classList.remove("game-canvas");
      target.classList.add("game-canvas");
    }
  }
}
