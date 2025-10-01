-- Fix image URLs for cards that don't have -psa versions
UPDATE public.cards 
SET image_url = '/pokemon-mewtwo.jpg'
WHERE image_url = '/pokemon-mewtwo-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-dragonite.jpg'
WHERE image_url = '/pokemon-dragonite-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-gengar.jpg'
WHERE image_url = '/pokemon-gengar-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-gyarados.jpg'
WHERE image_url = '/pokemon-gyarados-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-alakazam.jpg'
WHERE image_url = '/pokemon-alakazam-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-snorlax.jpg'
WHERE image_url = '/pokemon-snorlax-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-venusaur.jpg'
WHERE image_url = '/pokemon-venusaur-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-blastoise.jpg'
WHERE image_url = '/pokemon-blastoise-psa.jpg';

UPDATE public.cards 
SET image_url = '/pokemon-pikachu.jpg'
WHERE image_url = '/pokemon-pikachu-psa.jpg';