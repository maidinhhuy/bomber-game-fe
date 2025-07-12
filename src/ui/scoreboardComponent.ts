import type { GameData, Player } from '../core';

export class ScoreboardComponent {
  private scoreListElement: HTMLElement;

  constructor(scoreListId: string) {
    this.scoreListElement = document.getElementById(scoreListId)!;
    if (!this.scoreListElement) {
      throw new Error(`Scoreboard element with id '${scoreListId}' not found`);
    }
  }

  update(gameData: GameData): void {
    if (!gameData.state) return;

    this.scoreListElement.innerHTML = "";
    const sortedPlayers = this.getSortedPlayers(gameData.state.players);

    sortedPlayers.forEach((player) => {
      const scoreEntry = this.createScoreEntry(player, gameData.myPlayerId);
      this.scoreListElement.appendChild(scoreEntry);
    });
  }

  private getSortedPlayers(players: Record<string, Player>): Player[] {
    return Object.values(players).sort((a, b) => b.kills - a.kills);
  }

  private createScoreEntry(player: Player, currentPlayerId: number | null): HTMLElement {
    const scoreEntry = document.createElement("div");
    scoreEntry.classList.add("score-entry");

    const playerNameSpan = this.createPlayerNameSpan(player, currentPlayerId);
    const playerKillsSpan = this.createPlayerKillsSpan(player);

    scoreEntry.appendChild(playerNameSpan);
    scoreEntry.appendChild(playerKillsSpan);

    return scoreEntry;
  }

  private createPlayerNameSpan(player: Player, currentPlayerId: number | null): HTMLSpanElement {
    const playerNameSpan = document.createElement("span");
    playerNameSpan.textContent = player.name;
    
    if (player.id === currentPlayerId) {
      playerNameSpan.style.color = "#3498db";
      playerNameSpan.style.fontWeight = "bold";
    }
    
    return playerNameSpan;
  }

  private createPlayerKillsSpan(player: Player): HTMLSpanElement {
    const playerKillsSpan = document.createElement("span");
    playerKillsSpan.textContent = player.kills.toString();
    return playerKillsSpan;
  }
}
