import charizardImg from "@/assets/charizard.jpg";
import pikachuImg from "@/assets/pikachu.jpg";
import mewtwoImg from "@/assets/mewtwo.jpg";
import eeveeImg from "@/assets/eevee.jpg";
import mysteryBoxImg from "@/assets/mystery-box.jpg";

export type Rarity = "legendary" | "epic" | "rare" | "common";

const rarityMap: Record<Rarity, string> = {
  legendary: charizardImg,
  epic: pikachuImg,
  rare: mewtwoImg,
  common: eeveeImg,
};

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function resolveCardImage(originalUrl?: string, rarity?: Rarity, name?: string) {
  // If it's a valid external or public asset, keep it
  if (
    originalUrl &&
    originalUrl !== "/placeholder.svg" &&
    !originalUrl.startsWith("/src/assets/")
  ) {
    return originalUrl;
  }

  // Prefer deterministic image by rarity
  if (rarity && rarityMap[rarity]) {
    return rarityMap[rarity];
  }

  // Else spread across our set by name hash for variety
  const pool = [charizardImg, pikachuImg, mewtwoImg, eeveeImg, mysteryBoxImg];
  const index = name ? hashString(name) % pool.length : 0;
  return pool[index];
}
