import type { GameData, GameEvent } from '../core';
import { CONFIG } from '../core';

export class InputHandler {
  private gameData: GameData;
  private sendGameEvent: (event: GameEvent) => void;

  constructor(gameData: GameData, sendGameEvent: (event: GameEvent) => void) {
    this.gameData = gameData;
    this.sendGameEvent = sendGameEvent;
  }

  init(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.gameData.state || this.gameData.state.game_over) return;

    if (e.repeat && Date.now() - this.gameData.lastMoveSendTime < CONFIG.MOVE_INTERVAL) {
      return;
    }

    const eventToSend = this.getEventForKey(e.key);
    
    if (eventToSend) {
      this.sendGameEvent(eventToSend);
      this.gameData.lastMoveSendTime = Date.now();
      
      if (e.key === " ") {
        e.preventDefault(); // Prevent scrolling on spacebar
      }
    }
  }

  private getEventForKey(key: string): GameEvent | null {
    const keyMap: Record<string, GameEvent> = {
      "ArrowUp": { Move: { dx: 0, dy: -1 } },
      "ArrowDown": { Move: { dx: 0, dy: 1 } },
      "ArrowLeft": { Move: { dx: -1, dy: 0 } },
      "ArrowRight": { Move: { dx: 1, dy: 0 } },
      " ": { PlaceBomb: null }
    };
    
    return keyMap[key] || null;
  }
}
