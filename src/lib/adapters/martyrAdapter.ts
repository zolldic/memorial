import { Martyr, Language } from '@/shared/types';

// Database types
export interface DbMartyr {
  id: string;
  age: number;
  date_of_martyrdom: string;
  image_url: string | null;
  candles: number;
  created_at: string;
  updated_at: string;
}

export interface DbMartyrTranslation {
  id: string;
  martyr_id: string;
  language: Language;
  name: string;
  location: string;
  profession: string;
  story: string;
}

export interface DbMartyrWithTranslations extends DbMartyr {
  martyr_translations: DbMartyrTranslation[];
}

/**
 * Convert database martyr + translations to frontend Martyr type
 */
export function dbToFrontendMartyr(
  dbMartyr: DbMartyrWithTranslations
): Martyr {
  const enTranslation = dbMartyr.martyr_translations.find(
    (t) => t.language === 'en'
  );
  const arTranslation = dbMartyr.martyr_translations.find(
    (t) => t.language === 'ar'
  );

  return {
    id: dbMartyr.id,
    age: dbMartyr.age,
    dateOfMartyrdom: dbMartyr.date_of_martyrdom,
    image: dbMartyr.image_url || '/default.jpg',
    candles: dbMartyr.candles || 0,
    name: {
      en: enTranslation?.name || '',
      ar: arTranslation?.name || '',
    },
    location: {
      en: enTranslation?.location || '',
      ar: arTranslation?.location || '',
    },
    profession: {
      en: enTranslation?.profession || '',
      ar: arTranslation?.profession || '',
    },
    story: {
      en: enTranslation?.story || '',
      ar: arTranslation?.story || '',
    },
  };
}

/**
 * Convert frontend Martyr to database inserts
 */
export function frontendToDbMartyr(martyr: Partial<Martyr>) {
  return {
    martyr: {
      age: martyr.age,
      date_of_martyrdom: martyr.dateOfMartyrdom,
      image_url: martyr.image,
    },
    translations: [
      {
        language: 'en' as Language,
        name: martyr.name?.en || '',
        location: martyr.location?.en || '',
        profession: martyr.profession?.en || '',
        story: martyr.story?.en || '',
      },
      {
        language: 'ar' as Language,
        name: martyr.name?.ar || '',
        location: martyr.location?.ar || '',
        profession: martyr.profession?.ar || '',
        story: martyr.story?.ar || '',
      },
    ],
  };
}
