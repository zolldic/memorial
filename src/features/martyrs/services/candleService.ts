import { supabase } from "@/lib/supabase";
import { getSessionId } from "@/lib/session";
import { getErrorMessage } from '@/shared/utils/supabaseError';


export const candleService = {
  /**
   * Light a candle for a martyr
   */
  lightCandle: async (martyrId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const sessionId = getSessionId();

      // Insert candle event
      const { error } = await supabase
        .from('candle_events')
        .insert({
          martyr_id: martyrId,
          session_id: sessionId
        });

      if (error) {
        if (error.code === '23505') {
          return { success: false, error: 'Already lit a candle for this martyr' };
        }

        console.error('Error lighting candle:', error);
        return { success: false, error: getErrorMessage(error, 'Could not light candle') };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error lighting candle:', err);
      return { success: false, error: getErrorMessage(err, 'An unexpected error occurred') };
    }
  },

  /**
   * Check if the current session has lit a candle for a martyr
   */
  hasLitCandle: async (martyrId: string): Promise<boolean> => {
    try {
      const sessionId = getSessionId();

      const { data } = await supabase
        .from('candle_events')
        .select('id')
        .eq('martyr_id', martyrId)
        .eq('session_id', sessionId)
        .single();

      return !!data;
    } catch {
      return false;
    }
  },
};
