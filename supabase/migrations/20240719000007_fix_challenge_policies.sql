-- Enable RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can insert their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can update their own challenges" ON challenges;
DROP POLICY IF EXISTS "Users can delete their own challenges" ON challenges;
DROP POLICY IF EXISTS "Public read access" ON challenges;

-- Create new policies
CREATE POLICY "Enable read access for own challenges"
ON challenges FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for own challenges"
ON challenges FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for own challenges"
ON challenges FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Enable delete access for own challenges"
ON challenges FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE challenges;