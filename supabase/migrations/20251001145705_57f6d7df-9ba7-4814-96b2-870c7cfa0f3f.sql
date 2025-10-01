-- Ensure required boxes exist and are active
INSERT INTO public.boxes (name, box_type, active)
SELECT 'Mystery Box', 'normal', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.boxes WHERE box_type = 'normal'
);

INSERT INTO public.boxes (name, box_type, active)
SELECT 'Premium Box', 'premium', true
WHERE NOT EXISTS (
  SELECT 1 FROM public.boxes WHERE box_type = 'premium'
);

UPDATE public.boxes SET active = true WHERE box_type IN ('normal','premium');

-- Backfill machine_inventory.box_id where it's null using card.box_type matching an active box
UPDATE public.machine_inventory mi
SET box_id = b.id
FROM public.cards c
JOIN public.boxes b ON b.box_type = c.box_type AND b.active = true
WHERE mi.card_id = c.id AND mi.box_id IS NULL;