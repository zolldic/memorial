import { useState, useEffect } from 'react';
import { candleService } from '@/features/martyrs/services/candleService';
import { toast } from 'sonner';

export function useCandleState(martyrId: string | undefined) {
  const [candleLit, setCandleLit] = useState(false);
  const [optimisticCandles, setOptimisticCandles] = useState(0);
  const [isLighting, setIsLighting] = useState(false);

  useEffect(() => {
    if (!martyrId) return;

    // Check if candle already lit
    candleService.hasLitCandle(martyrId).then(hasLit => {
      setCandleLit(hasLit);
      if (hasLit) setOptimisticCandles(1);
    });
  }, [martyrId]);

  const lightCandle = async () => {
    if (!martyrId || candleLit || isLighting) return;

    setIsLighting(true);

    try {
      const result = await candleService.lightCandle(martyrId);

      if (result.success) {
        setCandleLit(true);
        setOptimisticCandles(1);
        toast.success('Candle lit in remembrance');
      } else {
        if (result.error?.includes('Already lit')) {
          setCandleLit(true);
          setOptimisticCandles(1);
        } else {
          toast.error('Could not light candle. Please try again.');
        }
      }
    } catch (err) {
      console.error('Error lighting candle:', err);
      toast.error('Could not light candle. Please try again.');
    } finally {
      setIsLighting(false);
    }
  };

  return {
    candleLit,
    optimisticCandles,
    isLighting,
    lightCandle,
  };
}
