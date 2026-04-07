import { useState } from 'react';
import { supabase } from '@/lib/supabase';

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
      return { 
        success: false, 
        error: 'Invalid file type. Please upload JPEG, PNG, or WebP images.' 
      };
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return { 
        success: false, 
        error: 'File too large. Maximum size is 5MB.' 
      };
    }

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Simulate progress (Supabase doesn't provide real progress)
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const { error: uploadError } = await supabase.storage
        .from('memory-photos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      setProgress(100);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('memory-photos')
        .getPublicUrl(filePath);

      return { success: true, url: data.publicUrl };
    } catch (err) {
      console.error('Error uploading photo:', err);
      return { 
        success: false, 
        error: 'Failed to upload photo. Please try again.' 
      };
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
