/**
 * Generates or retrieves a unique session ID for tracking anonymous events 
 * (like lighting candles without logging in).
 */
export function getSessionId(): string {
  let sessionId = localStorage.getItem('memorial_session_id');
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('memorial_session_id', sessionId);
  }
  
  return sessionId;
}
