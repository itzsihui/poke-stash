-- Allow anon to read cards (so machine_inventory JOIN works)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'cards' 
      AND policyname = 'Anon can view cards'
  ) THEN
    CREATE POLICY "Anon can view cards"
    ON public.cards
    FOR SELECT
    TO anon
    USING (true);
  END IF;
END $$;