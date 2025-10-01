-- Fix the ambiguous card_id reference in draw_from_gacha function
DROP FUNCTION IF EXISTS public.draw_from_gacha(uuid, text);

CREATE OR REPLACE FUNCTION public.draw_from_gacha(p_box_id uuid, p_telegram_id text)
RETURNS TABLE(card_id uuid, card_name text, card_rarity text, card_image text, card_value numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_card_id UUID;
  v_quantity INTEGER;
BEGIN
  -- Select a random card from the machine that has stock
  SELECT mi.card_id, mi.quantity INTO v_card_id, v_quantity
  FROM machine_inventory mi
  WHERE mi.box_id = p_box_id AND mi.quantity > 0
  ORDER BY RANDOM()
  LIMIT 1;
  
  IF v_card_id IS NULL THEN
    RAISE EXCEPTION 'No cards available in this machine';
  END IF;
  
  -- Decrement the quantity in machine_inventory
  UPDATE machine_inventory
  SET quantity = quantity - 1
  WHERE box_id = p_box_id AND machine_inventory.card_id = v_card_id;
  
  -- Add card to user inventory
  INSERT INTO inventory (telegram_id, card_id)
  VALUES (p_telegram_id, v_card_id);
  
  -- Return the card details with explicit table qualifier
  RETURN QUERY
  SELECT c.id, c.name, c.rarity::TEXT, c.image_url, c.estimated_value
  FROM cards c
  WHERE c.id = v_card_id;
END;
$function$;