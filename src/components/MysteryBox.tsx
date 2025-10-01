import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import mysteryBoxImage from "@/assets/mystery-box.jpg";

interface MysteryBoxProps {
  onOpen: () => void;
  isOpening?: boolean;
  price?: number;
}

export const MysteryBox = ({ onOpen, isOpening = false, price = 350 }: MysteryBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8 max-w-2xl mx-auto">
      <div
        className={`relative ${isOpening ? "animate-shake" : ""} ${isHovered ? "animate-float" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={mysteryBoxImage}
          alt="Mystery Box"
          className="w-full max-w-md rounded-2xl shadow-glow"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-20 rounded-2xl animate-pulse" />
      </div>
      
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Mystery Card Box
          </h2>
          <p className="text-2xl font-bold text-primary">{price} TONS</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm max-w-md mx-auto">
          <div className="space-y-1">
            <p className="text-muted-foreground">Legendary</p>
            <p className="font-bold text-legendary">0.5%</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Epic</p>
            <p className="font-bold text-epic">7%</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Rare</p>
            <p className="font-bold text-rare">30%</p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Common</p>
            <p className="font-bold text-common">62.5%</p>
          </div>
        </div>

        <Button
          size="lg"
          onClick={onOpen}
          disabled={isOpening}
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-bold text-lg px-8 py-6"
        >
          <Gift className="mr-2 h-5 w-5" />
          {isOpening ? "Opening..." : "Open Box"}
        </Button>
      </div>
    </div>
  );
};
