import { dbToFrontendMartyr, DbMartyrWithTranslations } from '@/lib/adapters/martyrAdapter';
import { dbToFrontendMemory, DbMemoryWithTranslations } from '@/lib/adapters/memoryAdapter';
import { supabase } from '@/lib/supabase';
import type { Martyr, Memory } from '@/shared/types';

function ensureMartyrId(martyrId?: string): string {
  if (!martyrId) {
    throw new Error('Martyr ID is required');
  }
  return martyrId;
}

export const martyrService = {
  async getMartyrs(): Promise<Martyr[]> {
    const { data, error } = await supabase
      .from('martyrs')
      .select(`
        id,
        age,
        date_of_martyrdom,
        image_url,
        candles,
        created_at,
        updated_at,
        martyr_translations (
          id,
          martyr_id,
          language,
          name,
          location,
          profession,
          story
        )
      `)
      .order('date_of_martyrdom', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((martyr) =>
      dbToFrontendMartyr({
        ...(martyr as DbMartyrWithTranslations),
        martyr_translations: (martyr.martyr_translations ?? []) as DbMartyrWithTranslations['martyr_translations'],
      })
    );
  },

  async getMartyrById(martyrId?: string): Promise<Martyr | null> {
    const id = ensureMartyrId(martyrId);

    const { data, error } = await supabase
      .from('martyrs')
      .select(`
        id,
        age,
        date_of_martyrdom,
        image_url,
        candles,
        created_at,
        updated_at,
        martyr_translations (
          id,
          martyr_id,
          language,
          name,
          location,
          profession,
          story
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      throw error;
    }

    return dbToFrontendMartyr({
      ...(data as DbMartyrWithTranslations),
      martyr_translations: (data.martyr_translations ?? []) as DbMartyrWithTranslations['martyr_translations'],
    });
  },

  async getMemoriesByMartyrId(martyrId?: string): Promise<Memory[]> {
    const id = ensureMartyrId(martyrId);

    const { data, error } = await supabase
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
        approved,
        submitted_at,
        approved_at,
        approved_by,
        memory_translations (
          id,
          memory_id,
          language,
          content,
          translated_by,
          translated_at
        )
      `)
      .eq('martyr_id', id)
      .eq('approved', true)
      .order('submitted_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((memory) =>
      dbToFrontendMemory({
        ...(memory as DbMemoryWithTranslations),
        memory_translations: (memory.memory_translations ?? []) as DbMemoryWithTranslations['memory_translations'],
      })
    );
  },

  async getMartyrDetail(martyrId?: string): Promise<{ martyr: Martyr | null; memories: Memory[] }> {
    const id = ensureMartyrId(martyrId);
    const [martyr, memories] = await Promise.all([
      this.getMartyrById(id),
      this.getMemoriesByMartyrId(id),
    ]);

    return {
      martyr,
      memories,
    };
  },
};
