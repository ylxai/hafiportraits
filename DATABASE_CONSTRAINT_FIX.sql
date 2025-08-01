-- Database Constraint Fixes untuk Hafi Portrait
-- Jalankan script ini di Supabase SQL Editor untuk memperbaiki constraint issues

-- 1. Cek struktur tabel photos saat ini
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;

-- 2. Drop constraint NOT NULL pada event_id (untuk homepage photos)
ALTER TABLE photos ALTER COLUMN event_id DROP NOT NULL;

-- 3. Drop constraint NOT NULL pada filename jika ada
ALTER TABLE photos ALTER COLUMN filename DROP NOT NULL;

-- 4. Tambahkan kolom yang mungkin missing
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS original_name TEXT,
ADD COLUMN IF NOT EXISTS uploader_name TEXT,
ADD COLUMN IF NOT EXISTS album_name TEXT,
ADD COLUMN IF NOT EXISTS is_homepage BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS filename TEXT;

-- 5. Tambahkan kolom uploaded_at jika belum ada
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 6. Update existing records untuk set default values
UPDATE photos 
SET 
  original_name = COALESCE(original_name, 'unknown.jpg'),
  uploader_name = COALESCE(uploader_name, 'Anonymous'),
  album_name = COALESCE(album_name, 'Tamu'),
  is_homepage = COALESCE(is_homepage, FALSE),
  filename = COALESCE(filename, CONCAT(EXTRACT(EPOCH FROM NOW())::text, '_', substr(md5(random()::text), 1, 8), '.jpg'))
WHERE original_name IS NULL OR uploader_name IS NULL OR album_name IS NULL OR is_homepage IS NULL OR filename IS NULL;

-- 6. Buat constraint yang lebih fleksibel
-- Homepage photos: event_id = NULL, is_homepage = TRUE
-- Event photos: event_id IS NOT NULL, is_homepage = FALSE
ALTER TABLE photos 
ADD CONSTRAINT check_homepage_logic 
CHECK (
  (is_homepage = TRUE AND event_id IS NULL) OR 
  (is_homepage = FALSE AND event_id IS NOT NULL)
);

-- 7. Update constraint album_name untuk include Homepage
ALTER TABLE photos DROP CONSTRAINT IF EXISTS check_album_name;
ALTER TABLE photos 
ADD CONSTRAINT check_album_name 
CHECK (album_name IN ('Official', 'Tamu', 'Bridesmaid', 'Homepage'));

-- 8. Cek hasil akhir
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'photos' 
ORDER BY ordinal_position;