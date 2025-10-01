import { Badge } from "@/components/ui/badge";

interface RarityBadgeProps {
  rarity: "legendary" | "epic" | "rare" | "common";
  className?: string;
}

const rarityStyles = {
  legendary: "bg-gradient-legendary text-black font-bold shadow-glow",
  epic: "bg-gradient-epic text-white font-bold",
  rare: "bg-gradient-rare text-white font-semibold",
  common: "bg-muted text-muted-foreground",
};

export const RarityBadge = ({ rarity, className }: RarityBadgeProps) => {
  return (
    <Badge className={`${rarityStyles[rarity]} ${className || ""}`}>
      {rarity.toUpperCase()}
    </Badge>
  );
};
