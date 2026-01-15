-- Test Data for Development
-- Execute this AFTER running the initial schema migration
-- This creates a test event and sample data

-- Insert a test event
INSERT INTO events (name, start_time, end_time, location, status)
VALUES (
  '示例同人展 2026',
  '2026-02-01 09:00:00+08',
  '2026-02-01 17:00:00+08',
  '东京国际展示场',
  'upcoming'
)
RETURNING id;

-- Note: After running this, copy the returned event ID and update VITE_EVENT_ID in .env.local
-- Example: VITE_EVENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

-- To insert test providers and giveaways, you'll need authenticated users first.
-- For now, you can manually insert test data through Supabase Dashboard or use the API.
