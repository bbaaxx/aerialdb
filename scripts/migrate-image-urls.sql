-- Migrate image URLs from /uploads/ to R2 public URL
-- This updates all moves that have images to use the R2 public URL

UPDATE moves
SET image_url = REPLACE(
  image_url,
  '/uploads/',
  'https://pub-63292280827b4ceab8392c974299dbd8.r2.dev/'
)
WHERE image_url LIKE '/uploads/%';

-- Verify the update
SELECT id, name, image_url
FROM moves
WHERE image_url IS NOT NULL
LIMIT 10;
