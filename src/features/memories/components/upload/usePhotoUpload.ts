import { useState } from 'react';
import { uploadToStorage } from '@/lib/storage';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export function usePhotoUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadPhoto = async (file: File): Promise<UploadResult> => {
    // Validation
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return { success: false, error: 'invalid-type' };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { success: false, error: 'file-too-large' };
    }

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { url, error } = await uploadToStorage(file, {
        bucket: 'memory-photos',
        cacheControl: '3600',
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (error || !url) throw error || new Error('Upload failed');

      return { success: true, url };
    } catch (err) {
      console.error('Error uploading photo:', err);
      return { success: false, error: 'upload-failed' };
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return {
    uploadPhoto,
    uploading,
    progress,
  };
}
