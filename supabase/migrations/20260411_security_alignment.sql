-- Security + data integrity hardening
-- Apply after schema.sql and rls-policies.sql

BEGIN;

-- Prevent duplicate candle events per martyr/session while keeping anonymous support.
CREATE UNIQUE INDEX IF NOT EXISTS idx_candle_events_unique_session
  ON public.candle_events (martyr_id, session_id)
  WHERE session_id IS NOT NULL;

-- Ensure approval metadata is set by database logic when moderation flips approved=true.
CREATE OR REPLACE FUNCTION public.set_memory_approval_metadata()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.approved IS TRUE AND COALESCE(OLD.approved, FALSE) IS FALSE THEN
    NEW.approved_at := COALESCE(NEW.approved_at, NOW());
    NEW.approved_by := COALESCE(NEW.approved_by, auth.uid());
  ELSIF NEW.approved IS FALSE THEN
    NEW.approved_at := NULL;
    NEW.approved_by := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_memory_approval_metadata ON public.memories;
CREATE TRIGGER trg_set_memory_approval_metadata
  BEFORE UPDATE ON public.memories
  FOR EACH ROW
  EXECUTE FUNCTION public.set_memory_approval_metadata();

-- Ensure translation edits are auditable and timestamped server-side.
CREATE OR REPLACE FUNCTION public.set_memory_translation_metadata()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.translated_at := NOW();

  IF auth.uid() IS NOT NULL THEN
    NEW.translated_by := auth.uid();
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_set_memory_translation_metadata ON public.memory_translations;
CREATE TRIGGER trg_set_memory_translation_metadata
  BEFORE UPDATE ON public.memory_translations
  FOR EACH ROW
  EXECUTE FUNCTION public.set_memory_translation_metadata();

-- Versioned storage policies for deterministic environments.
DROP POLICY IF EXISTS "Public read memorial media" ON storage.objects;
DROP POLICY IF EXISTS "Public upload memory media" ON storage.objects;
DROP POLICY IF EXISTS "Admins upload martyr images" ON storage.objects;
DROP POLICY IF EXISTS "Admins delete memorial media" ON storage.objects;

CREATE POLICY "Public read memorial media"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id IN ('memory-photos', 'memory-audio', 'martyr-images')
  );

CREATE POLICY "Public upload memory media"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id IN ('memory-photos', 'memory-audio')
  );

CREATE POLICY "Admins upload martyr images"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'martyr-images'
    AND auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

CREATE POLICY "Admins delete memorial media"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id IN ('memory-photos', 'memory-audio', 'martyr-images')
    AND auth.uid() IN (
      SELECT id FROM public.profiles WHERE role = 'admin'
    )
  );

COMMIT;
