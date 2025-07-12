import type { GameData } from '../core';
import { BOMB_COLORS } from '../core';

export class Utils {
  static hexToRGBA(hex: string, alpha: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  static assignBombColor(playerId: number, gameData: GameData): string {
    if (!gameData.playerBombColors[playerId]) {
      gameData.playerBombColors[playerId] = BOMB_COLORS[gameData.nextColorIndex % BOMB_COLORS.length];
      gameData.nextColorIndex++;
    }
    return gameData.playerBombColors[playerId];
  }

  static calculateTimeLeft(reviveTick: number, currentTick: number): number {
    return Math.max(0, Math.ceil((reviveTick - currentTick) * 0.1));
  }

  static loadImage(src: string): HTMLImageElement {
    const img = new Image();
    img.src = src;
    return img;
  }

  static getTokenFromSession(): Number | null {
    const token = sessionStorage.getItem('token');
    if (token) {
      return parseInt(token);
    }
    // If no token is found, generate a new one with random numbers and store it
    
    const newToken = Math.round(Math.random() * 1000000);
    sessionStorage.setItem('token', newToken.toString());
    return newToken;
  }

  static adjustColorBrightness(color: string, factor: number): string {
    const hex = color.startsWith('#') ? color.slice(1) : color;
    const r = Math.min(255, Math.max(0, parseInt(hex.slice(0, 2), 16) * factor));
    const g = Math.min(255, Math.max(0, parseInt(hex.slice(2, 4), 16) * factor));
    const b = Math.min(255, Math.max(0, parseInt(hex.slice(4, 6), 16) * factor));
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }
}
