import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PokemonCard } from "./PokemonCard";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Loader2 } from "lucide-react";
import gachaVideo from "@/assets/gacha-video.webm";
import legendaryVideo from "@/assets/legendary-video.webm";
import { resolveCardImage } from "@/lib/imageResolver";

interface GachaMachineCard {
  id: string;
  name: string;
  rarity: "legendary" | "epic" | "rare" | "common";
  image_url: string;
  estimated_value: number;
  quantity: number;
}

interface GachaMachineProps {
  boxId: string;
  type: "normal" | "premium";
  priceUSDT: number;
  onDraw: () => void;
  isDrawing: boolean;
}

export const GachaMachine = ({ boxId, type, priceUSDT, onDraw, isDrawing }: GachaMachineProps) => {
  const [cards, setCards] = useState<GachaMachineCard[]>([]);
  const [totalStock, setTotalStock] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Mock TON conversion rate (1 USDT = ~2 TON for example)
  const tonPrice = (priceUSDT * 2).toFixed(0);

  useEffect(() => {
    fetchMachineInventory();

    // Subscribe to real-time inventory updates
    const channel = supabase
      .channel(`machine-inventory-${boxId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'machine_inventory',
          filter: `box_id=eq.${boxId}`
        },
        () => {
          fetchMachineInventory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [boxId]);

  const fetchMachineInventory = async () => {
    const { data, error } = await supabase
      .from("machine_inventory")
      .select(`
        quantity,
        card_id,
        cards (
          id,
          name,
          rarity,
          image_url,
          estimated_value
        )
      `)
      .eq("box_id", boxId);

    if (error) {
      console.error("Error fetching machine inventory:", error);
      return;
    }

    if (data) {
      const machineCards = data
        .filter((item: any) => item.cards && item.quantity > 0)
        .map((item: any) => ({
          id: item.cards.id,
          name: item.cards.name,
          rarity: item.cards.rarity,
          image_url: item.cards.image_url,
          estimated_value: item.cards.estimated_value,
          quantity: item.quantity,
        }));

      setCards(machineCards);
      setTotalStock(machineCards.reduce((acc: number, card: GachaMachineCard) => acc + (card.quantity || 0), 0));
    }
  };

  return (
    <Card 
      className={`relative overflow-hidden bg-gradient-card border-2 transition-all duration-500 ${
        type === "premium" ? "border-epic" : "border-primary"
      } ${
        isDrawing ? "animate-shake animate-border-glow" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Machine Header */}
      <div className={`p-6 text-center border-b-2 relative overflow-hidden ${
        type === "premium" ? "border-epic bg-epic/10" : "border-primary bg-primary/10"
      }`}>
        {/* Animated background glow */}
        {isDrawing && (
          <div className="absolute inset-0 bg-gradient-primary opacity-50 animate-shimmer bg-[length:200%_100%]" />
        )}
        <h2 className={`text-3xl font-bold mb-2 relative z-10 ${
          type === "premium" ? "text-epic" : "text-primary"
        }`}>
          {type === "premium" ? "💎 Premium" : "⭐ Normal"} Gacha
        </h2>
        <div className="space-y-1 relative z-10">
          <p className="text-2xl font-bold">{priceUSDT} USDT</p>
          <p className="text-lg text-muted-foreground">≈ {tonPrice} TON</p>
          <p className="text-sm text-muted-foreground">
            <span className={totalStock < 10 ? "text-destructive font-bold animate-pulse" : ""}>
              {totalStock} cards remaining
            </span>
          </p>
        </div>
      </div>

      {/* Machine Video + Grid */}
      <div className="p-6 relative">
        {/* Video showcase - Full width, proper aspect ratio */}
        <div className="mb-6 rounded-lg overflow-hidden border-2 border-border shadow-glow bg-background">
          <video
            key={type}
            src={type === "premium" ? legendaryVideo : gachaVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-auto"
            style={{ maxHeight: '600px', objectFit: 'contain' }}
            title={type === "premium" ? "Premium Gacha Machine" : "Normal Gacha Machine"}
          />
        </div>
        {/* Animated glow overlay when drawing */}
        {isDrawing && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-primary opacity-30 animate-pulse" />
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer bg-[length:200%_100%]" />
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-shimmer bg-[length:200%_100%]" />
          </div>
        )}
        
        {/* Section Title */}
        <h3 className="text-xl font-bold text-center mb-4 text-foreground">
          Loaded in the gacha machine
        </h3>
        
        {/* Cards Grid - Improved display matching reference UI */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-6 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-background/50 p-2">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="relative group">
                <div className={`aspect-[2.5/3.5] rounded-lg overflow-hidden bg-card border-2 ${
                  card.rarity === 'legendary' ? 'border-legendary' :
                  card.rarity === 'epic' ? 'border-epic' :
                  card.rarity === 'rare' ? 'border-rare' :
                  'border-border'
                } relative transition-all duration-300 ${
                  isHovered ? "hover:scale-105 hover:shadow-glow hover:z-10" : ""
                }`}>
                  <img
                    src={resolveCardImage(card.image_url, card.rarity, card.name)}
                    alt={card.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />
                  <div className="absolute inset-0 bg-holographic opacity-0 group-hover:opacity-30 transition-opacity duration-300 animate-shimmer bg-[length:200%_100%]" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-2">
                    <p className="text-[10px] sm:text-xs font-bold truncate leading-tight">{card.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className={`text-[10px] sm:text-xs font-semibold ${
                        card.quantity < 3 ? "text-destructive animate-pulse" : "text-muted-foreground"
                      }`}>
                        ×{card.quantity}
                      </p>
                      {card.estimated_value > 0 && (
                        <p className="text-[10px] sm:text-xs font-bold text-primary">
                          ${card.estimated_value}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2.5/3.5] rounded-lg border-2 border-border bg-card/30 animate-pulse" />
            ))
          )}
        </div>

        {/* Draw Button */}
        <Button
          size="lg"
          onClick={onDraw}
          disabled={isDrawing}
          className={`w-full font-bold text-lg py-6 transition-all duration-300 relative overflow-hidden ${
            type === "premium"
              ? "bg-gradient-to-r from-epic to-legendary hover:opacity-90"
              : "bg-gradient-primary hover:opacity-90"
          } text-primary-foreground ${
            isDrawing ? "animate-pulse" : isHovered ? "shadow-glow animate-glow-pulse" : ""
          }`}
        >
          {/* Button shimmer effect */}
          {!isDrawing && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer bg-[length:200%_100%]" />
          )}
          {isDrawing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Drawing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Draw Card
            </>
          )}
        </Button>
      </div>

      {/* Machine lights animation - top and bottom */}
      {isDrawing && (
        <>
          <div className="absolute top-0 left-0 right-0 h-3 overflow-hidden">
            <div className="h-full flex gap-2">
              <div className="flex-1 bg-primary animate-pulse" style={{ animationDelay: "0s" }} />
              <div className="flex-1 bg-epic animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="flex-1 bg-legendary animate-pulse" style={{ animationDelay: "0.4s" }} />
              <div className="flex-1 bg-epic animate-pulse" style={{ animationDelay: "0.6s" }} />
              <div className="flex-1 bg-primary animate-pulse" style={{ animationDelay: "0.8s" }} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-3 overflow-hidden">
            <div className="h-full flex gap-2">
              <div className="flex-1 bg-legendary animate-pulse" style={{ animationDelay: "0.8s" }} />
              <div className="flex-1 bg-epic animate-pulse" style={{ animationDelay: "0.6s" }} />
              <div className="flex-1 bg-primary animate-pulse" style={{ animationDelay: "0.4s" }} />
              <div className="flex-1 bg-epic animate-pulse" style={{ animationDelay: "0.2s" }} />
              <div className="flex-1 bg-legendary animate-pulse" style={{ animationDelay: "0s" }} />
            </div>
          </div>
        </>
      )}
    </Card>
  );
};
