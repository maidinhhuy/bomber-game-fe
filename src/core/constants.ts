// Game constants
export const GAME_CONSTANTS = {
  // UI Classes
  CSS_CLASSES: {
    CONNECTED: 'connected',
    DISCONNECTED: 'disconnected',
    GAME_OVER: 'game-over',
    SCORE_ENTRY: 'score-entry',
    GAME_CANVAS: 'game-canvas'
  },

  // DOM Element IDs
  ELEMENT_IDS: {
    GAME_CANVAS: 'gameCanvas',
    STATUS: 'status',
    GAME_OVER_MESSAGE: 'gameOverMessage',
    SCORE_LIST: 'scoreList',
    PLAY_AGAIN_BUTTON: 'playAgainButton'
  },

  // Game States
  TILE_TYPES: {
    EMPTY: 'Empty',
    WALL: 'Wall', 
    BRICK: 'Brick'
  },

  // Player States
  PLAYER_HIGHLIGHT_COLOR: '#3498db',
  IMMORTAL_BORDER_COLOR: '#00FFFF',
  CURRENT_PLAYER_BORDER_COLOR: '#FFFFFF'
} as const;
