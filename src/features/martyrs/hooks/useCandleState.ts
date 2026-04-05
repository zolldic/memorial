import { useState, useEffect } from 'react';

const CANDLE_STORAGE_KEY = 'memorial-candles-lit';

export function useCandleState(martyrId: string | undefined) {
  const [candleLit, setCandleLit] = useState(false);
  const [optimisticCandles, setOptimisticCandles] = useState(0);

  // Load candle state from localStorage on mount
  useEffect(() => {
    if (!martyrId) return;
    
    try {
      const stored = localStorage.getItem(CANDLE_STORAGE_KEY);
      if (stored) {
        const litCandles = JSON.parse(stored) as string[];
        if (litCandles.includes(martyrId)) {
          setCandleLit(true);
          setOptimisticCandles(1);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [martyrId]);

  const lightCandle = () => {
    if (!martyrId || candleLit) return;

    try {
      const stored = localStorage.getItem(CANDLE_STORAGE_KEY);
      const litCandles = stored ? (JSON.parse(stored) as string[]) : [];
      
      if (!litCandles.includes(martyrId)) {
        litCandles.push(martyrId);
        localStorage.setItem(CANDLE_STORAGE_KEY, JSON.stringify(litCandles));
      }
    } catch {
      // Ignore localStorage errors
    }

    setOptimisticCandles(1);
    setCandleLit(true);
  };

  return {
    candleLit,
    optimisticCandles,
    lightCandle
  };
}
