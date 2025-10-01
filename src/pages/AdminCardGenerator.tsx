import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const AdminCardGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Pokemon card data with realistic names
  const normalCards = [
    // Legendary (1)
    { name: "1999 #4 Charizard-Holo PSA 10", rarity: "legendary", value: 5000 },
    // Epic (9)
    { name: "2016 #208 Poncho-Wearing Pikachu PSA 9", rarity: "epic", value: 800 },
    { name: "2005 #107 Rayquaza-Holo PSA 8", rarity: "epic", value: 650 },
    { name: "2003 Skyridge Umbreon-Holo PSA 9", rarity: "epic", value: 750 },
    { name: "2002 Expedition Feraligatr-Holo PSA 8", rarity: "epic", value: 600 },
    { name: "2021 Evolving Skies Sylveon VMAX PSA 10", rarity: "epic", value: 700 },
    { name: "2022 Lost Origin Giratina V Alt Art PSA 9", rarity: "epic", value: 850 },
    { name: "2020 Vivid Voltage Pikachu VMAX PSA 10", rarity: "epic", value: 680 },
    { name: "2019 Cosmic Eclipse Solgaleo & Lunala GX PSA 9", rarity: "epic", value: 620 },
    { name: "2023 Scarlet & Violet Meowscarada ex PSA 10", rarity: "epic", value: 580 },
    // Rare (20)
    { name: "2021 Fusion Strike Mew V PSA 9", rarity: "rare", value: 120 },
    { name: "2020 Champion's Path Charizard V PSA 9", rarity: "rare", value: 180 },
    { name: "2022 Brilliant Stars Arceus V PSA 10", rarity: "rare", value: 95 },
    { name: "2019 Team Up Jirachi PSA 9", rarity: "rare", value: 75 },
    { name: "2021 Chilling Reign Shadow Rider Calyrex V", rarity: "rare", value: 85 },
    { name: "2020 Darkness Ablaze Eternatus VMAX", rarity: "rare", value: 110 },
    { name: "2022 Astral Radiance Palkia V", rarity: "rare", value: 90 },
    { name: "2023 Obsidian Flames Charizard ex", rarity: "rare", value: 125 },
    { name: "2021 Battle Styles Urshifu VMAX", rarity: "rare", value: 100 },
    { name: "2020 Rebel Clash Toxtricity VMAX", rarity: "rare", value: 70 },
    { name: "2022 Pokemon Go Mewtwo V", rarity: "rare", value: 95 },
    { name: "2019 Unified Minds Mega Sableye & Tyranitar GX", rarity: "rare", value: 115 },
    { name: "2021 Evolving Skies Rayquaza VMAX", rarity: "rare", value: 135 },
    { name: "2020 Vivid Voltage Ditto V", rarity: "rare", value: 80 },
    { name: "2022 Silver Tempest Lugia V", rarity: "rare", value: 105 },
    { name: "2023 Paldea Evolved Iono Full Art", rarity: "rare", value: 90 },
    { name: "2019 Cosmic Eclipse Reshiram & Zekrom GX", rarity: "rare", value: 120 },
    { name: "2021 Fusion Strike Genesect V", rarity: "rare", value: 75 },
    { name: "2020 Sword & Shield Zacian V", rarity: "rare", value: 85 },
    { name: "2022 Crown Zenith Mewtwo VSTAR", rarity: "rare", value: 110 },
    // Common (70)
    { name: "2021 Evolving Skies Eevee", rarity: "common", value: 5 },
    { name: "2020 Champion's Path Drednaw", rarity: "common", value: 4 },
    { name: "2022 Brilliant Stars Bidoof", rarity: "common", value: 3 },
    { name: "2019 Team Up Pikachu", rarity: "common", value: 6 },
    { name: "2021 Chilling Reign Sobble", rarity: "common", value: 4 },
    { name: "2020 Darkness Ablaze Scorbunny", rarity: "common", value: 5 },
    { name: "2022 Astral Radiance Rowlet", rarity: "common", value: 4 },
    { name: "2023 Obsidian Flames Charmander", rarity: "common", value: 6 },
    { name: "2021 Battle Styles Riolu", rarity: "common", value: 5 },
    { name: "2020 Rebel Clash Natu", rarity: "common", value: 3 },
    { name: "SWSH Lost Origin Booster Pack", rarity: "common", value: 8 },
    { name: "2019 Unified Minds Vulpix", rarity: "common", value: 4 },
    { name: "2021 Fusion Strike Bulbasaur", rarity: "common", value: 5 },
    { name: "2020 Vivid Voltage Jigglypuff", rarity: "common", value: 4 },
    { name: "2022 Silver Tempest Spheal", rarity: "common", value: 3 },
    { name: "2023 Paldea Evolved Sprigatito", rarity: "common", value: 6 },
    { name: "2019 Cosmic Eclipse Solrock", rarity: "common", value: 3 },
    { name: "2021 Chilling Reign Tornadus", rarity: "common", value: 5 },
    { name: "2020 Sword & Shield Wooloo", rarity: "common", value: 4 },
    { name: "2022 Crown Zenith Ralts", rarity: "common", value: 4 },
    { name: "2021 Evolving Skies Vaporeon", rarity: "common", value: 7 },
    { name: "2020 Champion's Path Venusaur", rarity: "common", value: 6 },
    { name: "2022 Brilliant Stars Munchlax", rarity: "common", value: 5 },
    { name: "2019 Team Up Meowth", rarity: "common", value: 4 },
    { name: "2021 Battle Styles Hitmonchan", rarity: "common", value: 5 },
    { name: "2020 Darkness Ablaze Grookey", rarity: "common", value: 4 },
    { name: "2022 Astral Radiance Piplup", rarity: "common", value: 5 },
    { name: "2023 Obsidian Flames Squirtle", rarity: "common", value: 6 },
    { name: "2021 Fusion Strike Chikorita", rarity: "common", value: 4 },
    { name: "2020 Rebel Clash Caterpie", rarity: "common", value: 3 },
    { name: "SWSH Fusion Strike Booster Pack", rarity: "common", value: 7 },
    { name: "2019 Unified Minds Oddish", rarity: "common", value: 3 },
    { name: "2021 Chilling Reign Eiscue", rarity: "common", value: 4 },
    { name: "2020 Vivid Voltage Clefairy", rarity: "common", value: 5 },
    { name: "2022 Silver Tempest Snorunt", rarity: "common", value: 3 },
    { name: "2023 Paldea Evolved Fuecoco", rarity: "common", value: 6 },
    { name: "2019 Cosmic Eclipse Lunatone", rarity: "common", value: 3 },
    { name: "2021 Battle Styles Machop", rarity: "common", value: 4 },
    { name: "2020 Sword & Shield Skwovet", rarity: "common", value: 3 },
    { name: "2022 Crown Zenith Kirlia", rarity: "common", value: 4 },
    { name: "2021 Evolving Skies Jolteon", rarity: "common", value: 7 },
    { name: "2020 Champion's Path Blastoise", rarity: "common", value: 6 },
    { name: "2022 Brilliant Stars Snorlax", rarity: "common", value: 8 },
    { name: "2019 Team Up Psyduck", rarity: "common", value: 4 },
    { name: "2021 Fusion Strike Cyndaquil", rarity: "common", value: 5 },
    { name: "2020 Darkness Ablaze Cinderace", rarity: "common", value: 6 },
    { name: "2022 Astral Radiance Turtwig", rarity: "common", value: 4 },
    { name: "2023 Obsidian Flames Wartortle", rarity: "common", value: 5 },
    { name: "2021 Chilling Reign Articuno", rarity: "common", value: 6 },
    { name: "2020 Rebel Clash Weedle", rarity: "common", value: 3 },
    { name: "SWSH Brilliant Stars Booster Pack", rarity: "common", value: 7 },
    { name: "2019 Unified Minds Bellsprout", rarity: "common", value: 3 },
    { name: "2021 Battle Styles Hitmonlee", rarity: "common", value: 4 },
    { name: "2020 Vivid Voltage Togepi", rarity: "common", value: 5 },
    { name: "2022 Silver Tempest Bergmite", rarity: "common", value: 3 },
    { name: "2023 Paldea Evolved Quaxly", rarity: "common", value: 6 },
    { name: "2019 Cosmic Eclipse Baltoy", rarity: "common", value: 3 },
    { name: "2021 Fusion Strike Totodile", rarity: "common", value: 4 },
    { name: "2020 Sword & Shield Nickit", rarity: "common", value: 3 },
    { name: "2022 Crown Zenith Gardevoir", rarity: "common", value: 7 },
    { name: "2021 Evolving Skies Flareon", rarity: "common", value: 7 },
    { name: "2020 Champion's Path Hatterene V", rarity: "common", value: 8 },
    { name: "2022 Brilliant Stars Bibarel", rarity: "common", value: 6 },
    { name: "2019 Team Up Golduck", rarity: "common", value: 5 },
    { name: "2021 Chilling Reign Zapdos", rarity: "common", value: 6 },
    { name: "2020 Darkness Ablaze Inteleon", rarity: "common", value: 7 },
    { name: "2022 Astral Radiance Chimchar", rarity: "common", value: 4 },
    { name: "2023 Obsidian Flames Charmeleon", rarity: "common", value: 5 },
    { name: "2021 Battle Styles Falinks", rarity: "common", value: 4 },
    { name: "2020 Rebel Clash Kakuna", rarity: "common", value: 3 },
  ];

  const premiumCards = [
    // Legendary (1)
    { name: "Pikachu Illustrator PSA 10", rarity: "legendary", value: 50000 },
    // Epic (9)
    { name: "1999 #6 Charizard-Holo 1st Edition PSA 10", rarity: "epic", value: 12000 },
    { name: "2001 #6 Kabutops-Holo 1st Edition PSA 10", rarity: "epic", value: 8500 },
    { name: "1999 Blastoise-Holo PSA 10", rarity: "epic", value: 7200 },
    { name: "2000 Neo Genesis Lugia-Holo PSA 10", rarity: "epic", value: 9800 },
    { name: "2003 Skyridge Charizard-Holo PSA 9", rarity: "epic", value: 10500 },
    { name: "1999 Mewtwo-Holo Shadowless PSA 10", rarity: "epic", value: 8900 },
    { name: "2016 Evolutions Charizard-Holo PSA 10", rarity: "epic", value: 6800 },
    { name: "2002 Legendary Collection Charizard PSA 10", rarity: "epic", value: 11200 },
    { name: "1999 Venusaur-Holo 1st Edition PSA 9", rarity: "epic", value: 7500 },
    // Rare (20)
    { name: "2022 Pokemon Go Charizard V Alt Art PSA 10", rarity: "rare", value: 450 },
    { name: "2021 Celebrations Charizard", rarity: "rare", value: 380 },
    { name: "2020 Hidden Fates Shiny Charizard GX PSA 10", rarity: "rare", value: 520 },
    { name: "2019 Detective Pikachu Charizard GX", rarity: "rare", value: 420 },
    { name: "2021 Shining Fates Shiny Ditto VMAX", rarity: "rare", value: 350 },
    { name: "2020 Champion's Path Shiny Charizard V", rarity: "rare", value: 480 },
    { name: "2022 Brilliant Stars Charizard V Alt Art", rarity: "rare", value: 460 },
    { name: "2019 Cosmic Eclipse Pikachu & Zekrom GX Rainbow", rarity: "rare", value: 390 },
    { name: "2021 Evolving Skies Umbreon VMAX Alt Art", rarity: "rare", value: 550 },
    { name: "2020 Vivid Voltage Amazing Rare Rayquaza", rarity: "rare", value: 320 },
    { name: "2022 Lost Origin Giratina VSTAR Gold", rarity: "rare", value: 410 },
    { name: "2019 Team Up Pikachu & Zekrom GX", rarity: "rare", value: 370 },
    { name: "2021 Fusion Strike Mew VMAX Alt Art", rarity: "rare", value: 490 },
    { name: "2020 Darkness Ablaze Charizard VMAX Rainbow", rarity: "rare", value: 530 },
    { name: "2022 Astral Radiance Machamp V Alt Art", rarity: "rare", value: 340 },
    { name: "2023 Scarlet & Violet Miraidon ex Gold", rarity: "rare", value: 380 },
    { name: "2019 Unified Minds Mewtwo & Mew GX Rainbow", rarity: "rare", value: 420 },
    { name: "2021 Chilling Reign Ice Rider Calyrex VMAX Alt Art", rarity: "rare", value: 360 },
    { name: "2020 Rebel Clash Boss's Orders Full Art", rarity: "rare", value: 310 },
    { name: "2022 Crown Zenith Lugia VSTAR Gold", rarity: "rare", value: 440 },
    // Common (70)
    { name: "2021 Celebrations Blastoise", rarity: "common", value: 25 },
    { name: "2020 Hidden Fates Mewtwo GX", rarity: "common", value: 30 },
    { name: "2022 Brilliant Stars Arceus VSTAR", rarity: "common", value: 35 },
    { name: "2019 Team Up Latios & Latias GX", rarity: "common", value: 28 },
    { name: "2021 Shining Fates Shiny Ditto V", rarity: "common", value: 22 },
    { name: "2020 Champion's Path Gardevoir VMAX", rarity: "common", value: 32 },
    { name: "2022 Astral Radiance Dialga VSTAR", rarity: "common", value: 38 },
    { name: "2023 Scarlet & Violet Koraidon ex", rarity: "common", value: 40 },
    { name: "2021 Battle Styles Empoleon V", rarity: "common", value: 26 },
    { name: "2020 Rebel Clash Dragapult VMAX", rarity: "common", value: 29 },
    { name: "SWSH Crown Zenith Elite Trainer Box", rarity: "common", value: 45 },
    { name: "2019 Unified Minds Dragonite GX", rarity: "common", value: 27 },
    { name: "2021 Fusion Strike Espeon V", rarity: "common", value: 24 },
    { name: "2020 Vivid Voltage Celebi Amazing Rare", rarity: "common", value: 33 },
    { name: "2022 Silver Tempest Regidrago VSTAR", rarity: "common", value: 31 },
    { name: "2023 Paldea Evolved Lechonk", rarity: "common", value: 18 },
    { name: "2019 Cosmic Eclipse Solgaleo GX", rarity: "common", value: 29 },
    { name: "2021 Chilling Reign Tornadus V", rarity: "common", value: 25 },
    { name: "2020 Sword & Shield Cinderace V", rarity: "common", value: 28 },
    { name: "2022 Crown Zenith Regieleki VMAX", rarity: "common", value: 34 },
    { name: "2021 Evolving Skies Glaceon VMAX", rarity: "common", value: 42 },
    { name: "2020 Champion's Path Alcremie VMAX", rarity: "common", value: 27 },
    { name: "2022 Brilliant Stars Charizard V", rarity: "common", value: 36 },
    { name: "2019 Team Up Ampharos GX", rarity: "common", value: 24 },
    { name: "2021 Battle Styles Tyranitar V", rarity: "common", value: 31 },
    { name: "2020 Darkness Ablaze Charizard V", rarity: "common", value: 39 },
    { name: "2022 Astral Radiance Hisuian Samurott VSTAR", rarity: "common", value: 28 },
    { name: "2023 Obsidian Flames Mew ex", rarity: "common", value: 43 },
    { name: "2021 Fusion Strike Boltund V", rarity: "common", value: 23 },
    { name: "2020 Rebel Clash Eldegoss V", rarity: "common", value: 26 },
    { name: "SWSH Lost Origin Elite Trainer Box", rarity: "common", value: 48 },
    { name: "2019 Unified Minds Naganadel GX", rarity: "common", value: 25 },
    { name: "2021 Chilling Reign Blaziken VMAX", rarity: "common", value: 37 },
    { name: "2020 Vivid Voltage Jirachi Amazing Rare", rarity: "common", value: 30 },
    { name: "2022 Silver Tempest Alolan Vulpix VSTAR", rarity: "common", value: 29 },
    { name: "2023 Paldea Evolved Fidough", rarity: "common", value: 19 },
    { name: "2019 Cosmic Eclipse Lunala GX", rarity: "common", value: 28 },
    { name: "2021 Battle Styles Mimikyu V", rarity: "common", value: 27 },
    { name: "2020 Sword & Shield Inteleon V", rarity: "common", value: 26 },
    { name: "2022 Crown Zenith Registeel VMAX", rarity: "common", value: 32 },
    { name: "2021 Evolving Skies Leafeon VMAX", rarity: "common", value: 41 },
    { name: "2020 Champion's Path Dubwool V", rarity: "common", value: 22 },
    { name: "2022 Brilliant Stars Whimsicott VSTAR", rarity: "common", value: 34 },
    { name: "2019 Team Up Hoopa GX", rarity: "common", value: 26 },
    { name: "2021 Fusion Strike Sandaconda V", rarity: "common", value: 24 },
    { name: "2020 Darkness Ablaze Salamence VMAX", rarity: "common", value: 38 },
    { name: "2022 Astral Radiance Hisuian Decidueye VSTAR", rarity: "common", value: 31 },
    { name: "2023 Obsidian Flames Charizard ex", rarity: "common", value: 46 },
    { name: "2021 Chilling Reign Zeraora V", rarity: "common", value: 29 },
    { name: "2020 Rebel Clash Grimmsnarl VMAX", rarity: "common", value: 27 },
    { name: "SWSH Fusion Strike Elite Trainer Box", rarity: "common", value: 44 },
    { name: "2019 Unified Minds Keldeo GX", rarity: "common", value: 23 },
    { name: "2021 Battle Styles Single Strike Urshifu VMAX", rarity: "common", value: 35 },
    { name: "2020 Vivid Voltage Zacian Amazing Rare", rarity: "common", value: 32 },
    { name: "2022 Silver Tempest Unown VSTAR", rarity: "common", value: 28 },
    { name: "2023 Paldea Evolved Smoliv", rarity: "common", value: 17 },
    { name: "2019 Cosmic Eclipse Arceus & Dialga & Palkia GX", rarity: "common", value: 40 },
    { name: "2021 Fusion Strike Greedent V", rarity: "common", value: 25 },
    { name: "2020 Sword & Shield Rillaboom V", rarity: "common", value: 30 },
    { name: "2022 Crown Zenith Regirock VMAX", rarity: "common", value: 33 },
    { name: "2021 Evolving Skies Sylveon V", rarity: "common", value: 38 },
    { name: "2020 Champion's Path Eldegoss V", rarity: "common", value: 24 },
    { name: "2022 Brilliant Stars Raichu V", rarity: "common", value: 29 },
    { name: "2019 Team Up Incineroar GX", rarity: "common", value: 27 },
    { name: "2021 Chilling Reign Galarian Moltres V", rarity: "common", value: 35 },
    { name: "2020 Darkness Ablaze Centiskorch VMAX", rarity: "common", value: 28 },
    { name: "2022 Astral Radiance Beedrill V", rarity: "common", value: 26 },
    { name: "2023 Obsidian Flames Revavroom ex", rarity: "common", value: 32 },
    { name: "2021 Battle Styles Rapid Strike Urshifu VMAX", rarity: "common", value: 36 },
    { name: "2020 Rebel Clash Toxtricity VMAX", rarity: "common", value: 30 },
  ];

  const generateCards = async () => {
    setIsGenerating(true);
    setProgress(0);
    
    try {
      const { data: boxes, error: boxError } = await supabase
        .from("boxes")
        .select("*")
        .eq("active", true);

      if (boxError) throw boxError;

      const normalBox = boxes?.find((box) => box.box_type === "normal");
      const premiumBox = boxes?.find((box) => box.box_type === "premium");

      if (!normalBox || !premiumBox) {
        throw new Error("Boxes not found");
      }

      const allCards = [
        ...normalCards.map(c => ({ ...c, boxType: "normal", boxId: normalBox.id })),
        ...premiumCards.map(c => ({ ...c, boxType: "premium", boxId: premiumBox.id })),
      ];

      for (let i = 0; i < allCards.length; i++) {
        const card = allCards[i];
        
        try {
          const imageResponse = await supabase.functions.invoke("generate-card-image", {
            body: { cardName: card.name, rarity: card.rarity },
          });

          if (imageResponse.error) {
            console.error(`Error generating image for ${card.name}:`, imageResponse.error);
            continue;
          }

          const imageUrl = imageResponse.data?.imageUrl;

          const { data: insertedCard, error: cardError } = await supabase
            .from("cards")
            .insert([{
              name: card.name,
              rarity: card.rarity as "common" | "epic" | "legendary" | "rare",
              image_url: imageUrl || "/placeholder.svg",
              estimated_value: card.value,
              box_type: card.boxType,
              physical_available: true,
            }])
            .select()
            .single();

          if (cardError) {
            console.error(`Error inserting card ${card.name}:`, cardError);
            continue;
          }

          await supabase.from("machine_inventory").insert({
            box_id: card.boxId,
            card_id: insertedCard.id,
            quantity: 1,
          });

          setProgress(Math.round(((i + 1) / allCards.length) * 100));
        } catch (err) {
          console.error(`Error processing ${card.name}:`, err);
        }
      }

      toast({
        title: "Success!",
        description: "All cards generated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Generate Cards with AI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Generate 200 unique Pokemon cards with AI-generated images:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Normal Box: 70 common, 20 rare, 9 epic, 1 legendary ($3-$5000)</li>
                <li>Premium Box: 70 common, 20 rare, 9 epic, 1 legendary ($17-$50,000)</li>
              </ul>
            </div>
            
            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground">
                  Generating cards... {progress}%
                </p>
              </div>
            )}

            <Button
              onClick={generateCards}
              disabled={isGenerating}
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating {progress}%
                </>
              ) : (
                "Generate All Cards"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCardGenerator;
