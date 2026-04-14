import { supabase } from '@/lib/supabase';
import { extractStorageObjectPathFromUrl } from '@/shared/utils/url';

export interface MemoryMediaRow {
  photo_url: string | null;
  photo_urls: string[] | null;
  audio_url: string | null;
}

function toUniquePaths(paths: Array<string | null | undefined>): string[] {
  return Array.from(new Set(paths.filter((value): value is string => Boolean(value))));
}

export function collectMemoryMediaPaths(memories: MemoryMediaRow[]) {
  const photoPaths = toUniquePaths(
    memories.flatMap((memory) => [
      extractStorageObjectPathFromUrl(memory.photo_url),
      ...(memory.photo_urls ?? []).map((url) => extractStorageObjectPathFromUrl(url)),
    ])
  );

  const audioPaths = toUniquePaths(
    memories.map((memory) => extractStorageObjectPathFromUrl(memory.audio_url))
  );

  return { photoPaths, audioPaths };
}

export async function cleanupMemoryMediaFiles(memories: MemoryMediaRow[]): Promise<void> {
  const { photoPaths, audioPaths } = collectMemoryMediaPaths(memories);

  const operations: Promise<{ error: Error | null }>[] = [];

  if (photoPaths.length > 0) {
    operations.push(
      supabase.storage
        .from('memory-photos')
        .remove(photoPaths)
        .then(({ error }) => ({ error: error as Error | null }))
    );
  }

  if (audioPaths.length > 0) {
    operations.push(
      supabase.storage
        .from('memory-audio')
        .remove(audioPaths)
        .then(({ error }) => ({ error: error as Error | null }))
    );
  }

  if (operations.length === 0) {
    return;
  }

  const results = await Promise.all(operations);
  const firstError = results.find((result) => result.error)?.error;
  if (firstError) {
    throw firstError;
  }
}
