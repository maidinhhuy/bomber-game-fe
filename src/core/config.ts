import type { GameConfig, Colors, Hero } from './types';

export const CONFIG: GameConfig = {
  BOARD_WIDTH: 41,
  BOARD_HEIGHT: 19,
  TILE_SIZE: 32,
  SPRITE_WIDTH: 235,
  SPRITE_HEIGHT: 275,
  MOVE_INTERVAL: 100,
  RECONNECT_DELAY: 3000,
  BLINK_THRESHOLD_FAST: 5,
  BLINK_THRESHOLD_NORMAL: 10,
  EXPLOSION_TICKS: 5,
  WS_URL: "ws://127.0.0.1:3030/ws"
};

export const COLORS: Colors = {
  empty: "#4CAF50",
  wall: "#607D8B",
  brick: "#B06F3D",
  player1: "#000000",
  player2: "#CC6CE7",
  player3: "#FE9900",
  bomb: "#212121",
  bombFuse: "#F44336",
  explosion: "#FF9800",
  explosionCore: "#FFC107"
};

export const BOMB_COLORS: string[] = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF6F91",
  "#845EC2", "#FFC75F", "#0081CF", "#C34A36", "#00C9A7",
  "#F9F871", "#FF9671", "#B39CD0", "#2C73D2", "#F67280"
];

export const HEROES: Hero[] = [
  { x: 0, y: 0 }, // Cow
  { x: 1, y: 0 }, // Monkey
  { x: 2, y: 0 }, // Raccoon
  { x: 3, y: 0 }, // Shark
  { x: 0, y: 1 }, // Penguin
  { x: 1, y: 1 }, // Pig
  { x: 2, y: 1 }, // Panda
  { x: 3, y: 1 }  // Chipmunk
];
