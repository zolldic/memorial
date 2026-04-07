import { supabase } from "@/lib/supabase";

/**
 * Generate a unique session ID for tracking candle events
 */
function getSessionId(): string {
  let sessionId = localStorage.getItem('memorial_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('memorial_session_id', sessionId);
  }
  
  return sessionId;
}

export const candleService = {
  /**
   * Light a candle for a martyr
   */
  lightCandle: async (martyrId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const sessionId = getSessionId();

      // Check if this session already lit a candle for this martyr
      const { data: existing } = await supabase
        .from('candle_events')
        .select('id')
        .eq('martyr_id', martyrId)
        .eq('session_id', sessionId)
        .single();

      if (existing) {
        return { success: false, error: 'Already lit a candle for this martyr' };
      }

      // Insert candle event
      const { error } = await supabase
        .from('candle_events')
        .insert({
          martyr_id: martyrId,
          session_id: sessionId
        });

      if (error) {
        console.error('Error lighting candle:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Unexpected error lighting candle:', err);
      return { success: false, error: 'An unexpected error occurred' };
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
