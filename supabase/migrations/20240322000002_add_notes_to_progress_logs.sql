ALTER TABLE progress_logs ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
alter publication supabase_realtime add table progress_logs;