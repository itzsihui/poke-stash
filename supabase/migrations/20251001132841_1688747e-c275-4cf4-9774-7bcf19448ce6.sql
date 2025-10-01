-- Drop existing foreign key constraints that reference auth.users
ALTER TABLE inventory DROP CONSTRAINT IF EXISTS inventory_user_id_fkey;
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_user_id_fkey;
ALTER TABLE redemptions DROP CONSTRAINT IF EXISTS redemptions_user_id_fkey;

-- Drop all existing policies that depend on these columns
DROP POLICY IF EXISTS "Users can view their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can insert into their own inventory" ON inventory;
DROP POLICY IF EXISTS "Users can view their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can insert their own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can view their own redemptions" ON redemptions;
DROP POLICY IF EXISTS "Users can create their own redemptions" ON redemptions;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Update profiles table to use telegram_id as primary identifier
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS telegram_id TEXT UNIQUE;

-- Update inventory table to use telegram_id
ALTER TABLE inventory RENAME COLUMN user_id TO telegram_id;
ALTER TABLE inventory ALTER COLUMN telegram_id TYPE TEXT;

-- Update transactions table to use telegram_id
ALTER TABLE transactions RENAME COLUMN user_id TO telegram_id;
ALTER TABLE transactions ALTER COLUMN telegram_id TYPE TEXT;

-- Update redemptions table to use telegram_id
ALTER TABLE redemptions RENAME COLUMN user_id TO telegram_id;
ALTER TABLE redemptions ALTER COLUMN telegram_id TYPE TEXT;

-- Recreate RLS policies for inventory
CREATE POLICY "Anyone can view inventory"
ON inventory FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert into inventory"
ON inventory FOR INSERT
WITH CHECK (true);

-- Recreate RLS policies for transactions
CREATE POLICY "Anyone can view transactions"
ON transactions FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert transactions"
ON transactions FOR INSERT
WITH CHECK (true);

-- Recreate RLS policies for redemptions
CREATE POLICY "Anyone can view redemptions"
ON redemptions FOR SELECT
USING (true);

CREATE POLICY "Anyone can create redemptions"
ON redemptions FOR INSERT
WITH CHECK (true);

-- Recreate RLS policies for profiles
CREATE POLICY "Anyone can view profiles"
ON profiles FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert profiles"
ON profiles FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
ON profiles FOR UPDATE
USING (true);

-- Update boxes table for gacha machine concept
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS name TEXT DEFAULT 'Mystery Box';
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS box_type TEXT DEFAULT 'normal' CHECK (box_type IN ('normal', 'premium'));
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS price_usdt NUMERIC DEFAULT 50;
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS stock_limit INTEGER DEFAULT 100;

-- Create machine_inventory table to track cards in each machine
CREATE TABLE IF NOT EXISTS machine_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id UUID REFERENCES boxes(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(box_id, card_id)
);

-- Enable RLS on machine_inventory
ALTER TABLE machine_inventory ENABLE ROW LEVEL SECURITY;

-- Anyone can view machine inventory
CREATE POLICY "Anyone can view machine inventory"
ON machine_inventory FOR SELECT
USING (true);

-- Anyone can update machine inventory (for stock management)
CREATE POLICY "Anyone can update machine inventory"
ON machine_inventory FOR UPDATE
USING (true);

-- Add box_type to cards to categorize them
ALTER TABLE cards ADD COLUMN IF NOT EXISTS box_type TEXT DEFAULT 'normal' CHECK (box_type IN ('normal', 'premium', 'both'));

-- Function to draw a card from gacha machine
CREATE OR REPLACE FUNCTION draw_from_gacha(
  p_box_id UUID,
  p_telegram_id TEXT
)
RETURNS TABLE (
  card_id UUID,
  card_name TEXT,
  card_rarity TEXT,
  card_image TEXT,
  card_value NUMERIC
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
  WHERE box_id = p_box_id AND card_id = v_card_id;
  
  -- Add card to user inventory
  INSERT INTO inventory (telegram_id, card_id)
  VALUES (p_telegram_id, v_card_id);
  
  -- Return the card details
  RETURN QUERY
  SELECT c.id, c.name, c.rarity::TEXT, c.image_url, c.estimated_value
  FROM cards c
  WHERE c.id = v_card_id;
END;
$$;