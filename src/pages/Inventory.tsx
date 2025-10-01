import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PokemonCard } from "@/components/PokemonCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface InventoryCard {
  id: string;
  card_id: string;
  acquired_at: string;
  cards: {
    name: string;
    rarity: "legendary" | "epic" | "rare" | "common";
    image_url: string;
    estimated_value: number;
    physical_available: boolean;
  };
}

const Inventory = () => {
  const [inventory, setInventory] = useState<InventoryCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<InventoryCard | null>(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchInventory();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          id,
          card_id,
          acquired_at,
          cards (
            name,
            rarity,
            image_url,
            estimated_value,
            physical_available
          )
        `)
        .order("acquired_at", { ascending: false });

      if (error) throw error;
      setInventory(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedCard || !shippingAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("redemptions").insert({
        user_id: user.id,
        card_id: selectedCard.card_id,
        inventory_id: selectedCard.id,
        shipping_address: shippingAddress,
        delivery_fee: 75,
      });

      if (error) throw error;

      toast({
        title: "Redemption requested!",
        description: "Your card will be shipped soon. Delivery fee: 75 TONS",
      });
      setSelectedCard(null);
      setShippingAddress("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
              Your Collection
            </h1>
            <p className="text-muted-foreground">
              Total Cards: {inventory.length}
            </p>
          </div>

          {inventory.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Your collection is empty</p>
              <Button onClick={() => navigate("/")} className="bg-gradient-primary">
                Open Your First Box
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {inventory.map((item) => (
                <PokemonCard
                  key={item.id}
                  name={item.cards.name}
                  rarity={item.cards.rarity}
                  imageUrl={item.cards.image_url}
                  estimatedValue={item.cards.estimated_value}
                  showValue
                  onClick={() => item.cards.physical_available && setSelectedCard(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Redeem Physical Card</DialogTitle>
            <DialogDescription>
              Request delivery of {selectedCard?.cards.name}. Delivery fee: 75 TONS
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Input
                id="address"
                placeholder="Enter your full shipping address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <Button
              onClick={handleRedeem}
              className="w-full bg-gradient-primary hover:opacity-90"
            >
              Confirm Redemption
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;
