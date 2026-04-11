-- Memorial Website Database Schema
-- Run this in Supabase SQL Editor

-- ===== PROFILES TABLE =====
-- Admin user management
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== MARTYRS TABLE =====
-- Core martyr information (language-neutral)
CREATE TABLE IF NOT EXISTS martyrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  age INTEGER NOT NULL,
  date_of_martyrdom DATE NOT NULL,
  image_url TEXT,
  candles INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== MARTYR TRANSLATIONS TABLE =====
-- Bilingual content for martyrs
CREATE TABLE IF NOT EXISTS martyr_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  martyr_id UUID NOT NULL REFERENCES martyrs(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'ar')),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  profession TEXT NOT NULL,
  story TEXT NOT NULL,
  UNIQUE(martyr_id, language)
);

-- ===== MEMORIES TABLE =====
-- User submissions (with moderation)
CREATE TABLE IF NOT EXISTS memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  martyr_id UUID NOT NULL REFERENCES martyrs(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  relationship TEXT NOT NULL CHECK (relationship IN ('family', 'friend', 'stranger')),
  type TEXT NOT NULL CHECK (type IN ('story', 'photo', 'voice')),
  photo_url TEXT,
  photo_urls TEXT[] DEFAULT '{}',
  audio_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

-- ===== MEMORY TRANSLATIONS TABLE =====
-- Bilingual content for memories
CREATE TABLE IF NOT EXISTS memory_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  memory_id UUID NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
  language TEXT NOT NULL CHECK (language IN ('en', 'ar')),
  content TEXT NOT NULL,
  translated_by UUID REFERENCES auth.users(id),
  translated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(memory_id, language)
);

-- ===== CANDLE EVENTS TABLE =====
-- Track candle lighting events (append-only)
CREATE TABLE IF NOT EXISTS candle_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  martyr_id UUID NOT NULL REFERENCES martyrs(id) ON DELETE CASCADE,
  session_id TEXT,
  lit_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===== INDEXES FOR PERFORMANCE =====

-- Martyr lookups
CREATE INDEX IF NOT EXISTS idx_martyrs_date ON martyrs(date_of_martyrdom DESC);
CREATE INDEX IF NOT EXISTS idx_martyr_translations_martyr_id ON martyr_translations(martyr_id);
CREATE INDEX IF NOT EXISTS idx_martyr_translations_language ON martyr_translations(language);

-- Memory lookups
CREATE INDEX IF NOT EXISTS idx_memories_martyr_id ON memories(martyr_id);
CREATE INDEX IF NOT EXISTS idx_memories_approved ON memories(approved);
CREATE INDEX IF NOT EXISTS idx_memory_translations_memory_id ON memory_translations(memory_id);
CREATE INDEX IF NOT EXISTS idx_memory_translations_language ON memory_translations(language);

-- Candle lookups
CREATE INDEX IF NOT EXISTS idx_candle_events_martyr_id ON candle_events(martyr_id);
CREATE INDEX IF NOT EXISTS idx_candle_events_session_id ON candle_events(session_id);

-- ===== TRIGGER: AUTO-UPDATE updated_at =====
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_martyrs_updated_at
  BEFORE UPDATE ON martyrs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===== MATERIALIZED VIEW: CANDLE COUNTS =====
-- Automatically update martyr candle counts
CREATE OR REPLACE FUNCTION update_martyr_candles()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE martyrs
  SET candles = (
    SELECT COUNT(*)
    FROM candle_events
    WHERE martyr_id = NEW.martyr_id
  )
  WHERE id = NEW.martyr_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_candles_on_insert
  AFTER INSERT ON candle_events
  FOR EACH ROW
  EXECUTE FUNCTION update_martyr_candles();

-- ===== SUCCESS MESSAGE =====
DO $$
BEGIN
  RAISE NOTICE 'Memorial database schema created successfully!';
  RAISE NOTICE 'Tables: profiles, martyrs, martyr_translations, memories, memory_translations, candle_events';
  RAISE NOTICE 'Next step: Set up RLS policies';
END $$;
