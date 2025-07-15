import type { GameData, GameState, Player } from '../core';
import { CONFIG } from '../core';

export class GameStateManager {
  private gameData: GameData;

  constructor(gameData: GameData) {
    this.gameData = gameData;
  }

  updateGameState(newState: GameState): void {
    this.gameData.tick_count = newState.tick_count;
    this.gameData.state = newState;
    this.gameData.players = new Map(Object.entries(newState.players));
  }

  updateGameMap(newState: any): void {
    if (!this.gameData.state) {
      this.gameData.state = newState;
    } else {
      this.gameData.state.map = newState.map;
    }
  }

  updatePlayerPosition(playerId: number, x: number, y: number): void {
    const existingPlayer = this.gameData.players.get(String(playerId));
    if (existingPlayer) {
      const updatedPlayer = { ...existingPlayer, x, y };
      this.gameData.players.set(String(playerId), updatedPlayer);
    }
  }

  updatePlayerDied(playerId: number): void {
    const player = this.gameData.players.get(String(playerId));
    if (player) {
      player.alive = false;
      this.gameData.players.set(String(playerId), player);
    }
  }

  updatePlayerRevived(playerId: number, x: number, y: number): void {
    const player = this.gameData.players.get(String(playerId));
    console.log(`Player ${playerId} revived at (${x}, ${y}) ${player}`);
    if (player) {
      player.alive = true;
      player.x = x;
      player.y = y;
      this.gameData.players.set(String(playerId), player);
    }
  }

  addBomb(bomb: any): void {
    this.gameData.bombs.bombs.push(bomb);
  }

  removeBomb(bombId: number): void {
    this.gameData.bombs.bombs = this.gameData.bombs.bombs.filter(
      bomb => bomb.id !== bombId
    );
  }

  addExplosions(explosions: any): void {
    // Gắn tick_count hiện tại làm explosion_start_tick cho mỗi explosion
    const explosionsWithStartTick = explosions.map((exp: any) => ({
      ...exp,
      explosion_start_tick: this.gameData.tick_count
    }));
    this.gameData.bombs.explosions = this.gameData.bombs.explosions.concat(explosionsWithStartTick);
  }

  removeExplosion(x: number, y: number): void {
    this.gameData.bombs.explosions = this.gameData.bombs.explosions.filter(
      exp => !(exp.x === x && exp.y === y)
    );
  }

  /**
   * Compute the time remaining for an explosion.
   */
  getExplosionTimeRemaining(explosion: any): number {
    if (!explosion.explosion_start_tick) {
      // Fallback for legacy explosions without start tick
      return explosion.timer || 0;
    }

    const ticksElapsed = this.gameData.tick_count - explosion.explosion_start_tick;
    const timeRemaining = Math.max(0, CONFIG.EXPLOSION_TICKS - ticksElapsed);
    return timeRemaining;
  }

  cleanupExpiredExplosions(): void {
    const initialLength = this.gameData.bombs.explosions.length;
    this.gameData.bombs.explosions = this.gameData.bombs.explosions.filter(exp => {
      const timeRemaining = this.getExplosionTimeRemaining(exp);
      return timeRemaining > 0;
    });

    if (this.gameData.bombs.explosions.length < initialLength) {
      console.log(`GameStateManager cleaned up ${initialLength - this.gameData.bombs.explosions.length} expired explosions`);
    }
  }

  getAlivePlayers(): Player[] {
    if (!this.gameData.state) return [];
    return Object.values(this.gameData.state.players).filter(player => player.alive);
  }

  updatePlayerCount(): void {
    const alive = this.getAlivePlayers().length;

    if (this.gameData.countPlayerAlive !== 0 && alive < this.gameData.countPlayerAlive) {
      // Trigger death effect if available
      if (typeof (window as any).effectWhenDead === 'function') {
        (window as any).effectWhenDead();
      }
    }

    this.gameData.countPlayerAlive = alive || 0;
  }

  isGameOver(): boolean {
    return this.gameData.state?.game_over ?? false;
  }

  getWinnerId(): number | null {
    return this.gameData.state?.winner_id ?? null;
  }

  getWinnerName(): string {
    const winnerId = this.getWinnerId();
    if (!winnerId || !this.gameData.state) return '';

    const winnerPlayer = Object.values(this.gameData.state.players).find(
      p => p.id === winnerId
    );

    return winnerPlayer ? winnerPlayer.name : `Player ${winnerId}`;
  }
}
