import type { GameData, Bomb, Explosion, Player } from '../core';
import { CONFIG, COLORS, HEROES } from '../core';
import { AssetManager } from '../managers';
import { PatternGenerator } from './patternGenerator';
import { Utils } from '../utils';

export class Renderer {
  private ctx: CanvasRenderingContext2D;
  private assetManager: AssetManager;
  private brickPattern: CanvasPattern | null;
  private wallPattern: CanvasPattern | null;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Could not get 2D context from canvas");
    }
    this.ctx = context;
    this.assetManager = AssetManager.getInstance();

    // Initialize patterns
    this.brickPattern = PatternGenerator.createBrickPattern(this.ctx);
    this.wallPattern = PatternGenerator.createWallPattern(this.ctx);
  }

  drawGame(gameData: GameData): void {
    if (!gameData.state) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      return;
    }

    this.drawBoard(gameData);
    this.drawBombs(gameData);
    this.drawPlayers(gameData);
    this.drawExplosions(gameData);
  }

  private drawBoard(gameData: GameData): void {
    if (!gameData.state) return;
    // Load map width/height from gameData
    let mapWidth = gameData.state.map.width || CONFIG.BOARD_WIDTH;
    let mapHeight = gameData.state.map.height || gameData.state.map.board.length || CONFIG.BOARD_HEIGHT
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tile = gameData.state.map.board[y][x];
        let fillStyle: string | CanvasPattern | null;
        switch (tile) {
          case "Empty":
            fillStyle = COLORS.empty;
            break;
          case "Wall":
            fillStyle = this.wallPattern;
            break;
          case "Brick":
            fillStyle = this.brickPattern;
            break;
          default:
            fillStyle = COLORS.empty;
        }

        this.ctx.fillStyle = fillStyle!;
        this.ctx.fillRect(x * CONFIG.TILE_SIZE, y * CONFIG.TILE_SIZE, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      }
    }
  }

  private drawBombs(gameData: GameData): void {
    gameData.bombs.bombs.forEach((bomb: Bomb) => {
      const drawX = bomb.x * CONFIG.TILE_SIZE;
      const drawY = bomb.y * CONFIG.TILE_SIZE;
      const shouldDrawBomb = this.calculateBombVisibility(bomb);

      if (shouldDrawBomb && this.assetManager.isImageLoaded(this.assetManager.assets.bomb)) {
        this.ctx.drawImage(this.assetManager.assets.bomb, drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
      }
    });
  }

  private calculateBombVisibility(bomb: Bomb): boolean {
    if (bomb.fuse_timer <= CONFIG.BLINK_THRESHOLD_FAST) {
      return bomb.fuse_timer % 2 === 0;
    } else if (bomb.fuse_timer <= CONFIG.BLINK_THRESHOLD_NORMAL) {
      return Math.floor(bomb.fuse_timer / 2) % 2 === 0;
    }
    return true;
  }

  private drawPlayers(gameData: GameData): void {
    if (!gameData.state) return;
    gameData.players.forEach((player: Player) => {
      if (!player.alive) {
        // Draw tombstone if player is dead
        if (this.assetManager.isImageLoaded(this.assetManager.assets.tombstone)) {
          const drawX = player.x * CONFIG.TILE_SIZE;
          const drawY = player.y * CONFIG.TILE_SIZE;
          this.ctx.drawImage(this.assetManager.assets.tombstone, drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        }
        return;
      }

      const drawX = player.x * CONFIG.TILE_SIZE;
      const drawY = player.y * CONFIG.TILE_SIZE;
      const isImmortal = !!(player.immortal_until_tick && gameData.state!.tick_count < player.immortal_until_tick);
      const shouldDrawPlayer = !isImmortal || ((Math.floor(gameData.state!.tick_count / 2) % 2) === 0);

      if (shouldDrawPlayer && this.assetManager.isImageLoaded(this.assetManager.assets.sprite)) {
        this.drawPlayerSprite(player, drawX, drawY);
        this.drawPlayerEffects(player, drawX, drawY, isImmortal, gameData);
        this.drawPlayerName(player, drawX, drawY, gameData);
      }
      Utils.assignBombColor(player.id, gameData);
    });
  }

  private drawPlayerSprite(player: Player, drawX: number, drawY: number): void {
    const sx = HEROES[player.figure].x * CONFIG.SPRITE_WIDTH;
    const sy = HEROES[player.figure].y * CONFIG.SPRITE_HEIGHT;
    this.ctx.drawImage(
      this.assetManager.assets.sprite,
      sx, sy, CONFIG.SPRITE_WIDTH, CONFIG.SPRITE_HEIGHT,
      drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE
    );
  }

  private drawPlayerEffects(player: Player, drawX: number, drawY: number, isImmortal: boolean, gameData: GameData): void {
    if (isImmortal) {
      this.ctx.strokeStyle = "#00FFFF";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(drawX - 1, drawY - 1, CONFIG.TILE_SIZE + 2, CONFIG.TILE_SIZE + 2);
    }

    if (player.id === gameData.myPlayerId) {
      this.ctx.strokeStyle = "#FFFFFF";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(drawX, drawY, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    }
  }

  private drawPlayerName(player: Player, drawX: number, drawY: number, gameData: GameData): void {
    this.ctx.font = "12px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "bottom";

    const textX = drawX + CONFIG.TILE_SIZE / 2;
    const textY = drawY - 5;

    this.ctx.fillStyle = gameData.playerBombColors[player.id] || "white";
    this.ctx.fillText(player.name, textX, textY);
  }

  private drawExplosions(gameData: GameData): void {
    gameData.bombs.explosions.forEach((exp: Explosion) => {
      let timeRemaining: number;
      if (exp.explosion_start_tick) {
        const ticksElapsed = gameData.tick_count - exp.explosion_start_tick;
        timeRemaining = Math.max(0, CONFIG.EXPLOSION_TICKS - ticksElapsed);
      } else {
        // Fallback cho explosions cũ không có explosion_start_tick
        timeRemaining = exp.timer || 0;
      }

      if (timeRemaining <= 0) return;

      const TILE_SIZE = CONFIG.TILE_SIZE;
      const EXPLOSION_TICKS = CONFIG.EXPLOSION_TICKS;
      const progress = 1 - (timeRemaining / EXPLOSION_TICKS); // 0 at start, 1 at end

      // Calculate dynamic size and position for "growth" effect
      let currentSize;
      if (progress < 0.5) {
        currentSize = TILE_SIZE * (1 + progress * 0.5); // Grows up to 1.25 * TILE_SIZE
      } else {
        currentSize = TILE_SIZE * (1 + (1 - progress) * 0.5); // Shrinks back to TILE_SIZE
      }

      currentSize = Math.max(currentSize, TILE_SIZE * 0.1);

      const offset = (currentSize - TILE_SIZE) / 2; // Center the expanding/shrinking explosion
      const drawX = exp.x * TILE_SIZE - offset;
      const drawY = exp.y * TILE_SIZE - offset;

      const alpha = Math.max(0, timeRemaining / EXPLOSION_TICKS);

      if (alpha <= 0.01) return;

      this.ctx.fillStyle = `rgba(255, 152, 0, ${alpha})`; // Orange with fading alpha
      this.ctx.fillRect(drawX, drawY, currentSize, currentSize); // Use dynamic size

      const coreRadius = Math.max(1, currentSize / 3);
      this.ctx.fillStyle = `rgba(255, 193, 7, ${alpha})`; // Lighter core
      this.ctx.beginPath();
      this.ctx.arc(
        exp.x * TILE_SIZE + TILE_SIZE / 2, // Center X
        exp.y * TILE_SIZE + TILE_SIZE / 2, // Center Y
        coreRadius, // Safe radius
        0,
        2 * Math.PI,
      );
      this.ctx.fill();

      // Optional: Add a second, slightly smaller, darker circle for more depth
      const innerRadius = Math.max(1, currentSize / 4);
      this.ctx.fillStyle = `rgba(200, 100, 0, ${alpha * 0.8})`; // Darker orange, less opaque
      this.ctx.beginPath();
      this.ctx.arc(
        exp.x * TILE_SIZE + TILE_SIZE / 2, // Center X
        exp.y * TILE_SIZE + TILE_SIZE / 2, // Center Y
        innerRadius, // Safe radius
        0,
        2 * Math.PI,
      );
      this.ctx.fill();
    });
  }

}
