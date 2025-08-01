-- Database Schema Update untuk Optimized Images
-- Jalankan script ini di Supabase SQL Editor

-- 1. Update tabel photos untuk mendukung multiple image sizes
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS optimized_images JSONB,
ADD COLUMN IF NOT EXISTS image_metadata JSONB,
ADD COLUMN IF NOT EXISTS compression_stats JSONB;

-- 2. Update existing photos dengan struktur default
UPDATE photos 
SET 
  optimized_images = jsonb_build_object(
    'original', jsonb_build_object('url', url, 'size', 0),
    'thumbnail', jsonb_build_object('url', url, 'size', 0),
    'small', jsonb_build_object('url', url, 'size', 0),
    'medium', jsonb_build_object('url', url, 'size', 0),
    'large', jsonb_build_object('url', url, 'size', 0)
  ),
  image_metadata = jsonb_build_object(
    'width', 0,
    'height', 0,
    'format', 'jpeg',
    'original_size', 0
  ),
  compression_stats = jsonb_build_object(
    'original_size', '0 KB',
    'optimized_size', '0 KB',
    'savings', 0,
    'ratio', '1:1'
  )
WHERE optimized_images IS NULL;

-- 3. Buat index untuk performa query
CREATE INDEX IF NOT EXISTS idx_photos_optimized_images ON photos USING GIN (optimized_images);
CREATE INDEX IF NOT EXISTS idx_photos_image_metadata ON photos USING GIN (image_metadata);

-- 4. Buat function untuk get optimized image URL
CREATE OR REPLACE FUNCTION get_optimized_image_url(
  photo_optimized_images JSONB,
  usage TEXT DEFAULT 'gallery'
)
RETURNS TEXT AS $$
BEGIN
  CASE usage
    WHEN 'thumbnail' THEN
      RETURN photo_optimized_images->'thumbnail'->>'url';
    WHEN 'gallery' THEN
      RETURN photo_optimized_images->'medium'->>'url';
    WHEN 'lightbox' THEN
      RETURN photo_optimized_images->'large'->>'url';
    WHEN 'download' THEN
      RETURN photo_optimized_images->'original'->>'url';
    WHEN 'mobile' THEN
      RETURN photo_optimized_images->'small'->>'url';
    ELSE
      RETURN photo_optimized_images->'medium'->>'url';
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- 5. Buat view untuk easy access ke optimized images
CREATE OR REPLACE VIEW photos_optimized AS
SELECT 
  id,
  event_id,
  original_name,
  uploader_name,
  album_name,
  is_homepage,
  uploaded_at,
  url as legacy_url,
  optimized_images,
  image_metadata,
  compression_stats,
  get_optimized_image_url(optimized_images, 'thumbnail') as thumbnail_url,
  get_optimized_image_url(optimized_images, 'gallery') as gallery_url,
  get_optimized_image_url(optimized_images, 'lightbox') as lightbox_url,
  get_optimized_image_url(optimized_images, 'download') as download_url,
  get_optimized_image_url(optimized_images, 'mobile') as mobile_url
FROM photos;

-- 6. Buat function untuk calculate total storage savings
CREATE OR REPLACE FUNCTION calculate_storage_savings()
RETURNS TABLE(
  total_photos INTEGER,
  total_original_size BIGINT,
  total_optimized_size BIGINT,
  total_savings_bytes BIGINT,
  total_savings_percentage NUMERIC,
  storage_saved TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_photos,
    SUM((image_metadata->>'original_size')::BIGINT) as total_original_size,
    SUM((optimized_images->'medium'->>'size')::BIGINT) as total_optimized_size,
    SUM((image_metadata->>'original_size')::BIGINT) - SUM((optimized_images->'medium'->>'size')::BIGINT) as total_savings_bytes,
    ROUND(
      ((SUM((image_metadata->>'original_size')::BIGINT) - SUM((optimized_images->'medium'->>'size')::BIGINT))::NUMERIC / 
       NULLIF(SUM((image_metadata->>'original_size')::BIGINT), 0)) * 100, 2
    ) as total_savings_percentage,
    pg_size_pretty(SUM((image_metadata->>'original_size')::BIGINT) - SUM((optimized_images->'medium'->>'size')::BIGINT)) as storage_saved
  FROM photos
  WHERE optimized_images IS NOT NULL 
    AND image_metadata IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. Buat trigger untuk auto-update compression stats
CREATE OR REPLACE FUNCTION update_compression_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.optimized_images IS NOT NULL AND NEW.image_metadata IS NOT NULL THEN
    NEW.compression_stats = jsonb_build_object(
      'original_size', pg_size_pretty((NEW.image_metadata->>'original_size')::BIGINT),
      'optimized_size', pg_size_pretty((NEW.optimized_images->'medium'->>'size')::BIGINT),
      'savings', ROUND(
        ((((NEW.image_metadata->>'original_size')::BIGINT) - ((NEW.optimized_images->'medium'->>'size')::BIGINT))::NUMERIC / 
         NULLIF((NEW.image_metadata->>'original_size')::BIGINT, 0)) * 100, 2
      ),
      'ratio', CONCAT(
        ROUND((NEW.image_metadata->>'original_size')::BIGINT / NULLIF((NEW.optimized_images->'medium'->>'size')::BIGINT, 1), 1),
        ':1'
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_compression_stats
  BEFORE INSERT OR UPDATE ON photos
  FOR EACH ROW
  EXECUTE FUNCTION update_compression_stats();

-- 8. Cek hasil schema update
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'photos' 
  AND column_name IN ('optimized_images', 'image_metadata', 'compression_stats')
ORDER BY 
  ordinal_position;