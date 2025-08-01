-- Final Database Fix untuk Hafi Portrait
-- JALANKAN SCRIPT INI DI SUPABASE SQL EDITOR

-- 1. Backup existing data (optional)
CREATE TABLE IF NOT EXISTS photos_backup AS SELECT * FROM photos;

-- 2. Drop existing constraints
ALTER TABLE photos 
DROP CONSTRAINT IF EXISTS photos_pkey CASCADE,
DROP CONSTRAINT IF EXISTS photos_event_id_fkey CASCADE,
DROP CONSTRAINT IF EXISTS check_album_name CASCADE,
DROP CONSTRAINT IF EXISTS check_homepage_logic CASCADE;

-- 3. Modify columns to correct types and constraints
ALTER TABLE photos
ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
ALTER COLUMN event_id DROP NOT NULL,
ALTER COLUMN url SET NOT NULL,
ALTER COLUMN original_name SET DEFAULT 'unknown.jpg',
ALTER COLUMN filename SET DEFAULT NULL,
ALTER COLUMN uploaded_at SET DEFAULT NOW(),
ALTER COLUMN is_homepage SET DEFAULT false,
ALTER COLUMN album_name SET DEFAULT 'Tamu';

-- 4. Add back constraints
ALTER TABLE photos
ADD CONSTRAINT photos_pkey PRIMARY KEY (id),
ADD CONSTRAINT photos_event_id_fkey 
  FOREIGN KEY (event_id) 
  REFERENCES events(id) 
  ON DELETE CASCADE,
ADD CONSTRAINT check_album_name 
  CHECK (album_name IN ('Official', 'Tamu', 'Bridesmaid', 'Homepage')),
ADD CONSTRAINT check_homepage_logic 
  CHECK (
    (is_homepage = true AND event_id IS NULL AND album_name = 'Homepage') OR 
    (is_homepage = false AND event_id IS NOT NULL)
  );

-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_homepage ON photos(is_homepage);
CREATE INDEX IF NOT EXISTS idx_photos_album_name ON photos(album_name);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_at ON photos(uploaded_at DESC);

-- 6. Fix any invalid data
UPDATE photos
SET filename = CONCAT(
  EXTRACT(EPOCH FROM COALESCE(uploaded_at, NOW()))::text,
  '_',
  substr(md5(random()::text), 1, 8),
  '.jpg'
)
WHERE filename IS NULL;

UPDATE photos
SET is_homepage = false,
    album_name = 'Tamu'
WHERE album_name IS NULL;

-- 7. Add trigger for uploaded_at
CREATE OR REPLACE FUNCTION update_photos_uploaded_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.uploaded_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_photos_uploaded_at
    BEFORE INSERT ON photos
    FOR EACH ROW
    EXECUTE FUNCTION update_photos_uploaded_at();

-- 8. Verify the changes
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'photos'
ORDER BY 
    ordinal_position;