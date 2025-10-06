import { Card } from "@/components/ui/card";
import { RarityBadge } from "./RarityBadge";
import { resolveCardImage } from "@/lib/imageResolver";

interface PokemonCardProps {
  name: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  imageUrl: string;
  estimatedValue?: number;
  onClick?: () => void;
  showValue?: boolean;
}

export const PokemonCard = ({
  name,
  rarity,
  imageUrl,
  estimatedValue,
  onClick,
  showValue = false,
}: PokemonCardProps) => {
  return (
    <Card
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-glow bg-gradient-card border-border"
      onClick={onClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={resolveCardImage(imageUrl, rarity, name)}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-holographic opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer bg-[length:200%_100%]" />
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-foreground">{name}</h3>
          <RarityBadge rarity={rarity} />
        </div>
        {showValue && estimatedValue !== undefined && (
          <p className="text-sm text-muted-foreground">
            Est. Value: ⭐ {Math.round(estimatedValue * 33)} Stars
          </p>
        )}
      </div>
    </Card>
  );
};
