import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { MysteryBox } from "@/components/MysteryBox";
import { PokemonCard } from "@/components/PokemonCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import charizardImg from "@/assets/charizard.jpg";
import pikachuImg from "@/assets/pikachu.jpg";
import mewtwoImg from "@/assets/mewtwo.jpg";
import eeveeImg from "@/assets/eevee.jpg";

const Index = () => {
  const [isOpening, setIsOpening] = useState(false);
  const [revealedCard, setRevealedCard] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const handleOpenBox = async () => {
    setIsOpening(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get all cards
      const { data: cards, error: cardsError } = await supabase
        .from("cards")
        .select("*");

      if (cardsError) throw cardsError;

      // Get box configuration
      const { data: boxes, error: boxError } = await supabase
        .from("boxes")
        .select("*")
        .eq("active", true)
        .single();

      if (boxError) throw boxError;

      // Calculate random card based on rarity
      const rand = Math.random() * 100;
      let selectedRarity: "legendary" | "epic" | "rare" | "common";
      
      if (rand < boxes.legendary_odds) {
        selectedRarity = "legendary";
      } else if (rand < boxes.legendary_odds + boxes.epic_odds) {
        selectedRarity = "epic";
      } else if (rand < boxes.legendary_odds + boxes.epic_odds + boxes.rare_odds) {
        selectedRarity = "rare";
      } else {
        selectedRarity = "common";
      }

      const cardsOfRarity = cards?.filter(c => c.rarity === selectedRarity) || [];
      const randomCard = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];

      if (!randomCard) throw new Error("No cards available");

      // Add card to inventory
      const { error: inventoryError } = await supabase
        .from("inventory")
        .insert({
          user_id: user.id,
          card_id: randomCard.id,
        });

      if (inventoryError) throw inventoryError;

      // Record transaction
      const { error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          transaction_type: "box_purchase",
          amount: boxes.price,
          card_id: randomCard.id,
        });

      if (transactionError) throw transactionError;

      // Map image URLs to imported images
      const imageMap: Record<string, string> = {
        "/placeholder.svg": selectedRarity === "legendary" ? charizardImg :
                           selectedRarity === "epic" ? pikachuImg :
                           selectedRarity === "rare" ? mewtwoImg : eeveeImg
      };

      setTimeout(() => {
        setRevealedCard({
          ...randomCard,
          image_url: imageMap[randomCard.image_url] || randomCard.image_url
        });
        setIsOpening(false);
      }, 1500);

    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsOpening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Open Mystery Boxes
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Collect rare Pokémon cards with TON. Each box contains a mystery card with different rarities!
            </p>
          </div>

          <MysteryBox onOpen={handleOpenBox} isOpening={isOpening} />
        </div>
      </div>

      <Dialog open={!!revealedCard} onOpenChange={() => setRevealedCard(null)}>
        <DialogContent className="bg-gradient-card border-border max-w-md">
          <div className="space-y-4 py-4">
            <h2 className="text-3xl font-bold text-center bg-gradient-primary bg-clip-text text-transparent">
              You got a card!
            </h2>
            {revealedCard && (
              <div className="animate-flip">
                <PokemonCard
                  name={revealedCard.name}
                  rarity={revealedCard.rarity}
                  imageUrl={revealedCard.image_url}
                  estimatedValue={revealedCard.estimated_value}
                  showValue
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
