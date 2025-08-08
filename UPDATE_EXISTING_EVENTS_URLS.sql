-- Update existing events to use correct production domain
-- Run this script in Supabase SQL Editor to fix existing events

-- First, let's see what events currently have localhost URLs
SELECT 
  id, 
  name, 
  shareable_link, 
  qr_code,
  CASE 
    WHEN shareable_link LIKE '%localhost:3000%' THEN 'NEEDS UPDATE'
    WHEN shareable_link LIKE '%ipvhepiuwpol.ap-southeast-1.clawcloudrun.com%' THEN 'NEEDS UPDATE'
    ELSE 'OK'
  END as status
FROM events 
WHERE shareable_link IS NOT NULL;

-- Update shareable_link for events with localhost URLs
UPDATE events 
SET shareable_link = REPLACE(
  REPLACE(shareable_link, 'http://localhost:3000', 'https://hafiportrait.photography'),
  'https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com', 'https://hafiportrait.photography'
)
WHERE shareable_link LIKE '%localhost:3000%' 
   OR shareable_link LIKE '%ipvhepiuwpol.ap-southeast-1.clawcloudrun.com%';

-- Update QR code URLs for events with localhost URLs
UPDATE events 
SET qr_code = REPLACE(
  REPLACE(
    qr_code, 
    'http%3A%2F%2Flocalhost%3A3000', 
    'https%3A%2F%2Fhafiportrait.photography'
  ),
  'https%3A%2F%2Fipvhepiuwpol.ap-southeast-1.clawcloudrun.com',
  'https%3A%2F%2Fhafiportrait.photography'
)
WHERE qr_code LIKE '%localhost%3A3000%' 
   OR qr_code LIKE '%ipvhepiuwpol.ap-southeast-1.clawcloudrun.com%';

-- Also update any QR codes that might have unencoded URLs
UPDATE events 
SET qr_code = REPLACE(
  REPLACE(
    qr_code, 
    'http://localhost:3000', 
    'https://hafiportrait.photography'
  ),
  'https://ipvhepiuwpol.ap-southeast-1.clawcloudrun.com',
  'https://hafiportrait.photography'
)
WHERE qr_code LIKE '%localhost:3000%' 
   OR qr_code LIKE '%ipvhepiuwpol.ap-southeast-1.clawcloudrun.com%';

-- Verify the updates
SELECT 
  id, 
  name, 
  shareable_link, 
  qr_code,
  CASE 
    WHEN shareable_link LIKE '%localhost:3000%' THEN 'STILL HAS LOCALHOST'
    WHEN shareable_link LIKE '%ipvhepiuwpol.ap-southeast-1.clawcloudrun.com%' THEN 'STILL HAS OLD DOMAIN'
    WHEN shareable_link LIKE '%hafiportrait.photography%' THEN 'UPDATED'
    ELSE 'UNKNOWN'
  END as status
FROM events 
WHERE shareable_link IS NOT NULL
ORDER BY name;