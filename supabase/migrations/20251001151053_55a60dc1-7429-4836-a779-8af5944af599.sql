-- Seed demo stock into machine_inventory using existing cards
WITH normal_box AS (
  SELECT id FROM public.boxes WHERE box_type = 'normal' AND active = true LIMIT 1
),
 premium_box AS (
  SELECT id FROM public.boxes WHERE box_type = 'premium' AND active = true LIMIT 1
),
 normal_cards AS (
  SELECT id FROM public.cards WHERE box_type = 'normal' LIMIT 12
)
INSERT INTO public.machine_inventory (box_id, card_id, quantity)
SELECT (SELECT id FROM normal_box), c.id, 3
FROM normal_cards c
LEFT JOIN public.machine_inventory mi ON mi.card_id = c.id AND mi.box_id = (SELECT id FROM normal_box)
WHERE mi.id IS NULL;

-- Also add a smaller set to premium box for demo (reusing normal cards)
WITH premium_box AS (
  SELECT id FROM public.boxes WHERE box_type = 'premium' AND active = true LIMIT 1
),
 premium_cards AS (
  SELECT id FROM public.cards WHERE box_type = 'normal' LIMIT 6
)
INSERT INTO public.machine_inventory (box_id, card_id, quantity)
SELECT (SELECT id FROM premium_box), c.id, 2
FROM premium_cards c
LEFT JOIN public.machine_inventory mi ON mi.card_id = c.id AND mi.box_id = (SELECT id FROM premium_box)
WHERE mi.id IS NULL;