-- Verify Database Structure dan Data
-- Jalankan query ini untuk memastikan struktur database sudah benar

-- 1. Cek struktur tabel photos
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default,
    character_maximum_length
FROM 
    information_schema.columns
WHERE 
    table_name = 'photos'
ORDER BY 
    ordinal_position;

-- 2. Cek constraints yang ada
SELECT 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    cc.check_clause
FROM 
    information_schema.table_constraints tc
JOIN 
    information_schema.constraint_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
LEFT JOIN 
    information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE 
    tc.table_name = 'photos';

-- 3. Cek data yang mungkin bermasalah
SELECT 
    id,
    event_id,
    filename,
    is_homepage,
    album_name,
    uploaded_at
FROM 
    photos 
WHERE 
    filename IS NULL 
    OR (event_id IS NULL AND is_homepage = false)
    OR (event_id IS NOT NULL AND is_homepage = true)
    OR album_name NOT IN ('Official', 'Tamu', 'Bridesmaid', 'Homepage');

-- 4. Cek relasi dengan events
SELECT 
    p.id,
    p.event_id,
    e.id as existing_event_id
FROM 
    photos p
LEFT JOIN 
    events e ON p.event_id = e.id
WHERE 
    p.event_id IS NOT NULL 
    AND e.id IS NULL;

-- 5. Cek storage files yang tidak terhubung
-- (Ini perlu dijalankan manual di Supabase storage)

-- 6. Fix data yang bermasalah (jika ada)
UPDATE photos 
SET filename = CONCAT(EXTRACT(EPOCH FROM NOW())::text, '_', substr(md5(random()::text), 1, 8), '.jpg')
WHERE filename IS NULL;

UPDATE photos 
SET is_homepage = false 
WHERE is_homepage IS NULL;

UPDATE photos 
SET album_name = 'Tamu' 
WHERE album_name IS NULL;