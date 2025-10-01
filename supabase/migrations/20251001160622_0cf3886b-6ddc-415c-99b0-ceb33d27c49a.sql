-- Insert 100 PSA Pokemon cards with appropriate rarities

-- Legendary cards (highest rarity)
INSERT INTO public.cards (name, rarity, image_url, estimated_value, box_type, physical_available) VALUES
('Mewtwo', 'legendary', '/pokemon-mewtwo-psa.jpg', 1000, 'normal', true),
('Rayquaza', 'legendary', '/pokemon-rayquaza-psa.jpg', 950, 'normal', true),
('Lugia', 'legendary', '/pokemon-lugia-psa.jpg', 900, 'normal', true),
('Ho-Oh', 'legendary', '/pokemon-ho-oh-psa.jpg', 900, 'normal', true),
('Giratina', 'legendary', '/pokemon-giratina-psa.jpg', 850, 'normal', true),
('Dialga', 'legendary', '/pokemon-dialga-psa.jpg', 850, 'normal', true),
('Palkia', 'legendary', '/pokemon-palkia-psa.jpg', 850, 'normal', true),
('Reshiram', 'legendary', '/pokemon-reshiram-psa.jpg', 800, 'normal', true),
('Zekrom', 'legendary', '/pokemon-zekrom-psa.jpg', 800, 'normal', true),
('Kyogre', 'legendary', '/pokemon-kyogre-psa.jpg', 800, 'normal', true),
('Groudon', 'legendary', '/pokemon-groudon-psa.jpg', 800, 'normal', true),
('Xerneas', 'legendary', '/pokemon-xerneas-psa.jpg', 750, 'normal', true),
('Yveltal', 'legendary', '/pokemon-yveltal-psa.jpg', 750, 'normal', true),
('Solgaleo', 'legendary', '/pokemon-solgaleo-psa.jpg', 750, 'normal', true),
('Lunala', 'legendary', '/pokemon-lunala-psa.jpg', 750, 'normal', true);

-- Epic cards (high rarity)
INSERT INTO public.cards (name, rarity, image_url, estimated_value, box_type, physical_available) VALUES
('Charizard', 'epic', '/pokemon-charizard-psa.jpg', 600, 'normal', true),
('Dragonite', 'epic', '/pokemon-dragonite-psa.jpg', 500, 'normal', true),
('Gyarados', 'epic', '/pokemon-gyarados-psa.jpg', 450, 'normal', true),
('Gengar', 'epic', '/pokemon-gengar-psa.jpg', 450, 'normal', true),
('Salamence', 'epic', '/pokemon-salamence-psa.jpg', 450, 'normal', true),
('Metagross', 'epic', '/pokemon-metagross-psa.jpg', 450, 'normal', true),
('Garchomp', 'epic', '/pokemon-garchomp-psa.jpg', 450, 'normal', true),
('Greninja', 'epic', '/pokemon-greninja-psa.jpg', 400, 'normal', true),
('Lucario', 'epic', '/pokemon-lucario-psa.jpg', 400, 'normal', true),
('Tyranitar', 'epic', '/pokemon-tyranitar-psa.jpg', 400, 'normal', true),
('Hydreigon', 'epic', '/pokemon-hydreigon-psa.jpg', 400, 'normal', true),
('Dragapult', 'epic', '/pokemon-dragapult-psa.jpg', 400, 'normal', true),
('Zacian', 'epic', '/pokemon-zacian-psa.jpg', 550, 'normal', true),
('Zamazenta', 'epic', '/pokemon-zamazenta-psa.jpg', 550, 'normal', true),
('Eternatus', 'epic', '/pokemon-eternatus-psa.jpg', 500, 'normal', true);

-- Rare cards (mid rarity)
INSERT INTO public.cards (name, rarity, image_url, estimated_value, box_type, physical_available) VALUES
('Blastoise', 'rare', '/pokemon-blastoise-psa.jpg', 300, 'normal', true),
('Venusaur', 'rare', '/pokemon-venusaur-psa.jpg', 300, 'normal', true),
('Alakazam', 'rare', '/pokemon-alakazam-psa.jpg', 250, 'normal', true),
('Snorlax', 'rare', '/pokemon-snorlax-psa.jpg', 250, 'normal', true),
('Lapras', 'rare', '/pokemon-lapras-psa.jpg', 250, 'normal', true),
('Zapdos', 'rare', '/pokemon-zapdos-psa.jpg', 300, 'normal', true),
('Moltres', 'rare', '/pokemon-moltres-psa.jpg', 300, 'normal', true),
('Articuno', 'rare', '/pokemon-articuno-psa.jpg', 300, 'normal', true),
('Mew', 'rare', '/pokemon-mew-psa.jpg', 350, 'normal', true),
('Celebi', 'rare', '/pokemon-celebi-psa.jpg', 300, 'normal', true),
('Umbreon', 'rare', '/pokemon-umbreon-psa.jpg', 280, 'normal', true),
('Sylveon', 'rare', '/pokemon-sylveon-psa.jpg', 280, 'normal', true),
('Espeon', 'rare', '/pokemon-espeon-psa.jpg', 250, 'normal', true),
('Vaporeon', 'rare', '/pokemon-vaporeon-psa.jpg', 250, 'normal', true),
('Jolteon', 'rare', '/pokemon-jolteon-psa.jpg', 250, 'normal', true),
('Flareon', 'rare', '/pokemon-flareon-psa.jpg', 250, 'normal', true),
('Blaziken', 'rare', '/pokemon-blaziken-psa.jpg', 280, 'normal', true),
('Swampert', 'rare', '/pokemon-swampert-psa.jpg', 280, 'normal', true),
('Sceptile', 'rare', '/pokemon-sceptile-psa.jpg', 280, 'normal', true),
('Gardevoir', 'rare', '/pokemon-gardevoir-psa.jpg', 280, 'normal', true),
('Flygon', 'rare', '/pokemon-flygon-psa.jpg', 250, 'normal', true),
('Latias', 'rare', '/pokemon-latias-psa.jpg', 300, 'normal', true),
('Latios', 'rare', '/pokemon-latios-psa.jpg', 300, 'normal', true),
('Jirachi', 'rare', '/pokemon-jirachi-psa.jpg', 300, 'normal', true),
('Deoxys', 'rare', '/pokemon-deoxys-psa.jpg', 300, 'normal', true),
('Infernape', 'rare', '/pokemon-infernape-psa.jpg', 250, 'normal', true),
('Empoleon', 'rare', '/pokemon-empoleon-psa.jpg', 250, 'normal', true),
('Torterra', 'rare', '/pokemon-torterra-psa.jpg', 250, 'normal', true),
('Darkrai', 'rare', '/pokemon-darkrai-psa.jpg', 320, 'normal', true),
('Cresselia', 'rare', '/pokemon-cresselia-psa.jpg', 280, 'normal', true);

-- Common cards (most common)
INSERT INTO public.cards (name, rarity, image_url, estimated_value, box_type, physical_available) VALUES
('Pikachu', 'common', '/pokemon-pikachu-psa.jpg', 150, 'normal', true),
('Squirtle', 'common', '/pokemon-squirtle-psa.jpg', 120, 'normal', true),
('Bulbasaur', 'common', '/pokemon-bulbasaur-psa.jpg', 120, 'normal', true),
('Charmander', 'common', '/pokemon-charmander-psa.jpg', 120, 'normal', true),
('Jigglypuff', 'common', '/pokemon-jigglypuff-psa.jpg', 100, 'normal', true),
('Eevee', 'common', '/pokemon-eevee-psa.jpg', 130, 'normal', true),
('Machamp', 'common', '/pokemon-machamp-psa.jpg', 130, 'normal', true),
('Arcanine', 'common', '/pokemon-arcanine-psa.jpg', 150, 'normal', true),
('Feraligatr', 'common', '/pokemon-feraligatr-psa.jpg', 130, 'normal', true),
('Typhlosion', 'common', '/pokemon-typhlosion-psa.jpg', 130, 'normal', true),
('Meganium', 'common', '/pokemon-meganium-psa.jpg', 120, 'normal', true),
('Scizor', 'common', '/pokemon-scizor-psa.jpg', 140, 'normal', true),
('Heracross', 'common', '/pokemon-heracross-psa.jpg', 130, 'normal', true),
('Luxray', 'common', '/pokemon-luxray-psa.jpg', 130, 'normal', true),
('Kyurem', 'common', '/pokemon-kyurem-psa.jpg', 150, 'normal', true),
('Genesect', 'common', '/pokemon-genesect-psa.jpg', 140, 'normal', true),
('Serperior', 'common', '/pokemon-serperior-psa.jpg', 120, 'normal', true),
('Emboar', 'common', '/pokemon-emboar-psa.jpg', 120, 'normal', true),
('Samurott', 'common', '/pokemon-samurott-psa.jpg', 120, 'normal', true),
('Zoroark', 'common', '/pokemon-zoroark-psa.jpg', 140, 'normal', true),
('Volcarona', 'common', '/pokemon-volcarona-psa.jpg', 130, 'normal', true),
('Delphox', 'common', '/pokemon-delphox-psa.jpg', 120, 'normal', true),
('Chesnaught', 'common', '/pokemon-chesnaught-psa.jpg', 120, 'normal', true),
('Talonflame', 'common', '/pokemon-talonflame-psa.jpg', 110, 'normal', true),
('Aegislash', 'common', '/pokemon-aegislash-psa.jpg', 130, 'normal', true),
('Goodra', 'common', '/pokemon-goodra-psa.jpg', 120, 'normal', true),
('Decidueye', 'common', '/pokemon-decidueye-psa.jpg', 130, 'normal', true),
('Incineroar', 'common', '/pokemon-incineroar-psa.jpg', 130, 'normal', true),
('Primarina', 'common', '/pokemon-primarina-psa.jpg', 130, 'normal', true),
('Lycanroc', 'common', '/pokemon-lycanroc-psa.jpg', 110, 'normal', true),
('Mimikyu', 'common', '/pokemon-mimikyu-psa.jpg', 140, 'normal', true),
('Kommo-o', 'common', '/pokemon-kommo-o-psa.jpg', 120, 'normal', true),
('Necrozma', 'common', '/pokemon-necrozma-psa.jpg', 150, 'normal', true),
('Cinderace', 'common', '/pokemon-cinderace-psa.jpg', 140, 'normal', true),
('Inteleon', 'common', '/pokemon-inteleon-psa.jpg', 130, 'normal', true),
('Rillaboom', 'common', '/pokemon-rillaboom-psa.jpg', 130, 'normal', true),
('Corviknight', 'common', '/pokemon-corviknight-psa.jpg', 120, 'normal', true),
('Toxtricity', 'common', '/pokemon-toxtricity-psa.jpg', 120, 'normal', true),
('Raichu', 'common', '/pokemon-raichu-psa.jpg', 120, 'normal', true),
('Ninetales', 'common', '/pokemon-ninetales-psa.jpg', 130, 'normal', true),
('Slowbro', 'common', '/pokemon-slowbro-psa.jpg', 110, 'normal', true),
('Magnezone', 'common', '/pokemon-magnezone-psa.jpg', 120, 'normal', true),
('Steelix', 'common', '/pokemon-steelix-psa.jpg', 120, 'normal', true),
('Kingdra', 'common', '/pokemon-kingdra-psa.jpg', 120, 'normal', true),
('Haxorus', 'common', '/pokemon-haxorus-psa.jpg', 130, 'normal', true),
('Bisharp', 'common', '/pokemon-bisharp-psa.jpg', 120, 'normal', true),
('Milotic', 'common', '/pokemon-milotic-psa.jpg', 130, 'normal', true),
('Chandelure', 'common', '/pokemon-chandelure-psa.jpg', 120, 'normal', true),
('Golurk', 'common', '/pokemon-golurk-psa.jpg', 110, 'normal', true),
('Absol', 'common', '/pokemon-absol-psa.jpg', 130, 'normal', true);

-- Now link all cards to machine_inventory for the normal box
-- First, get the box_id for the normal box and link cards
INSERT INTO public.machine_inventory (box_id, card_id, quantity)
SELECT 
  b.id as box_id,
  c.id as card_id,
  CASE 
    WHEN c.rarity = 'legendary' THEN 2
    WHEN c.rarity = 'epic' THEN 5
    WHEN c.rarity = 'rare' THEN 10
    WHEN c.rarity = 'common' THEN 20
  END as quantity
FROM public.boxes b
CROSS JOIN public.cards c
WHERE b.box_type = 'normal' 
  AND b.active = true
  AND c.image_url LIKE '/pokemon-%-psa.jpg';
