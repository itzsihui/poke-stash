import { useState, useEffect } from "react";
import { GachaMachine } from "@/components/GachaMachine";
import { PokemonCard } from "@/components/PokemonCard";
import { PaymentConfirmDialog } from "@/components/PaymentConfirmDialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useTelegramStars } from "@/hooks/useTelegramStars";
import { RecentDraws } from "@/components/RecentDraws";
import charizardImg from "@/assets/charizard.jpg";
import pikachuImg from "@/assets/pikachu.jpg";
import mewtwoImg from "@/assets/mewtwo.jpg";
import eeveeImg from "@/assets/eevee.jpg";
import gachaIcon from "@/assets/gacha-icon.png";

const Index = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [revealedCard, setRevealedCard] = useState<any>(null);
  const [normalBoxId, setNormalBoxId] = useState<string>("");
  const [premiumBoxId, setPremiumBoxId] = useState<string>("");
  const [isPremium, setIsPremium] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [pendingBoxId, setPendingBoxId] = useState<string>("");
  const { toast } = useToast();
  const { telegramId, isLoading } = useTelegramAuth();
  const { sendStarsPayment, starPrices } = useTelegramStars();

  useEffect(() => {
    fetchBoxes();
  }, [isPremium]);

  const fetchBoxes = async () => {
    const { data, error } = await supabase
      .from("boxes")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("Error fetching boxes:", error);
      return;
    }

    if (data) {
      const normalBox = data.find((box) => box.box_type === "normal");
      const premiumBox = data.find((box) => box.box_type === "premium");

      if (normalBox) setNormalBoxId(normalBox.id);
      if (premiumBox) setPremiumBoxId(premiumBox.id);
    }
  };

  const handleDrawCard = (boxId: string) => {
    if (!telegramId) {
      toast({
        title: "Error",
        description: "Telegram user not authenticated",
        variant: "destructive",
      });
      return;
    }

    // No need to check wallet connection for Telegram Stars

    setPendingBoxId(boxId);
    setShowPaymentDialog(true);
  };

  const handlePaymentConfirm = async () => {
    setShowPaymentDialog(false);
    
    try {
      // Determine gacha type based on box ID
      const gachaType = pendingBoxId === premiumBoxId ? "premium" : "normal";
      
      // Send Telegram Stars payment
      await sendStarsPayment(gachaType);
      
      // Proceed with card draw after successful payment
      await processCardDraw(pendingBoxId);
    } catch (error) {
      console.error("Payment failed:", error);
      // Error toast is already shown in useTelegramStars hook
    }
  };

  const processCardDraw = async (boxId: string) => {
    setIsDrawing(true);

    try {
      // Call the database function to draw a card
      const { data, error } = await supabase.rpc("draw_from_gacha", {
        p_box_id: boxId,
        p_telegram_id: telegramId,
      });

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("No cards available in this machine");
      }

      const drawnCard = data[0];

      // Map image URLs to imported images
      const imageMap: Record<string, string> = {
        "/placeholder.svg":
          drawnCard.card_rarity === "legendary"
            ? charizardImg
            : drawnCard.card_rarity === "epic"
            ? pikachuImg
            : drawnCard.card_rarity === "rare"
            ? mewtwoImg
            : eeveeImg,
      };

      // Simulate vending machine delay
      setTimeout(() => {
        setRevealedCard({
          id: drawnCard.card_id,
          name: drawnCard.card_name,
          rarity: drawnCard.card_rarity,
          image_url: imageMap[drawnCard.card_image] || drawnCard.card_image,
          estimated_value: drawnCard.card_value,
        });
        setIsDrawing(false);
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setIsDrawing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent flex items-center justify-center gap-4">
              <img src={gachaIcon} alt="Gacha" className="w-12 h-auto md:w-16 md:h-auto inline-block object-contain" />
              Gacha Machine
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Draw rare Pokémon cards from our gacha machines! Each machine has visible inventory and limited stock!
            </p>
            
            {/* Toggle Switch */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Label 
                htmlFor="gacha-toggle" 
                className={`text-lg font-semibold transition-colors cursor-pointer ${!isPremium ? 'text-primary' : 'text-muted-foreground'}`}
              >
                Normal Gacha
              </Label>
              <Switch
                id="gacha-toggle"
                checked={isPremium}
                onCheckedChange={setIsPremium}
                className="data-[state=checked]:bg-epic data-[state=unchecked]:bg-primary border-2 border-border"
              />
              <Label 
                htmlFor="gacha-toggle" 
                className={`text-lg font-semibold transition-colors cursor-pointer ${isPremium ? 'text-epic' : 'text-muted-foreground'}`}
              >
                Premium Gacha
              </Label>
            </div>
          </div>

          {/* Single Gacha Machine Display */}
          <div className="max-w-2xl mx-auto">
            {isPremium ? (
              premiumBoxId ? (
                <GachaMachine
                  boxId={premiumBoxId}
                  type="premium"
                  priceStars={starPrices.premium}
                  onDraw={() => handleDrawCard(premiumBoxId)}
                  isDrawing={isDrawing}
                />
              ) : (
                <Card className="bg-gradient-card border-border p-8">
                  <p className="text-center text-muted-foreground">
                    Premium box not found. Please contact admin.
                  </p>
                </Card>
              )
            ) : (
              normalBoxId ? (
                <GachaMachine
                  boxId={normalBoxId}
                  type="normal"
                  priceStars={starPrices.normal}
                  onDraw={() => handleDrawCard(normalBoxId)}
                  isDrawing={isDrawing}
                />
              ) : (
                <Card className="bg-gradient-card border-border p-8">
                  <p className="text-center text-muted-foreground">
                    Normal box not found. Please contact admin.
                  </p>
                </Card>
              )
            )}
          </div>

          {/* Recent Draws Section */}
          <div className="mt-12">
            <RecentDraws boxType={isPremium ? "premium" : "normal"} />
          </div>
        </div>
      </div>

      {/* Payment Confirmation Dialog */}
      <PaymentConfirmDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onConfirm={handlePaymentConfirm}
        gachaType={isPremium ? "premium" : "normal"}
        starsAmount={isPremium ? starPrices.premium : starPrices.normal}
      />

      {/* Card Reveal Dialog */}
      <Dialog open={!!revealedCard} onOpenChange={() => setRevealedCard(null)}>
        <DialogContent className="bg-gradient-card border-border max-w-md [&>button]:w-8 [&>button]:h-8 [&>button]:top-4 [&>button]:right-4">
          <div className="space-y-6 py-4">
            <div className="text-center space-y-2">
              <div className="text-6xl animate-drop">🎉</div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent animate-drop">
                You Got a Card!
              </h2>
              <p className="text-muted-foreground animate-fade-in">
                Added to your inventory
              </p>
            </div>
            {revealedCard && (
              <div className="animate-drop">
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
