import { supabase } from "@/lib/supabase";
import { dbToFrontendMartyr, type DbMartyrWithTranslations } from "@/lib/adapters/martyrAdapter";
import { dbToFrontendMemory, type DbMemoryWithTranslations } from "@/lib/adapters/memoryAdapter";
import { Martyr, Memory } from "@/shared/types";

export const martyrService = {
  getMartyrs: async (): Promise<Martyr[]> => {
    const { data, error } = await supabase
      .from('martyrs')
      .select('*, martyr_translations(*)')
      .order('date_of_martyrdom', { ascending: false });

    if (error) {
      console.error('Error fetching martyrs:', error);
      return [];
    }

    return (data as DbMartyrWithTranslations[]).map(dbToFrontendMartyr);
  },

  getMartyrById: async (id: string | undefined): Promise<Martyr | undefined> => {
    if (!id) return undefined;

    const { data, error } = await supabase
      .from('martyrs')
      .select('*, martyr_translations(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching martyr:', error);
      return undefined;
    }

    return dbToFrontendMartyr(data as DbMartyrWithTranslations);
  },

  getMemoriesByMartyrId: async (id: string | undefined): Promise<Memory[]> => {
    if (!id) return [];

    const { data, error } = await supabase
      .from('memories')
      .select('*, memory_translations(*)')
      .eq('martyr_id', id)
      .eq('approved', true)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Error fetching memories:', error);
      return [];
    }

    return (data as DbMemoryWithTranslations[]).map(dbToFrontendMemory);
  },

  searchMartyrs: async (query: string): Promise<Martyr[]> => {
    if (!query.trim()) {
      return martyrService.getMartyrs();
    }
    
    const { data, error } = await supabase
      .from('martyrs')
      .select('*, martyr_translations(*)')
      .or(`martyr_translations.name.ilike.%${query}%,martyr_translations.location.ilike.%${query}%,martyr_translations.story.ilike.%${query}%`)
      .order('date_of_martyrdom', { ascending: false });

    if (error) {
      console.error('Error searching martyrs:', error);
      return [];
    }

    return (data as DbMartyrWithTranslations[]).map(dbToFrontendMartyr);
  },
};
