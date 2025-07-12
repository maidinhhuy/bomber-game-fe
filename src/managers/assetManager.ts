import type { Assets } from '../core';
import { Utils } from '../utils';

export class AssetManager {
  private static instance: AssetManager;
  public assets: Assets;

  private constructor() {
    this.assets = {
      tombstone: Utils.loadImage("/static/images/tombstone.png"),
      bomb: Utils.loadImage("/static/images/bomb.gif"), 
      sprite: Utils.loadImage("/static/images/heroes.png")
    };
    
    // Add error handling for missing images
    Object.values(this.assets).forEach(img => {
      img.onerror = () => {
        console.warn(`Failed to load image: ${img.src}`);
      };
    });
  }

  static getInstance(): AssetManager {
    if (!AssetManager.instance) {
      AssetManager.instance = new AssetManager();
    }
    return AssetManager.instance;
  }

  isImageLoaded(image: HTMLImageElement): boolean {
    return image.complete && image.naturalHeight !== 0;
  }

  areAllAssetsLoaded(): boolean {
    return Object.values(this.assets).every(asset => this.isImageLoaded(asset));
  }

  onAssetsLoaded(callback: () => void): void {
    const checkAssets = () => {
      if (this.areAllAssetsLoaded()) {
        callback();
      } else {
        setTimeout(checkAssets, 100);
      }
    };
    checkAssets();
  }
}
