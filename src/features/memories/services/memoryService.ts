import { supabase } from "@/lib/supabase";
import { frontendToDbMemory } from "@/lib/adapters/memoryAdapter";
import { Memory } from "@/shared/types";
import { withRetry } from "@/shared/utils/retry";
import { uploadToStorage } from "@/lib/storage";
import { getErrorMessage } from '@/shared/utils/supabaseError';

export interface SubmitMemoryParams {
  martyrId: string;
  authorName: string;
  relationship: 'family' | 'friend' | 'stranger';
  type: 'story' | 'photo' | 'voice';
  contentEn?: string;
  contentAr?: string;
  photoUrl?: string;
  photoUrls?: string[];
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
        if (!params.photoUrls || params.photoUrls.length === 0) {
          return { success: false, error: 'At least one photo is required for photo memories.' };
        }
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
        photoUrl: params.photoUrl || params.photoUrls?.[0],
        photoUrls: params.photoUrls,
        audioUrl: params.audioUrl,
        approved: false,
      } as Partial<Memory>);

      // Insert memory
      const { data: memoryData, error: memoryError } = await withRetry(async () => {
        const { data, error } = await supabase
          .from('memories')
          .insert(dbData.memory)
          .select()
          .single();
        if (error) throw error;
        return { data, error: null };
      }, 2, 500);

      if (!memoryData) {
        return { success: false, error: getErrorMessage(memoryError, 'Failed to insert memory') };
      }

      // Insert translations
      const translationsToInsert = dbData.translations.map(t => ({
        ...t,
        memory_id: memoryData.id
      }));

      if (translationsToInsert.length > 0) {
        try {
          await withRetry(async () => {
            const { error } = await supabase
              .from('memory_translations')
              .insert(translationsToInsert);
            if (error) throw error;
          }, 1, 400);
        } catch (translationError) {
          console.error('Error inserting translations:', translationError);
          // Memory was inserted but translations failed - still return success
          // Admin can add translations later
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error submitting memory:', err);
      return { success: false, error: getErrorMessage(err, 'An unexpected error occurred') };
    }
  },

  /**
   * Upload a photo to Supabase Storage
   */
  uploadPhoto: async (file: File, martyrId: string): Promise<{ url?: string; error?: string }> => {
    const { url, error } = await uploadToStorage(file, {
      bucket: 'memory-photos',
      prefix: martyrId
    });
    return { url, error: error?.message };
  },

  /**
   * Upload audio to Supabase Storage
   */
  uploadAudio: async (blob: Blob, martyrId: string): Promise<{ url?: string; error?: string }> => {
    const { url, error } = await uploadToStorage(blob, {
      bucket: 'memory-audio',
      prefix: martyrId,
      extension: 'webm',
      contentType: 'audio/webm'
    });
    return { url, error: error?.message };
  },
};
