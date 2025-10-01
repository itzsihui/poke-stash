import { useAssetPreloader } from '@/hooks/useAssetPreloader';
import { Progress } from '@/components/ui/progress';
import gachaIcon from '@/assets/gacha-icon.png';

interface AssetPreloaderProps {
  onComplete: () => void;
}

export const AssetPreloader = ({ onComplete }: AssetPreloaderProps) => {
  const progress = useAssetPreloader();

  // Trigger onComplete when loading is done
  if (progress.isComplete && onComplete) {
    setTimeout(onComplete, 300); // Small delay for smooth transition
  }

  const percentage = progress.total > 0 
    ? Math.round((progress.loaded / progress.total) * 100) 
    : 0;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="max-w-md w-full px-8 space-y-8">
        {/* Logo/Icon */}
        <div className="text-center space-y-4">
          <img 
            src={gachaIcon} 
            alt="Gacha Machine" 
            className="w-32 h-auto mx-auto animate-float object-contain"
          />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Gacha Machine
          </h1>
          <p className="text-muted-foreground">
            Loading assets...
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{progress.loaded} / {progress.total} assets</span>
            <span>{percentage}%</span>
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
