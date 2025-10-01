import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const POKEMON_NAMES = [
  "Pikachu", "Charizard", "Blastoise", "Venusaur", "Mewtwo", "Dragonite", "Gyarados", "Alakazam", "Gengar", "Snorlax",
  "Squirtle", "Bulbasaur", "Charmander", "Jigglypuff", "Eevee", "Lucario", "Rayquaza", "Greninja", "Umbreon", "Sylveon",
  "Machamp", "Arcanine", "Lapras", "Zapdos", "Moltres", "Articuno", "Mew", "Celebi", "Lugia", "Ho-Oh",
  "Tyranitar", "Feraligatr", "Typhlosion", "Meganium", "Scizor", "Heracross", "Espeon", "Vaporeon", "Jolteon", "Flareon",
  "Blaziken", "Swampert", "Sceptile", "Gardevoir", "Flygon", "Salamence", "Metagross", "Latias", "Latios", "Kyogre",
  "Groudon", "Rayquaza", "Jirachi", "Deoxys", "Infernape", "Empoleon", "Torterra", "Luxray", "Garchomp", "Giratina",
  "Dialga", "Palkia", "Darkrai", "Cresselia", "Serperior", "Emboar", "Samurott", "Zoroark", "Hydreigon", "Volcarona",
  "Reshiram", "Zekrom", "Kyurem", "Genesect", "Greninja", "Delphox", "Chesnaught", "Talonflame", "Aegislash", "Goodra",
  "Xerneas", "Yveltal", "Decidueye", "Incineroar", "Primarina", "Lycanroc", "Mimikyu", "Kommo-o", "Solgaleo", "Lunala",
  "Necrozma", "Cinderace", "Inteleon", "Rillaboom", "Corviknight", "Toxtricity", "Dragapult", "Zacian", "Zamazenta", "Eternatus"
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { startIndex = 0, batchSize = 10 } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const endIndex = Math.min(startIndex + batchSize, POKEMON_NAMES.length);
    const results = [];

    for (let i = startIndex; i < endIndex; i++) {
      const pokemon = POKEMON_NAMES[i];
      const cardNumber = String(i + 1).padStart(3, '0');
      const serialNumber = 92436655 + i;

      const prompt = `A professional high-quality Pokemon trading card featuring ${pokemon} in a PSA grading case. White PSA grading label at the top with text showing "2023 POKEMON JPN SV-P ${pokemon.toUpperCase()} #${cardNumber} GEM MT 10 ${serialNumber}". Official Pokemon card style with holographic border effects, collector grade quality, ultra high resolution, detailed artwork, card in protective case`;

      console.log(`Generating PSA card ${i + 1}: ${pokemon}`);

      try {
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image-preview",
            messages: [
              {
                role: "user",
                content: prompt
              }
            ],
            modalities: ["image", "text"]
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI gateway error for ${pokemon}:`, response.status, errorText);
          results.push({ pokemon, success: false, error: `AI gateway error: ${response.status}` });
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          results.push({ pokemon, success: false, error: "No image generated" });
          continue;
        }

        results.push({ 
          pokemon, 
          success: true, 
          imageUrl,
          filename: `pokemon-${pokemon.toLowerCase()}-psa.jpg`
        });

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error generating ${pokemon}:`, error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.push({ pokemon, success: false, error: errorMessage });
      }
    }

    return new Response(
      JSON.stringify({ 
        results,
        completed: endIndex,
        total: POKEMON_NAMES.length,
        hasMore: endIndex < POKEMON_NAMES.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
