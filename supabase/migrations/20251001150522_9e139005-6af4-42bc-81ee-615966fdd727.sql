-- Allow anon (unauthenticated) to view active boxes for the demo
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'boxes' 
      AND policyname = 'Anon can view active boxes'
  ) THEN
    CREATE POLICY "Anon can view active boxes"
    ON public.boxes
    FOR SELECT
    TO anon
    USING (active = true);
  END IF;
END $$;