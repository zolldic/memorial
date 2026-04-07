-- Memorial Website Row Level Security Policies
-- Run this AFTER schema.sql

-- ===== ENABLE RLS ON ALL TABLES =====
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE martyrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE martyr_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE candle_events ENABLE ROW LEVEL SECURITY;

-- ===== PROFILES POLICIES =====
-- Only admins can view/modify profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== MARTYRS POLICIES =====
-- Public can read all martyrs
CREATE POLICY "Public can view martyrs"
  ON martyrs FOR SELECT
  USING (true);

-- Only admins can create/update/delete martyrs
CREATE POLICY "Admins can insert martyrs"
  ON martyrs FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update martyrs"
  ON martyrs FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete martyrs"
  ON martyrs FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== MARTYR TRANSLATIONS POLICIES =====
-- Public can read all martyr translations
CREATE POLICY "Public can view martyr translations"
  ON martyr_translations FOR SELECT
  USING (true);

-- Only admins can create/update/delete translations
CREATE POLICY "Admins can insert martyr translations"
  ON martyr_translations FOR INSERT
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can update martyr translations"
  ON martyr_translations FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins can delete martyr translations"
  ON martyr_translations FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== MEMORIES POLICIES =====
-- Public can view only APPROVED memories
CREATE POLICY "Public can view approved memories"
  ON memories FOR SELECT
  USING (approved = true);

-- Admins can view ALL memories (including pending)
CREATE POLICY "Admins can view all memories"
  ON memories FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Anyone can submit a memory (will be unapproved by default)
CREATE POLICY "Anyone can submit memories"
  ON memories FOR INSERT
  WITH CHECK (approved = false);

-- Only admins can update memories (to approve them)
CREATE POLICY "Admins can update memories"
  ON memories FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Only admins can delete memories
CREATE POLICY "Admins can delete memories"
  ON memories FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== MEMORY TRANSLATIONS POLICIES =====
-- Public can view translations of approved memories
CREATE POLICY "Public can view approved memory translations"
  ON memory_translations FOR SELECT
  USING (
    memory_id IN (
      SELECT id FROM memories WHERE approved = true
    )
  );

-- Admins can view all memory translations
CREATE POLICY "Admins can view all memory translations"
  ON memory_translations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Anyone can insert translations when submitting
CREATE POLICY "Anyone can insert memory translations"
  ON memory_translations FOR INSERT
  WITH CHECK (
    memory_id IN (
      SELECT id FROM memories WHERE approved = false
    )
  );

-- Only admins can update translations (for moderation)
CREATE POLICY "Admins can update memory translations"
  ON memory_translations FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Only admins can delete translations
CREATE POLICY "Admins can delete memory translations"
  ON memory_translations FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== CANDLE EVENTS POLICIES =====
-- Anyone can light a candle (insert)
CREATE POLICY "Anyone can light candles"
  ON candle_events FOR INSERT
  WITH CHECK (true);

-- Public can view candle events (for analytics)
CREATE POLICY "Public can view candle events"
  ON candle_events FOR SELECT
  USING (true);

-- Only admins can delete candle events
CREATE POLICY "Admins can delete candle events"
  ON candle_events FOR DELETE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
  RAISE NOTICE 'RLS policies created successfully!';
  RAISE NOTICE 'Security configured: Public can read approved content, admins can moderate';
END $$;
