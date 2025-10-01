-- Fix all cards with invalid /src/assets/ image paths
UPDATE cards 
SET image_url = '/placeholder.svg' 
WHERE image_url LIKE '/src/assets/%';