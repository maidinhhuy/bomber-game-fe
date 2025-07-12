import { CONFIG, COLORS } from '../core';

export class PatternGenerator {
  static createBrickPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = CONFIG.TILE_SIZE;
    patternCanvas.height = CONFIG.TILE_SIZE;
    const pCtx = patternCanvas.getContext("2d");
    
    if (!pCtx) return null;

    pCtx.fillStyle = COLORS.brick;
    pCtx.fillRect(0, 0, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    pCtx.strokeStyle = "#8D5B31";
    pCtx.lineWidth = 2;
    pCtx.beginPath();
    pCtx.moveTo(0, CONFIG.TILE_SIZE / 3);
    pCtx.lineTo(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE / 3);
    pCtx.moveTo(0, 2 * CONFIG.TILE_SIZE / 3);
    pCtx.lineTo(CONFIG.TILE_SIZE, 2 * CONFIG.TILE_SIZE / 3);
    pCtx.moveTo(CONFIG.TILE_SIZE / 2, 0);
    pCtx.lineTo(CONFIG.TILE_SIZE / 2, CONFIG.TILE_SIZE / 3);
    pCtx.moveTo(CONFIG.TILE_SIZE / 2, 2 * CONFIG.TILE_SIZE / 3);
    pCtx.lineTo(CONFIG.TILE_SIZE / 2, CONFIG.TILE_SIZE);
    pCtx.stroke();
    
    return ctx.createPattern(patternCanvas, "repeat");
  }

  static createWallPattern(ctx: CanvasRenderingContext2D): CanvasPattern | null {
    const patternCanvas = document.createElement("canvas");
    patternCanvas.width = CONFIG.TILE_SIZE;
    patternCanvas.height = CONFIG.TILE_SIZE;
    const pCtx = patternCanvas.getContext("2d");
    
    if (!pCtx) return null;

    pCtx.fillStyle = COLORS.wall;
    pCtx.fillRect(0, 0, CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
    pCtx.strokeStyle = "#455A64";
    pCtx.lineWidth = 3;
    pCtx.beginPath();
    pCtx.moveTo(0, CONFIG.TILE_SIZE / 2);
    pCtx.lineTo(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE / 2);
    pCtx.moveTo(CONFIG.TILE_SIZE / 2, 0);
    pCtx.lineTo(CONFIG.TILE_SIZE / 2, CONFIG.TILE_SIZE);
    pCtx.stroke();
    
    return ctx.createPattern(patternCanvas, "repeat");
  }
}
