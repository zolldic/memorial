import { supabase } from "@/lib/supabase";
import { frontendToDbMemory } from "@/lib/adapters/memoryAdapter";
import { Memory } from "@/shared/types";

export interface SubmitMemoryParams {
  martyrId: string;
  authorName: string;
  relationship: 'family' | 'friend' | 'stranger';
  type: 'story' | 'photo' | 'voice';
  contentEn?: string;
  contentAr?: string;
  photoUrl?: string;
  audioUrl?: string;
}

export const memoryService = {
  /**
   * Submit a new memory (will be unapproved by default)
   */
  submitMemory: async (params: SubmitMemoryParams): Promise<{ success: boolean; error?: string }> => {
    try {
      if (params.type === 'story' && !params.contentEn?.trim() && !params.contentAr?.trim()) {
        return { success: false, error: 'Story text is required.' };
      }
      if (params.type === 'photo' && !params.photoUrl) {
        return { success: false, error: 'A photo is required for photo memories.' };
      }
      if (params.type === 'voice' && !params.audioUrl) {
        return { success: false, error: 'Audio is required for voice memories.' };
      }

      // Convert to database format
      const dbData = frontendToDbMemory({
        martyrId: params.martyrId,
        authorName: params.authorName || 'Anonymous',
        relationship: params.relationship,
        type: params.type,
        contentEn: params.contentEn || '',
        contentAr: params.contentAr || '',
        photoUrl: params.photoUrl,
        audioUrl: params.audioUrl,
        approved: false,
      } as Partial<Memory>);

      const insertMemoryWithRetry = async (retries = 2) => {
        let lastError: unknown;
        for (let attempt = 0; attempt <= retries; attempt += 1) {
          const { data, error } = await supabase
            .from('memories')
            .insert(dbData.memory)
            .select()
            .single();
          if (!error) return { data, error: null };
          lastError = error;
          if (attempt < retries) {
            await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
          }
        }
        return { data: null, error: lastError as { message?: string } };
      };

      // Insert memory
      const { data: memoryData, error: memoryError } = await insertMemoryWithRetry();

      if (memoryError) {
        console.error('Error inserting memory:', memoryError);
        return { success: false, error: memoryError.message };
      }

      // Insert translations
      const translationsToInsert = dbData.translations.map(t => ({
        ...t,
        memory_id: memoryData.id
      }));

      if (translationsToInsert.length > 0) {
        const insertTranslationsWithRetry = async (retries = 1) => {
          let lastError: unknown;
          for (let attempt = 0; attempt <= retries; attempt += 1) {
            const { error } = await supabase
              .from('memory_translations')
              .insert(translationsToInsert);
            if (!error) return null;
            lastError = error;
            if (attempt < retries) {
              await new Promise((resolve) => setTimeout(resolve, 400));
            }
          }
          return lastError as { message?: string };
        };

        const translationError = await insertTranslationsWithRetry();

        if (translationError) {
          console.error('Error inserting translations:', translationError);
          // Memory was inserted but translations failed - still return success
          // Admin can add translations later
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error submitting memory:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  },

  /**
   * Upload a photo to Supabase Storage
   */
  uploadPhoto: async (file: File, martyrId: string): Promise<{ url?: string; error?: string }> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${martyrId}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('memory-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading photo:', error);
        return { error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memory-photos')
        .getPublicUrl(data.path);

      return { url: publicUrl };
    } catch (err) {
      console.error('Unexpected error uploading photo:', err);
      return { error: 'An unexpected error occurred' };
    }
  },

  /**
   * Upload audio to Supabase Storage
   */
  uploadAudio: async (blob: Blob, martyrId: string): Promise<{ url?: string; error?: string }> => {
    try {
      const fileName = `${martyrId}/${Date.now()}.webm`;

      const { data, error } = await supabase.storage
        .from('memory-audio')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'audio/webm'
        });

      if (error) {
        console.error('Error uploading audio:', error);
        return { error: error.message };
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('memory-audio')
        .getPublicUrl(data.path);

      return { url: publicUrl };
    } catch (err) {
      console.error('Unexpected error uploading audio:', err);
      return { error: 'An unexpected error occurred' };
    }
  },
};
