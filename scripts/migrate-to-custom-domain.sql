-- Migrate image URLs from r2.dev to custom domain
-- Run this AFTER setting up images.aerialdb.codetitlan.org custom domain

UPDATE moves
SET image_url = REPLACE(
  image_url,
  'https://pub-63292280827b4ceab8392c974299dbd8.r2.dev/',
  'https://images.aerialdb.codetitlan.org/'
)
WHERE image_url LIKE 'https://pub-63292280827b4ceab8392c974299dbd8.r2.dev/%';

-- Verify the update
SELECT id, name, image_url
FROM moves
WHERE image_url IS NOT NULL
LIMIT 10;
