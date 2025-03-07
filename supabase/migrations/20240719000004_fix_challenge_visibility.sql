-- Make all challenges visible to all users by removing user_id filter
ALTER TABLE challenges DROP CONSTRAINT IF EXISTS challenges_user_id_fkey;

-- Add a policy to allow all users to see all challenges
DROP POLICY IF EXISTS "Allow all users to see all challenges" ON challenges;
CREATE POLICY "Allow all users to see all challenges"
ON challenges FOR SELECT
USING (true);

-- Enable RLS on challenges table
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Add policy for inserting challenges
DROP POLICY IF EXISTS "Allow authenticated users to insert their own challenges" ON challenges;
CREATE POLICY "Allow authenticated users to insert their own challenges"
ON challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for challenges
alter publication supabase_realtime add table challenges;