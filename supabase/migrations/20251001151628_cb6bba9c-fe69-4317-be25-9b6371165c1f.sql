-- Ensure machine_inventory can view cards table for the JOIN in API
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'machine_inventory' 
      AND policyname = 'Anon can view machine inventory'
  ) THEN
    CREATE POLICY "Anon can view machine inventory"
    ON public.machine_inventory
    FOR SELECT
    TO anon
    USING (true);
  END IF;
END $$;