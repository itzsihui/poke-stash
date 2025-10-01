-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create rarity enum
CREATE TYPE card_rarity AS ENUM ('legendary', 'epic', 'rare', 'common');

-- Create redemption status enum
CREATE TYPE redemption_status AS ENUM ('pending', 'shipped', 'delivered');

-- Create transaction type enum
CREATE TYPE transaction_type AS ENUM ('box_purchase', 'redemption_fee');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  telegram_username TEXT,
  wallet_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  rarity card_rarity NOT NULL,
  image_url TEXT NOT NULL,
  estimated_value NUMERIC(10, 2) DEFAULT 0,
  physical_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inventory table
CREATE TABLE public.inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create boxes table
CREATE TABLE public.boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  price NUMERIC(10, 2) NOT NULL DEFAULT 350,
  legendary_odds NUMERIC(5, 2) NOT NULL DEFAULT 0.5,
  epic_odds NUMERIC(5, 2) NOT NULL DEFAULT 7,
  rare_odds NUMERIC(5, 2) NOT NULL DEFAULT 30,
  common_odds NUMERIC(5, 2) NOT NULL DEFAULT 62.5,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create redemptions table
CREATE TABLE public.redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE,
  inventory_id UUID NOT NULL REFERENCES public.inventory(id) ON DELETE CASCADE,
  status redemption_status NOT NULL DEFAULT 'pending',
  delivery_fee NUMERIC(10, 2) DEFAULT 75,
  shipping_address TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  transaction_type transaction_type NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  card_id UUID REFERENCES public.cards(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for cards (public read)
CREATE POLICY "Anyone can view cards"
  ON public.cards FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for inventory
CREATE POLICY "Users can view their own inventory"
  ON public.inventory FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own inventory"
  ON public.inventory FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for boxes (public read)
CREATE POLICY "Anyone can view active boxes"
  ON public.boxes FOR SELECT
  TO authenticated
  USING (active = true);

-- RLS Policies for redemptions
CREATE POLICY "Users can view their own redemptions"
  ON public.redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
  ON public.redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for transactions
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, telegram_username)
  VALUES (new.id, new.raw_user_meta_data->>'telegram_username');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default box configuration
INSERT INTO public.boxes (price, legendary_odds, epic_odds, rare_odds, common_odds, active)
VALUES (350, 0.5, 7, 30, 62.5, true);

-- Insert some sample cards
INSERT INTO public.cards (name, rarity, image_url, estimated_value, physical_available) VALUES
  ('Charizard VMAX', 'legendary', '/placeholder.svg', 500, true),
  ('Pikachu Illustrator', 'legendary', '/placeholder.svg', 1000, true),
  ('Mewtwo EX', 'epic', '/placeholder.svg', 150, true),
  ('Dragonite V', 'epic', '/placeholder.svg', 120, true),
  ('Gyarados VMAX', 'epic', '/placeholder.svg', 100, true),
  ('Blastoise', 'rare', '/placeholder.svg', 50, true),
  ('Venusaur', 'rare', '/placeholder.svg', 45, true),
  ('Alakazam', 'rare', '/placeholder.svg', 40, true),
  ('Gengar', 'rare', '/placeholder.svg', 35, true),
  ('Pikachu', 'common', '/placeholder.svg', 10, true),
  ('Bulbasaur', 'common', '/placeholder.svg', 8, true),
  ('Squirtle', 'common', '/placeholder.svg', 8, true),
  ('Charmander', 'common', '/placeholder.svg', 8, true),
  ('Eevee', 'common', '/placeholder.svg', 7, true)