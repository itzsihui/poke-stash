-- First, ensure we have a premium box
INSERT INTO public.boxes (name, box_type, price, price_usdt, stock_limit, active, common_odds, rare_odds, epic_odds, legendary_odds)
VALUES ('Premium Mystery Box', 'premium', 1000, 150, 50, true, 20, 30, 35, 15)
ON CONFLICT DO NOTHING;

-- Insert 50 premium PSA Pokemon cards - all legendary/epic for premium feel
INSERT INTO public.cards (name, rarity, image_url, estimated_value, box_type, physical_available) VALUES
-- Top 10 ultra-premium cards (Legendary)
('Shiny Charizard VMAX', 'legendary', '/pokemon-shiny-charizard-vmax-psa.jpg', 5000, 'premium', true),
('Gold Star Rayquaza', 'legendary', '/pokemon-gold-rayquaza-psa.jpg', 4800, 'premium', true),
('Rainbow Rare Pikachu VMAX', 'legendary', '/pokemon-rainbow-pikachu-vmax-psa.jpg', 4500, 'premium', true),
('Ancient Mew', 'legendary', '/pokemon-ancient-mew-psa.jpg', 4200, 'premium', true),
('Hyper Rare Lugia GX', 'legendary', '/pokemon-hyper-lugia-gx-psa.jpg', 4000, 'premium', true),
('Secret Rare Mewtwo EX', 'legendary', '/pokemon-secret-mewtwo-ex-psa.jpg', 3800, 'premium', true),
('Rainbow Rare Giratina VSTAR', 'legendary', '/pokemon-rainbow-giratina-vstar-psa.jpg', 3700, 'premium', true),
('Gold Secret Rare Zacian V', 'legendary', '/pokemon-gold-zacian-v-psa.jpg', 3600, 'premium', true),
('Shiny Gold Star Espeon', 'legendary', '/pokemon-shiny-gold-espeon-psa.jpg', 3500, 'premium', true),
('Hyper Rare Dialga VMAX', 'legendary', '/pokemon-hyper-dialga-vmax-psa.jpg', 3400, 'premium', true),

-- Next 20 premium cards (Epic)
('Rainbow Rare Umbreon VMAX', 'epic', '/pokemon-rainbow-umbreon-vmax-psa.jpg', 3200, 'premium', true),
('Gold Star Mew', 'epic', '/pokemon-gold-star-mew-psa.jpg', 3100, 'premium', true),
('Secret Rare Garchomp V', 'epic', '/pokemon-secret-garchomp-v-psa.jpg', 3000, 'premium', true),
('Hyper Rare Palkia VSTAR', 'epic', '/pokemon-hyper-palkia-vstar-psa.jpg', 2900, 'premium', true),
('Rainbow Rare Sylveon VMAX', 'epic', '/pokemon-rainbow-sylveon-vmax-psa.jpg', 2800, 'premium', true),
('Shiny Legendary Ho-Oh GX', 'epic', '/pokemon-shiny-ho-oh-gx-psa.jpg', 2700, 'premium', true),
('Gold Secret Rare Reshiram VMAX', 'epic', '/pokemon-gold-reshiram-vmax-psa.jpg', 2600, 'premium', true),
('Hyper Rare Kyogre VMAX', 'epic', '/pokemon-hyper-kyogre-vmax-psa.jpg', 2500, 'premium', true),
('Rainbow Rare Greninja VSTAR', 'epic', '/pokemon-rainbow-greninja-vstar-psa.jpg', 2400, 'premium', true),
('Secret Rare Dragonite VSTAR', 'epic', '/pokemon-secret-dragonite-vstar-psa.jpg', 2300, 'premium', true),
('Gold Star Latias', 'epic', '/pokemon-gold-star-latias-psa.jpg', 2200, 'premium', true),
('Hyper Rare Eternatus VMAX', 'epic', '/pokemon-hyper-eternatus-vmax-psa.jpg', 2100, 'premium', true),
('Rainbow Rare Lucario VMAX', 'epic', '/pokemon-rainbow-lucario-vmax-psa.jpg', 2000, 'premium', true),
('Secret Rare Tyranitar V', 'epic', '/pokemon-secret-tyranitar-v-psa.jpg', 1900, 'premium', true),
('Shiny Gold Zamazenta V', 'epic', '/pokemon-shiny-gold-zamazenta-v-psa.jpg', 1850, 'premium', true),
('Hyper Rare Groudon VMAX', 'epic', '/pokemon-hyper-groudon-vmax-psa.jpg', 1800, 'premium', true),
('Rainbow Rare Alakazam VMAX', 'epic', '/pokemon-rainbow-alakazam-vmax-psa.jpg', 1750, 'premium', true),
('Gold Secret Rare Xerneas VSTAR', 'epic', '/pokemon-gold-xerneas-vstar-psa.jpg', 1700, 'premium', true),
('Shiny Legendary Yveltal GX', 'epic', '/pokemon-shiny-yveltal-gx-psa.jpg', 1650, 'premium', true),
('Hyper Rare Solgaleo GX', 'epic', '/pokemon-hyper-solgaleo-gx-psa.jpg', 1600, 'premium', true),

-- Final 20 premium cards (Legendary/Epic mix)
('Rainbow Rare Necrozma VMAX', 'legendary', '/pokemon-rainbow-necrozma-vmax-psa.jpg', 3300, 'premium', true),
('Secret Rare Salamence VSTAR', 'epic', '/pokemon-secret-salamence-vstar-psa.jpg', 1550, 'premium', true),
('Gold Star Latios', 'epic', '/pokemon-gold-star-latios-psa.jpg', 1500, 'premium', true),
('Hyper Rare Lunala GX', 'epic', '/pokemon-hyper-lunala-gx-psa.jpg', 1450, 'premium', true),
('Rainbow Rare Gengar VMAX', 'epic', '/pokemon-rainbow-gengar-vmax-psa.jpg', 1400, 'premium', true),
('Gold Secret Rare Darkrai GX', 'epic', '/pokemon-gold-darkrai-gx-psa.jpg', 1350, 'premium', true),
('Shiny Blastoise VMAX', 'epic', '/pokemon-shiny-blastoise-vmax-psa.jpg', 1300, 'premium', true),
('Hyper Rare Metagross VSTAR', 'epic', '/pokemon-hyper-metagross-vstar-psa.jpg', 1250, 'premium', true),
('Rainbow Rare Gyarados VMAX', 'epic', '/pokemon-rainbow-gyarados-vmax-psa.jpg', 1200, 'premium', true),
('Secret Rare Jirachi GX', 'epic', '/pokemon-secret-jirachi-gx-psa.jpg', 1150, 'premium', true),
('Gold Star Celebi', 'epic', '/pokemon-gold-star-celebi-psa.jpg', 1100, 'premium', true),
('Hyper Rare Zekrom VMAX', 'epic', '/pokemon-hyper-zekrom-vmax-psa.jpg', 1050, 'premium', true),
('Rainbow Rare Dragapult VMAX', 'epic', '/pokemon-rainbow-dragapult-vmax-psa.jpg', 1000, 'premium', true),
('Secret Rare Hydreigon VSTAR', 'epic', '/pokemon-secret-hydreigon-vstar-psa.jpg', 950, 'premium', true),
('Shiny Venusaur VMAX', 'epic', '/pokemon-shiny-venusaur-vmax-psa.jpg', 900, 'premium', true),
('Gold Secret Rare Deoxys VSTAR', 'epic', '/pokemon-gold-deoxys-vstar-psa.jpg', 850, 'premium', true),
('Hyper Rare Gardevoir VMAX', 'epic', '/pokemon-hyper-gardevoir-vmax-psa.jpg', 800, 'premium', true),
('Rainbow Rare Zapdos GX', 'epic', '/pokemon-rainbow-zapdos-gx-psa.jpg', 750, 'premium', true),
('Secret Rare Articuno GX', 'epic', '/pokemon-secret-articuno-gx-psa.jpg', 700, 'premium', true),
('Gold Star Moltres', 'epic', '/pokemon-gold-star-moltres-psa.jpg', 650, 'premium', true);

-- Link premium cards to BOTH normal and premium boxes with high stock
INSERT INTO public.machine_inventory (box_id, card_id, quantity)
SELECT 
  b.id as box_id,
  c.id as card_id,
  CASE 
    WHEN c.rarity = 'legendary' THEN 3
    WHEN c.rarity = 'epic' THEN 5
  END as quantity
FROM public.boxes b
CROSS JOIN public.cards c
WHERE b.active = true 
  AND c.box_type = 'premium'
  AND c.image_url LIKE '%-vmax-psa.jpg' 
   OR c.image_url LIKE '%-vstar-psa.jpg'
   OR c.image_url LIKE '%-gx-psa.jpg'
   OR c.image_url LIKE 'gold-star%'
   OR c.image_url LIKE 'ancient-mew%';
