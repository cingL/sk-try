-- Complete Test Data Script
-- This script creates a full set of test data including event, providers, and giveaways
-- 
-- IMPORTANT: You need at least one authenticated user first!
-- To create a test user:
-- 1. Go to Supabase Dashboard -> Authentication -> Users
-- 2. Click "Add user" -> "Create new user"
-- 3. Enter email and password (or use Magic Link)
-- 4. Copy the user ID from the users list

-- Step 1: Create test event
DO $$
DECLARE
  test_event_id UUID;
  test_user_id UUID;
  test_provider_id UUID;
BEGIN
  -- Get or create test event
  SELECT id INTO test_event_id 
  FROM events 
  WHERE name = '示例同人展 2026' 
  LIMIT 1;
  
  IF test_event_id IS NULL THEN
    INSERT INTO events (name, start_time, end_time, location, status)
    VALUES (
      '示例同人展 2026',
      '2026-02-01 09:00:00+08',
      '2026-02-01 17:00:00+08',
      '东京国际展示场',
      'upcoming'
    )
    RETURNING id INTO test_event_id;
    
    RAISE NOTICE 'Created event with ID: %', test_event_id;
  ELSE
    RAISE NOTICE 'Using existing event with ID: %', test_event_id;
  END IF;
  
  -- Get first authenticated user (you need to replace this with actual user ID)
  -- Or uncomment the line below to use a specific user ID
  -- test_user_id := 'YOUR_USER_ID_HERE'::UUID;
  
  SELECT id INTO test_user_id 
  FROM auth.users 
  LIMIT 1;
  
  IF test_user_id IS NULL THEN
    RAISE EXCEPTION 'No authenticated users found. Please create a user first in Authentication -> Users';
  END IF;
  
  RAISE NOTICE 'Using user ID: %', test_user_id;
  
  -- Create test provider
  INSERT INTO providers (user_id, name, booth_area, booth_number, external_links)
  VALUES (
    test_user_id,
    '测试社团',
    'A',
    '01',
    '[
      {
        "platform": "weibo",
        "username": "test_user",
        "url": "https://weibo.com/test_user"
      },
      {
        "platform": "rednote",
        "username": "test_user",
        "url": "https://www.xiaohongshu.com/user/profile/test_user"
      }
    ]'::jsonb
  )
  ON CONFLICT (user_id) DO UPDATE
  SET name = EXCLUDED.name,
      booth_area = EXCLUDED.booth_area,
      booth_number = EXCLUDED.booth_number
  RETURNING id INTO test_provider_id;
  
  RAISE NOTICE 'Created/updated provider with ID: %', test_provider_id;
  
  -- Create test giveaways
  INSERT INTO giveaways (
    event_id,
    provider_id,
    title,
    description,
    images,
    category,
    status,
    pickup_condition
  )
  VALUES 
  (
    test_event_id,
    test_provider_id,
    '测试无料物品 1',
    '这是一个测试用的无料物品描述。包含详细的说明信息。',
    ARRAY['https://via.placeholder.com/300?text=Giveaway+1'],
    'goods',
    'available',
    '直接领取即可'
  ),
  (
    test_event_id,
    test_provider_id,
    '测试无料物品 2',
    '另一个测试物品的描述。',
    ARRAY['https://via.placeholder.com/300?text=Giveaway+2'],
    'print',
    'limited',
    '数量有限，先到先得'
  ),
  (
    test_event_id,
    test_provider_id,
    '测试数字内容',
    '这是一个数字内容的测试。',
    ARRAY['https://via.placeholder.com/300?text=Digital'],
    'digital',
    'available',
    NULL
  )
  ON CONFLICT DO NOTHING;
  
  RAISE NOTICE 'Created test giveaways';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Event ID: %', test_event_id;
  RAISE NOTICE 'Copy this ID to .env.local as VITE_EVENT_ID';
  RAISE NOTICE '========================================';
END $$;

-- Verify the data
SELECT 
  e.name as event_name,
  e.id as event_id,
  COUNT(DISTINCT p.id) as provider_count,
  COUNT(DISTINCT g.id) as giveaway_count
FROM events e
LEFT JOIN giveaways g ON g.event_id = e.id
LEFT JOIN providers p ON p.id = g.provider_id
WHERE e.name = '示例同人展 2026'
GROUP BY e.id, e.name;
