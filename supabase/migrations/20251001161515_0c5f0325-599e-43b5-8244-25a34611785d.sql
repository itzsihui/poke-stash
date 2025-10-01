-- Step 1: Clean up foreign key references
-- Delete transactions for non-PSA cards
DELETE FROM public.transactions 
WHERE card_id IN (
  SELECT id FROM public.cards 
  WHERE image_url NOT LIKE '%psa%'
);

-- Delete inventory for non-PSA cards
DELETE FROM public.inventory 
WHERE card_id IN (
  SELECT id FROM public.cards 
  WHERE image_url NOT LIKE '%psa%'
);

-- Delete redemptions for non-PSA cards
DELETE FROM public.redemptions 
WHERE card_id IN (
  SELECT id FROM public.cards 
  WHERE image_url NOT LIKE '%psa%'
);

-- Step 2: Remove old non-PSA cards from machine inventory
DELETE FROM public.machine_inventory 
WHERE card_id IN (
  SELECT id FROM public.cards 
  WHERE image_url NOT LIKE '%psa%'
);

-- Step 3: Delete old non-PSA cards
DELETE FROM public.cards 
WHERE image_url NOT LIKE '%psa%';

-- Step 4: Clean and rebuild machine inventory
DELETE FROM public.machine_inventory;

-- Step 5: Re-add all PSA cards to both machines
-- Normal box gets all 100 normal PSA cards
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
WHERE b.active = true 
  AND b.box_type = 'normal'
  AND c.box_type = 'normal'
  AND c.image_url LIKE '%psa%';

-- Premium box gets all 50 premium PSA cards + the 10 best from normal
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
  AND b.box_type = 'premium'
  AND c.box_type = 'premium'
  AND c.image_url LIKE '%psa%';
