/**
 * Extracts a filename from a Supabase storage URL.
 * E.g. 'https://.../bucket/path/to/file.jpg' -> 'file.jpg'
 */
export function extractFilenameFromUrl(url: string | null): string | null {
  if (!url) return null;
  return url.split('/').pop() || null;
}

/**
 * Extracts the storage object path from a public Supabase URL.
 * E.g. '.../storage/v1/object/public/memory-photos/abc/file.jpg' -> 'abc/file.jpg'
 */
export function extractStorageObjectPathFromUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const marker = '/storage/v1/object/public/';
    const markerIndex = parsed.pathname.indexOf(marker);

    if (markerIndex === -1) {
      return extractFilenameFromUrl(url);
    }

    const bucketAndPath = parsed.pathname.slice(markerIndex + marker.length);
    const slashIndex = bucketAndPath.indexOf('/');
    if (slashIndex === -1) {
      return null;
    }

    const objectPath = bucketAndPath.slice(slashIndex + 1);
    return objectPath ? decodeURIComponent(objectPath) : null;
  } catch {
    return extractFilenameFromUrl(url);
  }
}
