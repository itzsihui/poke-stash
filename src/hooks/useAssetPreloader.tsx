import { useState, useEffect } from 'react';
import gachaVideo from '@/assets/gacha-video.mp4';
import legendaryVideo from '@/assets/legendary-video.mp4';
import charizardImg from '@/assets/charizard.jpg';
import eeveeImg from '@/assets/eevee.jpg';
import mewtwoImg from '@/assets/mewtwo.jpg';
import mysteryBoxImg from '@/assets/mystery-box.jpg';
import pikachuImg from '@/assets/pikachu.jpg';

interface PreloadProgress {
  loaded: number;
  total: number;
  isComplete: boolean;
}

export const useAssetPreloader = () => {
  const [progress, setProgress] = useState<PreloadProgress>({
    loaded: 0,
    total: 0,
    isComplete: false,
  });

  useEffect(() => {
    const assets = [
      { type: 'video', src: gachaVideo },
      { type: 'video', src: legendaryVideo },
      { type: 'image', src: charizardImg },
      { type: 'image', src: eeveeImg },
      { type: 'image', src: mewtwoImg },
      { type: 'image', src: mysteryBoxImg },
      { type: 'image', src: pikachuImg },
    ];

    setProgress(prev => ({ ...prev, total: assets.length }));

    const loadAsset = (asset: { type: string; src: string }) => {
      return new Promise((resolve, reject) => {
        if (asset.type === 'image') {
          const img = new Image();
          img.onload = () => resolve(asset.src);
          img.onerror = () => reject(new Error(`Failed to load image: ${asset.src}`));
          img.src = asset.src;
        } else if (asset.type === 'video') {
          const video = document.createElement('video');
          video.onloadeddata = () => resolve(asset.src);
          video.onerror = () => reject(new Error(`Failed to load video: ${asset.src}`));
          video.preload = 'auto';
          video.src = asset.src;
          video.load();
        }
      });
    };

    const loadAllAssets = async () => {
      let loadedCount = 0;

      for (const asset of assets) {
        try {
          await loadAsset(asset);
          loadedCount++;
          setProgress({
            loaded: loadedCount,
            total: assets.length,
            isComplete: loadedCount === assets.length,
          });
        } catch (error) {
          console.error('Error loading asset:', error);
          // Continue loading other assets even if one fails
          loadedCount++;
          setProgress({
            loaded: loadedCount,
            total: assets.length,
            isComplete: loadedCount === assets.length,
          });
        }
      }
    };

    loadAllAssets();
  }, []);

  return progress;
};
