import type { Language } from '@/shared/types';

export function localized<T extends { labelEn: string; labelAr: string }>(
  item: T, lang: Language
): string {
  return lang === 'en' ? item.labelEn : item.labelAr;
}
