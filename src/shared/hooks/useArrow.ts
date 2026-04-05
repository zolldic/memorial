import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';

/**
 * Returns the correct arrow icon for the current language direction.
 *
 * In LTR (English): forward = →, back = ←
 * In RTL (Arabic):  forward = ←, back = →
 *
 * @example
 * const ForwardArrow = useDirectionalArrow('forward');
 * const BackArrow = useDirectionalArrow('back');
 */
export function useDirectionalArrow(direction: 'forward' | 'back' = 'forward') {
  const { lang } = useLanguage();
  const isRtl = lang === 'ar';

  if (direction === 'forward') return isRtl ? ArrowLeft : ArrowRight;
  return isRtl ? ArrowRight : ArrowLeft;
}
