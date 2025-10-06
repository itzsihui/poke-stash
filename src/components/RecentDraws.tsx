import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { resolveCardImage } from "@/lib/imageResolver";
import { formatDistanceToNow } from "date-fns";

interface RecentDraw {
  id: string;
  card_name: string;
  card_rarity: "legendary" | "epic" | "rare" | "common";
  card_image: string;
  card_value: number;
  telegram_id: string;
  acquired_at: string;
}

interface RecentDrawsProps {
  boxType: "normal" | "premium";
}

export const RecentDraws = ({ boxType }: RecentDrawsProps) => {
  const [recentDraws, setRecentDraws] = useState<RecentDraw[]>([]);

  useEffect(() => {
    fetchRecentDraws();
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      fetchRecentDraws();
    }, 30000);
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel(`recent-draws-${boxType}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'inventory'
        },
        () => {
          fetchRecentDraws();
        }
      )
      .subscribe();

    return () => {
      clearInterval(refreshInterval);
      supabase.removeChannel(channel);
    };
  }, [boxType]);

  const fetchRecentDraws = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select(`
        id,
        telegram_id,
        acquired_at,
        cards!inner (
          name,
          rarity,
          image_url,
          estimated_value,
          box_type
        )
      `)
      .eq("cards.box_type", boxType)
      .order("acquired_at", { ascending: false })
      .limit(12);

    if (error) {
      console.error("Error fetching recent draws:", error);
      return;
    }

    if (data) {
      const draws = data
        .filter((item: any) => item.cards)
        .map((item: any) => ({
          id: item.id,
          card_name: item.cards.name,
          card_rarity: item.cards.rarity,
          card_image: item.cards.image_url,
          card_value: item.cards.estimated_value,
          telegram_id: item.telegram_id,
          acquired_at: item.acquired_at,
        }));

      setRecentDraws(draws);
    }
  };

  const truncateId = (id: string) => {
    if (id.length <= 10) return id;
    return `${id.slice(0, 6)}...${id.slice(-3)}`;
  };

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const convertToStars = (usdValue: number) => {
    // Convert USD to Stars (approximate rate: 1 USD ≈ 33 Stars)
    return (usdValue * 33).toFixed(0);
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Recent {boxType === "premium" ? "Premium" : "Normal"} Draws
        </h2>
        <p className="text-muted-foreground mt-2">
          See what others are pulling from the {boxType} gacha!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {recentDraws.length > 0 ? (
          recentDraws.map((draw) => (
            <Card
              key={draw.id}
              className={`bg-gradient-card border-2 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-glow ${
                draw.card_rarity === 'legendary' ? 'border-legendary' :
                draw.card_rarity === 'epic' ? 'border-epic' :
                draw.card_rarity === 'rare' ? 'border-rare' :
                'border-border'
              }`}
            >
              <div className="aspect-[2.5/3.5] relative overflow-hidden">
                <img
                  src={resolveCardImage(draw.card_image, draw.card_rarity, draw.card_name)}
                  alt={draw.card_name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </div>
              
              <div className="p-3 space-y-2">
                <h3 className="text-xs font-bold line-clamp-2 leading-tight min-h-[2.5rem]">
                  {draw.card_name}
                </h3>
                
                <div className="space-y-1">
                  <p className="text-[10px] text-muted-foreground">Opened by</p>
                  <p className="text-xs font-mono font-semibold text-primary">
                    {truncateId(draw.telegram_id)}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground">
                    {getTimeAgo(draw.acquired_at)}
                  </p>
                  <p className="text-xs font-bold text-primary">
                    ⭐ {convertToStars(draw.card_value)} Stars
                  </p>
                </div>
              </div>
            </Card>
          ))
        ) : (
          Array.from({ length: 12 }).map((_, i) => (
            <Card key={i} className="bg-gradient-card border-border overflow-hidden">
              <div className="aspect-[2.5/3.5] bg-card/30 animate-pulse" />
              <div className="p-3 space-y-2">
                <div className="h-8 bg-card/30 animate-pulse rounded" />
                <div className="h-4 bg-card/30 animate-pulse rounded" />
                <div className="h-4 bg-card/30 animate-pulse rounded w-2/3" />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
