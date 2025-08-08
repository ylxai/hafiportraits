-- ================================================================
-- DATABASE HYBRID SYSTEM UPDATE - SAFE VERSION
-- Handle orphaned records sebelum recreate constraints
-- ================================================================

-- STEP 1: Drop constraints (if not already done)
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_event_id_fkey;
ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_event_id_fkey;

-- STEP 2: Convert types (if not already done)
ALTER TABLE events ALTER COLUMN id TYPE TEXT;
ALTER TABLE messages ALTER COLUMN event_id TYPE TEXT;

-- STEP 3: Add new columns (if not already done)
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS photographer_name TEXT DEFAULT 'Official Photographer',
ADD COLUMN IF NOT EXISTS album_name TEXT DEFAULT 'Official',
ADD COLUMN IF NOT EXISTS watermark_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS backup_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'dashboard';

-- ================================================================
-- STEP 4: HANDLE ORPHANED RECORDS
-- ================================================================

-- Check orphaned photos
SELECT 'Checking orphaned photos...' AS status;
SELECT 
    'Orphaned photos found: ' || COUNT(*) AS orphan_count
FROM photos p
LEFT JOIN events e ON p.event_id = e.id
WHERE e.id IS NULL;

-- Check orphaned messages
SELECT 'Checking orphaned messages...' AS status;
SELECT 
    'Orphaned messages found: ' || COUNT(*) AS orphan_count
FROM messages m
LEFT JOIN events e ON m.event_id = e.id
WHERE e.id IS NULL;

-- OPTION A: Clean orphaned records (RECOMMENDED)
-- Uncomment lines below to delete orphaned records:

-- DELETE FROM photos 
-- WHERE event_id NOT IN (SELECT id FROM events WHERE id IS NOT NULL);

-- DELETE FROM messages 
-- WHERE event_id NOT IN (SELECT id FROM events WHERE id IS NOT NULL);

-- OPTION B: Create placeholder events for orphaned records
-- Uncomment lines below to create placeholder events:

-- INSERT INTO events (id, name, date, created_at, updated_at, photographer_name, album_name, watermark_enabled, backup_enabled, created_via)
-- SELECT DISTINCT 
--     p.event_id,
--     'Recovered Event - ' || LEFT(p.event_id, 20),
--     CURRENT_DATE,
--     CURRENT_TIMESTAMP,
--     CURRENT_TIMESTAMP,
--     'Official Photographer',
--     'Official',
--     false,
--     true,
--     'recovered'
-- FROM photos p
-- LEFT JOIN events e ON p.event_id = e.id
-- WHERE e.id IS NULL
-- ON CONFLICT (id) DO NOTHING;

-- ================================================================
-- STEP 5: RECREATE CONSTRAINTS (AFTER CLEANUP)
-- ================================================================

-- This should work now after cleanup
ALTER TABLE photos 
ADD CONSTRAINT photos_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- ================================================================
-- STEP 6: UPDATE EXISTING EVENTS & ADD INDEXES
-- ================================================================

UPDATE events 
SET 
  photographer_name = COALESCE(photographer_name, 'Official Photographer'),
  album_name = COALESCE(album_name, 'Official'),
  watermark_enabled = COALESCE(watermark_enabled, false),
  backup_enabled = COALESCE(backup_enabled, true),
  created_via = COALESCE(created_via, 'dashboard')
WHERE 
  photographer_name IS NULL 
  OR album_name IS NULL 
  OR watermark_enabled IS NULL 
  OR backup_enabled IS NULL 
  OR created_via IS NULL;

CREATE INDEX IF NOT EXISTS idx_events_album_name ON events(album_name);
CREATE INDEX IF NOT EXISTS idx_events_photographer ON events(photographer_name);
CREATE INDEX IF NOT EXISTS idx_events_created_via ON events(created_via);

-- ================================================================
-- STEP 7: VERIFICATION
-- ================================================================

SELECT 'Database update completed successfully!' AS status;

-- Verify no more orphaned records
SELECT 
    'Orphaned photos after cleanup: ' || COUNT(*) AS final_orphan_count
FROM photos p
LEFT JOIN events e ON p.event_id = e.id
WHERE e.id IS NULL;

-- Verify all columns are TEXT
SELECT 
    table_name,
    column_name, 
    data_type,
    CASE 
        WHEN data_type = 'text' THEN '✅ TEXT'
        ELSE '❌ ' || data_type
    END AS conversion_status
FROM information_schema.columns 
WHERE (table_name = 'events' AND column_name = 'id')
   OR column_name LIKE '%event_id%'
ORDER BY table_name, column_name;

-- ================================================================
-- MANUAL STEPS REQUIRED:
-- ================================================================

-- 1. Review orphaned records count above
-- 2. Choose OPTION A (delete) or OPTION B (create placeholder events)
-- 3. Uncomment the chosen option lines
-- 4. Re-run this script

-- ================================================================