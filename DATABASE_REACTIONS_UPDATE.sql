-- Database Update untuk Message Reactions Feature
-- Jalankan script ini di Supabase SQL Editor

-- 1. Add reactions column to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS reactions JSONB DEFAULT '{"love": 0, "laugh": 0, "wow": 0, "sad": 0, "angry": 0}';

-- 2. Update existing messages to have default reactions
UPDATE messages 
SET reactions = '{"love": 0, "laugh": 0, "wow": 0, "sad": 0, "angry": 0}'
WHERE reactions IS NULL;

-- 3. Create function to add reaction
CREATE OR REPLACE FUNCTION add_message_reaction(message_id UUID, reaction_type TEXT)
RETURNS VOID AS $$
DECLARE
    current_reactions JSONB;
    new_count INTEGER;
BEGIN
    -- Get current reactions
    SELECT reactions INTO current_reactions 
    FROM messages 
    WHERE id = message_id;
    
    -- If reactions is null, initialize it
    IF current_reactions IS NULL THEN
        current_reactions := '{"love": 0, "laugh": 0, "wow": 0, "sad": 0, "angry": 0}';
    END IF;
    
    -- Get current count for the reaction type
    new_count := COALESCE((current_reactions->>reaction_type)::INTEGER, 0) + 1;
    
    -- Update the specific reaction
    current_reactions := jsonb_set(current_reactions, ARRAY[reaction_type], to_jsonb(new_count));
    
    -- Update the message
    UPDATE messages 
    SET reactions = current_reactions 
    WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create function to set specific reaction count
CREATE OR REPLACE FUNCTION set_message_reaction(message_id UUID, reaction_type TEXT, count INTEGER)
RETURNS VOID AS $$
DECLARE
    current_reactions JSONB;
BEGIN
    -- Get current reactions
    SELECT reactions INTO current_reactions 
    FROM messages 
    WHERE id = message_id;
    
    -- If reactions is null, initialize it
    IF current_reactions IS NULL THEN
        current_reactions := '{"love": 0, "laugh": 0, "wow": 0, "sad": 0, "angry": 0}';
    END IF;
    
    -- Update the specific reaction
    current_reactions := jsonb_set(current_reactions, ARRAY[reaction_type], to_jsonb(count));
    
    -- Update the message
    UPDATE messages 
    SET reactions = current_reactions 
    WHERE id = message_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Create function to get total reactions for a message
CREATE OR REPLACE FUNCTION get_total_reactions(message_id UUID)
RETURNS INTEGER AS $$
DECLARE
    total INTEGER := 0;
    reactions_data JSONB;
BEGIN
    SELECT reactions INTO reactions_data 
    FROM messages 
    WHERE id = message_id;
    
    IF reactions_data IS NOT NULL THEN
        total := COALESCE((reactions_data->>'love')::INTEGER, 0) +
                COALESCE((reactions_data->>'laugh')::INTEGER, 0) +
                COALESCE((reactions_data->>'wow')::INTEGER, 0) +
                COALESCE((reactions_data->>'sad')::INTEGER, 0) +
                COALESCE((reactions_data->>'angry')::INTEGER, 0);
    END IF;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- 6. Create index for better performance on reactions
CREATE INDEX IF NOT EXISTS idx_messages_reactions ON messages USING GIN (reactions);

-- 7. Add constraint to validate reaction structure
ALTER TABLE messages 
ADD CONSTRAINT check_reactions_structure 
CHECK (
    reactions IS NULL OR (
        reactions ? 'love' AND 
        reactions ? 'laugh' AND 
        reactions ? 'wow' AND 
        reactions ? 'sad' AND 
        reactions ? 'angry' AND
        (reactions->>'love')::INTEGER >= 0 AND
        (reactions->>'laugh')::INTEGER >= 0 AND
        (reactions->>'wow')::INTEGER >= 0 AND
        (reactions->>'sad')::INTEGER >= 0 AND
        (reactions->>'angry')::INTEGER >= 0
    )
);

-- 8. Test the functions (optional)
-- INSERT INTO messages (event_id, guest_name, message) 
-- VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Test User', 'Test message for reactions');

-- SELECT add_message_reaction((SELECT id FROM messages LIMIT 1), 'love');
-- SELECT add_message_reaction((SELECT id FROM messages LIMIT 1), 'laugh');

-- 9. Verify the schema
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns
WHERE 
    table_name = 'messages' AND column_name = 'reactions';

-- 10. Show sample data
SELECT id, guest_name, message, reactions, hearts 
FROM messages 
LIMIT 3;