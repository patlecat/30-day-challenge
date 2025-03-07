-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can view challenges they are invited to" ON challenges;

-- Create policy for users to view challenges they created
CREATE POLICY "Users can view their own challenges"
ON challenges FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for users to view challenges they are invited to
CREATE POLICY "Users can view challenges they are invited to"
ON challenges FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM challenge_participants
    WHERE challenge_participants.challenge_id = challenges.id
    AND challenge_participants.user_id = auth.uid()
  )
);

-- Enable RLS on challenges table
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Make sure realtime is enabled for challenges
alter publication supabase_realtime add table challenges;