// Type definitions for Bomber Man game
export interface GameConfig {
  BOARD_WIDTH: number;
  BOARD_HEIGHT: number;
  TILE_SIZE: number;
  SPRITE_WIDTH: number;
  SPRITE_HEIGHT: number;
  MOVE_INTERVAL: number;
  RECONNECT_DELAY: number;
  BLINK_THRESHOLD_FAST: number;
  BLINK_THRESHOLD_NORMAL: number;
  EXPLOSION_TICKS: number;
  WS_URL: string;
}

export interface Colors {
  empty: string;
  wall: string;
  brick: string;
  player1: string;
  player2: string;
  player3: string;
  bomb: string;
  bombFuse: string;
  explosion: string;
  explosionCore: string;
}

export interface Hero {
  x: number;
  y: number;
}

export interface Player {
  id: number;
  name: string;
  x: number;
  y: number;
  alive: boolean;
  figure: number;
  kills: number;
  immortal_until_tick?: number;
}

export interface Bomb {
  id: number;
  x: number;
  y: number;
  fuse_timer: number;
  owner_id: number;
}

export interface Explosion {
  x: number;
  y: number;
  timer: number;
  explosion_start_tick?: number; // Tick khi explosion bắt đầu (để đồng bộ với server)
}

export interface Tombstone {
  x: number;
  y: number;
  player_name: string;
  revive_tick: number;
}

export interface GameState {
  players: Record<string, Player>;
  map: {
    board: string[][];
    width: number;
    height: number;
  };
  tick_count: number;
  game_over: boolean;
  winner_id: number | null;
  tombstones?: Tombstone[];
}

export interface GameData {
  tick_count: number;
  socket: WebSocket | null;
  state: GameState | null;
  players: Map<string, Player>;
  bombs: {
    bombs: Bomb[];
    explosions: Explosion[];
  };
  myName: string | null;
  myPlayerId: number | null;
  countPlayerAlive: number;
  lastMoveSendTime: number;
  playerBombColors: Record<number, string>;
  nextColorIndex: number;
}

export interface Assets {
  tombstone: HTMLImageElement;
  bomb: HTMLImageElement;
  sprite: HTMLImageElement;
}

export type GameEvent =
  | { Move: { dx: number; dy: number } }
  | { PlaceBomb: null }
  | { JoinGame: { name: string } }
  | { ResetGame: null };

export type ServerMessage =
  | number // Player ID
  | { GameMap: GameState }
  | { PlayerMoved: { player_id: number; x: number; y: number } }
  | { BombPlaced: { bomb: Bomb } }
  | { BombExploded: Explosion }
  | { Tick: { tick_count: number } }
  | { PlayerDied: { player_id: number } }
  | { PlayerRevived: { player_id: number; x: number; y: number } }
  | { Reconnect: { player_id: number, success: boolean } };
