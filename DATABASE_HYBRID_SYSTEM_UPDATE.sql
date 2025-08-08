-- ================================================================
-- DATABASE HYBRID SYSTEM UPDATE
-- Complete database standardization untuk DSLR Hybrid Event Manager
-- 
-- Purpose: Convert all event ID columns to TEXT dan add hybrid columns
-- Date: 2025-01-07
-- Version: Week 1 Implementation
-- ================================================================

-- CURRENT STATE BEFORE UPDATE:
-- events.id          : uuid      ❌ PERLU DIUBAH
-- messages.event_id  : uuid      ❌ PERLU DIUBAH  
-- photos.event_id    : text      ✅ SUDAH TEXT
-- photos_optimized.event_id : text ✅ SUDAH TEXT

-- TARGET STATE AFTER UPDATE:
-- ALL event ID columns will be TEXT for consistency

-- ================================================================
-- STEP 1: DROP FOREIGN KEY CONSTRAINTS
-- ================================================================

-- Note: photos_optimized is a VIEW, not a table, so no constraints to drop
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_event_id_fkey;
ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_event_id_fkey;

-- ================================================================
-- STEP 2: CONVERT UUID COLUMNS TO TEXT
-- ================================================================

-- Convert events.id from UUID to TEXT
ALTER TABLE events ALTER COLUMN id TYPE TEXT;

-- Convert messages.event_id from UUID to TEXT
ALTER TABLE messages ALTER COLUMN event_id TYPE TEXT;

-- Note: photos & photos_optimized sudah TEXT, jadi tidak perlu diubah

-- ================================================================
-- STEP 3: ADD NEW COLUMNS FOR HYBRID SYSTEM
-- ================================================================

ALTER TABLE events 
ADD COLUMN IF NOT EXISTS photographer_name TEXT DEFAULT 'Official Photographer',
ADD COLUMN IF NOT EXISTS album_name TEXT DEFAULT 'Official',
ADD COLUMN IF NOT EXISTS watermark_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS backup_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS created_via TEXT DEFAULT 'dashboard';

-- ================================================================
-- STEP 4: RECREATE FOREIGN KEY CONSTRAINTS (ALL TEXT NOW)
-- ================================================================

-- Note: photos_optimized is a VIEW, so no foreign key constraints needed
ALTER TABLE photos 
ADD CONSTRAINT photos_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

ALTER TABLE messages 
ADD CONSTRAINT messages_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE;

-- ================================================================
-- STEP 5: UPDATE EXISTING EVENTS WITH DEFAULTS
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

-- ================================================================
-- STEP 6: ADD PERFORMANCE INDEXES
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_events_album_name ON events(album_name);
CREATE INDEX IF NOT EXISTS idx_events_photographer ON events(photographer_name);
CREATE INDEX IF NOT EXISTS idx_events_created_via ON events(created_via);

-- ================================================================
-- STEP 7: VERIFICATION QUERIES
-- ================================================================

-- Success message
SELECT 'Database standardization completed successfully!' AS status;

-- Verify all event ID columns are now TEXT
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

-- Verify new columns added
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'events' 
    AND column_name IN ('photographer_name', 'album_name', 'watermark_enabled', 'backup_enabled', 'created_via')
ORDER BY column_name;

-- Verify foreign key constraints recreated
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND ccu.table_name = 'events'
ORDER BY tc.table_name;

-- ================================================================
-- EXPECTED RESULTS AFTER UPDATE:
-- ================================================================

-- All Event ID Columns (should be TEXT):
-- events.id          : text      ✅ TEXT
-- messages.event_id  : text      ✅ TEXT
-- photos.event_id    : text      ✅ TEXT
-- photos_optimized.event_id : text ✅ TEXT

-- New Columns Added:
-- photographer_name  : text      'Official Photographer'::text
-- album_name         : text      'Official'::text
-- watermark_enabled  : boolean   false
-- backup_enabled     : boolean   true
-- created_via        : text      'dashboard'::text

-- ================================================================
-- POST-UPDATE TESTING COMMANDS:
-- ================================================================

-- Test CLI create event (should work without errors):
-- node dslr-hybrid-cli.js create "Wedding Sarah & John" 2025-01-15 "John Photographer" "Official"

-- Expected CLI output:
-- ✅ Event created locally: wedding-sarah-john-2025-01-15
-- ☁️ Event synced to Supabase: wedding-sarah-john-2025-01-15
-- ✅ Event created successfully!

-- ================================================================
-- ROLLBACK SCRIPT (IF NEEDED):
-- ================================================================

-- UNCOMMENT BELOW IF ROLLBACK IS NEEDED:
-- 
-- -- Drop new columns
-- ALTER TABLE events 
-- DROP COLUMN IF EXISTS photographer_name,
-- DROP COLUMN IF EXISTS album_name,
-- DROP COLUMN IF EXISTS watermark_enabled,
-- DROP COLUMN IF EXISTS backup_enabled,
-- DROP COLUMN IF EXISTS created_via;
-- 
-- -- Convert back to UUID (ONLY if original data was UUID format)
-- -- WARNING: This will fail if data is not valid UUID format
-- -- ALTER TABLE events ALTER COLUMN id TYPE UUID USING id::UUID;
-- -- ALTER TABLE messages ALTER COLUMN event_id TYPE UUID USING event_id::UUID;

-- ================================================================
-- END OF SCRIPT
-- ================================================================