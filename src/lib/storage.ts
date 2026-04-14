import { supabase } from "@/lib/supabase";

export interface UploadOptions {
  bucket: string;
  prefix?: string;
  extension?: string;
  contentType?: string;
  cacheControl?: string;
}

/**
 * Shared utility for uploading files to Supabase storage.
 * Generates a unique filename and returns the public URL.
 */
export async function uploadToStorage(
  fileOrBlob: File | Blob,
  options: UploadOptions
): Promise<{ url?: string; path?: string; error?: Error }> {
  try {
    let fileExt = options.extension;
    if (!fileExt && 'name' in fileOrBlob) {
      fileExt = fileOrBlob.name.split('.').pop() || 'tmp';
    } else if (!fileExt) {
      fileExt = 'tmp';
    }

    const safePrefix = options.prefix ? `${options.prefix}/` : '';
    const uniqueId =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const fileName = `${safePrefix}${uniqueId}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(options.bucket)
      .upload(fileName, fileOrBlob, {
        cacheControl: options.cacheControl || '3600',
        upsert: false,
        contentType: options.contentType
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(uploadData.path);

    return { url: data.publicUrl, path: uploadData.path };
  } catch (error) {
    console.error(`Error uploading to ${options.bucket}:`, error);
    return { error: error as Error };
  }
}
