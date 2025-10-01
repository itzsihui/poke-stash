-- Ensure required boxes exist and are active
INSERT INTO public.boxes (name, box_type, active)
SELECT 'Mystery Box', 'normal', true
WHERE NOT EXISTS (SELECT 1 FROM public.boxes WHERE box_type = 'normal');

INSERT INTO public.boxes (name, box_type, active)
SELECT 'Premium Box', 'premium', true
WHERE NOT EXISTS (SELECT 1 FROM public.boxes WHERE box_type = 'premium');

UPDATE public.boxes SET active = true WHERE box_type IN ('normal','premium');

-- Make profiles.id auto-generate so we don't need to pass a UUID
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT extensions.uuid_generate_v4();

-- Ensure a unique constraint on telegram_id for upserts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'profiles_telegram_id_unique'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_telegram_id_unique UNIQUE (telegram_id);
  END IF;
END $$;

-- Add missing foreign keys for proper relational integrity and API embedding
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'inventory_card_id_fkey'
  ) THEN
    ALTER TABLE public.inventory
    ADD CONSTRAINT inventory_card_id_fkey
    FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'machine_inventory_card_id_fkey'
  ) THEN
    ALTER TABLE public.machine_inventory
    ADD CONSTRAINT machine_inventory_card_id_fkey
    FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'machine_inventory_box_id_fkey'
  ) THEN
    ALTER TABLE public.machine_inventory
    ADD CONSTRAINT machine_inventory_box_id_fkey
    FOREIGN KEY (box_id) REFERENCES public.boxes(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'redemptions_card_id_fkey'
  ) THEN
    ALTER TABLE public.redemptions
    ADD CONSTRAINT redemptions_card_id_fkey
    FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE RESTRICT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'redemptions_inventory_id_fkey'
  ) THEN
    ALTER TABLE public.redemptions
    ADD CONSTRAINT redemptions_inventory_id_fkey
    FOREIGN KEY (inventory_id) REFERENCES public.inventory(id) ON DELETE RESTRICT;
  END IF;
END $$;

-- Backfill machine_inventory.box_id where it's null using card.box_type
UPDATE public.machine_inventory mi
SET box_id = b.id
FROM public.cards c
JOIN public.boxes b ON b.box_type = c.box_type AND b.active = true
WHERE mi.card_id = c.id AND mi.box_id IS NULL;