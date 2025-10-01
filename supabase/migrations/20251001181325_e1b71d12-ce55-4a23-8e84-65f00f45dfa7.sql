-- Ensure full row data is published for realtime updates
ALTER TABLE public.machine_inventory REPLICA IDENTITY FULL;