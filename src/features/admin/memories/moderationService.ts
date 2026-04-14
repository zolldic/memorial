import { supabase } from '@/lib/supabase';
import { cleanupMemoryMediaFiles, type MemoryMediaRow } from '@/lib/storageCleanup';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export interface PendingMemory {
  id: string;
  martyrId: string;
  martyrName: { en: string; ar: string };
  authorName: string;
  relationship: string;
  type: string;
  contentEn: string;
  contentAr: string;
  photoUrl?: string;
  photoUrls?: string[];
  audioUrl?: string;
  submittedAt: string;
}

export async function getPendingMemories(): Promise<PendingMemory[]> {
  const { data: memories, error } = await supabase
    .from('memories')
    .select(`
      id,
      martyr_id,
      author_name,
      relationship,
      type,
      photo_url,
      photo_urls,
      audio_url,
      submitted_at,
      memory_translations (
        language,
        content
      ),
      martyrs (
        id,
        martyr_translations (
          language,
          name
        )
      )
    `)
    .eq('approved', false)
    .order('submitted_at', { ascending: false });

  if (error) throw error;

  return (memories || []).map((memory: any) => {
    const translations = memory.memory_translations || [];
    const martyrTranslations = memory.martyrs?.martyr_translations || [];

    return {
      id: memory.id,
      martyrId: memory.martyr_id,
      martyrName: {
        en: martyrTranslations.find((t: any) => t.language === 'en')?.name || '',
        ar: martyrTranslations.find((t: any) => t.language === 'ar')?.name || '',
      },
      authorName: memory.author_name,
      relationship: memory.relationship,
      type: memory.type,
      contentEn: translations.find((t: any) => t.language === 'en')?.content || '',
      contentAr: translations.find((t: any) => t.language === 'ar')?.content || '',
      photoUrl: memory.photo_url,
      photoUrls: memory.photo_urls || (memory.photo_url ? [memory.photo_url] : []),
      audioUrl: memory.audio_url,
      submittedAt: memory.submitted_at,
    };
  });
}

export async function approveMemory(memoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('memories')
      .update({ approved: true })
      .eq('id', memoryId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error approving memory:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to approve memory') };
  }
}



export async function rejectMemory(memoryId: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Fetch memory media to clean up storage
    const { data: memory } = await supabase
      .from('memories')
      .select('photo_url, photo_urls, audio_url')
      .eq('id', memoryId)
      .single();

    if (memory) {
      await cleanupMemoryMediaFiles([memory as MemoryMediaRow]);
    }

    // 2. Delete the record
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error rejecting memory:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to reject memory') };
  }
}

export async function updateMemoryTranslation(
  memoryId: string,
  language: 'en' | 'ar',
  content: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('memory_translations')
      .update({ content })
      .eq('memory_id', memoryId)
      .eq('language', language);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error updating translation:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to update translation') };
  }
}
