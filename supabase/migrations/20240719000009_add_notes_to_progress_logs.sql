ALTER TABLE progress_logs
ADD COLUMN IF NOT EXISTS notes TEXT;

alter publication supabase_realtime add table progress_logs;