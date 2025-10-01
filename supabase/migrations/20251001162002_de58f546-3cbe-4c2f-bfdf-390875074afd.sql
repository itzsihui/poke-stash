-- Fix Charizard image URL
UPDATE public.cards 
SET image_url = '/pokemon-charizard.jpg'
WHERE image_url = '/pokemon-charizard-psa.jpg';