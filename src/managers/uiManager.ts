import type { GameData } from '../core';
import { ScoreboardComponent } from '../ui';
import { GameStateManager } from './gameStateManager';

export class UIManager {
  private statusDiv: HTMLElement;
  private gameOverMessageDiv: HTMLElement;
  private scoreboard: ScoreboardComponent;
  private currentPlayerDiv: HTMLElement;
  private currentPlayerName: HTMLElement;
  private currentPlayerStatus: HTMLElement;
  private currentPlayerKills: HTMLElement;

  constructor() {
    this.statusDiv = document.getElementById("status")!;
    this.gameOverMessageDiv = document.getElementById("gameOverMessage")!;
    this.scoreboard = new ScoreboardComponent("scoreList");
    this.currentPlayerDiv = document.getElementById("currentPlayer")!;
    this.currentPlayerName = document.getElementById("currentPlayerName")!;
    this.currentPlayerStatus = document.getElementById("currentPlayerStatus")!;
    this.currentPlayerKills = document.getElementById("currentPlayerKills")!;
  }

  updateStatus(message: string, className: string): void {
    this.statusDiv.textContent = message;
    this.statusDiv.classList.remove("connected", "disconnected", "game-over");
    this.statusDiv.classList.add(className);
  }

  updateScoreboard(gameData: GameData): void {
    this.scoreboard.update(gameData);
  }

  showGameOverMessage(gameData: GameData, gameStateManager: GameStateManager, onPlayAgain: () => void): void {
    if (!gameStateManager.isGameOver()) return;

    this.updateStatus("", "game-over");
    let messageHtml = "";
    
    const winnerId = gameStateManager.getWinnerId();
    const winnerName = gameStateManager.getWinnerName();
    
    if (winnerId !== null && winnerId === gameData.myPlayerId) {
      messageHtml = `You won! <button id="playAgainButton">Play Again</button>`;
    } else if (winnerId !== null) {
      messageHtml = `${winnerName} won! <button id="playAgainButton">Play Again</button>`;
    } else {
      messageHtml = `Game Over! Draw. <button id="playAgainButton">Play Again</button>`;
    }
    
    this.gameOverMessageDiv.innerHTML = messageHtml;
    this.gameOverMessageDiv.style.display = "block";

    const playAgainButton = document.getElementById("playAgainButton") as HTMLButtonElement;
    if (playAgainButton) {
      playAgainButton.onclick = () => {
        onPlayAgain();
        playAgainButton.disabled = true;
        this.gameOverMessageDiv.textContent = "Resetting game...";
      };
    }
  }

  hideGameOverMessage(): void {
    this.gameOverMessageDiv.style.display = "none";
  }

  updateCurrentPlayer(gameData: GameData): void {
    if (!gameData.myPlayerId || !gameData.state) {
      this.currentPlayerDiv.style.display = "none";
      return;
    }

    const currentPlayer = Object.values(gameData.state.players).find(p => p.id === gameData.myPlayerId);
    if (!currentPlayer) {
      this.currentPlayerDiv.style.display = "none";
      return;
    }

    this.currentPlayerDiv.style.display = "block";
    this.currentPlayerName.textContent = currentPlayer.name || `Player ${currentPlayer.id}`;
    this.currentPlayerStatus.textContent = currentPlayer.alive ? "Alive" : "Dead";
    this.currentPlayerStatus.className = `player-status ${currentPlayer.alive ? "alive" : "dead"}`;
    this.currentPlayerKills.textContent = `Kills: ${currentPlayer.kills}`;
  }
}
