-- Database Fix untuk Messages Table
-- Jalankan di Supabase SQL Editor jika ingin membuat guest_name optional

-- Option 1: Make guest_name nullable (recommended)
ALTER TABLE messages ALTER COLUMN guest_name DROP NOT NULL;

-- Option 2: Set default value untuk guest_name
ALTER TABLE messages ALTER COLUMN guest_name SET DEFAULT 'Anonymous';

-- Option 3: Update existing NULL values
UPDATE messages SET guest_name = sender_name WHERE guest_name IS NULL;

-- Verify changes
SELECT column_name, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'messages' AND column_name = 'guest_name';