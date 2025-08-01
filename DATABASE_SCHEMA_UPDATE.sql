-- Database Schema Updates untuk Hafi Portrait
-- Jalankan script ini di Supabase SQL Editor

-- 1. Update tabel photos untuk menambahkan kolom yang diperlukan
ALTER TABLE photos 
ADD COLUMN IF NOT EXISTS original_name TEXT,
ADD COLUMN IF NOT EXISTS uploader_name TEXT,
ADD COLUMN IF NOT EXISTS album_name TEXT,
ADD COLUMN IF NOT EXISTS is_homepage BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS filename TEXT;

-- 1.1. Ubah constraint event_id menjadi nullable untuk homepage photos
ALTER TABLE photos ALTER COLUMN event_id DROP NOT NULL;

-- 1.2. Ubah constraint filename menjadi nullable jika ada
ALTER TABLE photos ALTER COLUMN filename DROP NOT NULL;

-- 2. Update existing records untuk set default values
UPDATE photos 
SET 
  original_name = COALESCE(original_name, 'unknown.jpg'),
  uploader_name = COALESCE(uploader_name, 'Anonymous'),
  album_name = COALESCE(album_name, 'Tamu'),
  is_homepage = COALESCE(is_homepage, FALSE)
WHERE original_name IS NULL OR uploader_name IS NULL OR album_name IS NULL OR is_homepage IS NULL;

-- 3. Buat storage bucket 'photos' jika belum ada
-- (Ini harus dilakukan melalui Supabase Dashboard > Storage)
-- Bucket name: photos
-- Public: true
-- File size limit: 10MB
-- Allowed MIME types: image/*

-- 4. Set up RLS (Row Level Security) policies untuk bucket photos
-- (Ini juga harus dilakukan melalui Supabase Dashboard)

-- 5. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_photos_event_id ON photos(event_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_homepage ON photos(is_homepage);
CREATE INDEX IF NOT EXISTS idx_photos_album_name ON photos(album_name);
CREATE INDEX IF NOT EXISTS idx_photos_uploaded_at ON photos(uploaded_at DESC);

-- 6. Tambahkan constraint untuk validasi
ALTER TABLE photos 
ADD CONSTRAINT check_album_name 
CHECK (album_name IN ('Official', 'Tamu', 'Bridesmaid', 'Homepage'));

-- 7. Update schema untuk events jika diperlukan
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 8. Buat trigger untuk auto-update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_events_updated_at 
    BEFORE UPDATE ON events 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Buat function untuk increment likes (jika belum ada)
CREATE OR REPLACE FUNCTION increment_likes(photo_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE photos 
    SET likes = COALESCE(likes, 0) + 1 
    WHERE id = photo_id;
END;
$$ LANGUAGE plpgsql;

-- 10. Buat function untuk increment hearts (jika belum ada)
CREATE OR REPLACE FUNCTION increment_hearts(message_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE messages 
    SET hearts = COALESCE(hearts, 0) + 1 
    WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;