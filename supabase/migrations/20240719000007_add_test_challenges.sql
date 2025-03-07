-- Enable RLS for challenges table
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON challenges;
DROP POLICY IF EXISTS "Public read access" ON challenges;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON challenges
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON challenges
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for users based on user_id" ON challenges
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id" ON challenges
    FOR DELETE USING (auth.uid() = user_id);

-- Add realtime
alter publication supabase_realtime add table challenges;