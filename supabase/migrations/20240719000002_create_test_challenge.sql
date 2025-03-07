-- Insert a test challenge if none exist
INSERT INTO challenges (id, title, description, type, daily_goal, user_id, created_at)
SELECT 
  gen_random_uuid(), 
  '30 Days of Running', 
  'Run every day for 30 days to build a healthy habit', 
  'distance', 
  '5|km', 
  auth.uid(), 
  now()
FROM auth.users
WHERE NOT EXISTS (SELECT 1 FROM challenges LIMIT 1);

-- Enable realtime for progress_logs if not already enabled
alter publication supabase_realtime add table progress_logs;