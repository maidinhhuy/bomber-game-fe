import './styles/style.css'
import './styles/game-styles.css'
import { BomberManGame } from './game'

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const game = new BomberManGame();
    await game.init();
  } catch (error) {
    console.error('Failed to start Bomber Man game:', error);
  }
});
