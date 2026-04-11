import { Memory, Language, MemoryType, Relationship } from '@/shared/types';

// Database types
export interface DbMemory {
  id: string;
  martyr_id: string;
  author_name: string;
  relationship: Relationship;
  type: MemoryType;
  photo_url: string | null;
  photo_urls: string[] | null;
  audio_url: string | null;
  approved: boolean;
  submitted_at: string;
  approved_at: string | null;
  approved_by: string | null;
}

export interface DbMemoryTranslation {
  id: string;
  memory_id: string;
  language: Language;
  content: string;
  translated_by: string | null;
  translated_at: string;
}

export interface DbMemoryWithTranslations extends DbMemory {
  memory_translations: DbMemoryTranslation[];
}

/**
 * Convert database memory + translations to frontend Memory type
 */
export function dbToFrontendMemory(
  dbMemory: DbMemoryWithTranslations
): Memory {
  const enTranslation = dbMemory.memory_translations.find(
    (t) => t.language === 'en'
  );
  const arTranslation = dbMemory.memory_translations.find(
    (t) => t.language === 'ar'
  );

  return {
    id: dbMemory.id,
    martyrId: dbMemory.martyr_id,
    authorName: dbMemory.author_name,
    relationship: dbMemory.relationship,
    type: dbMemory.type,
    contentEn: enTranslation?.content || '',
    contentAr: arTranslation?.content || '',
    photoUrl: dbMemory.photo_url || dbMemory.photo_urls?.[0] || undefined,
    photoUrls: dbMemory.photo_urls || (dbMemory.photo_url ? [dbMemory.photo_url] : []),
    audioUrl: dbMemory.audio_url || undefined,
    date: new Date(dbMemory.submitted_at).toISOString().split('T')[0],
    approved: dbMemory.approved,
  };
}

/**
 * Convert frontend Memory submission to database inserts
 */
export function frontendToDbMemory(memory: Partial<Memory>) {
  return {
    memory: {
      martyr_id: memory.martyrId,
      author_name: memory.authorName || 'Anonymous',
      relationship: memory.relationship,
      type: memory.type,
      photo_url: memory.photoUrl || memory.photoUrls?.[0] || null,
      photo_urls: memory.photoUrls || (memory.photoUrl ? [memory.photoUrl] : []),
      audio_url: memory.audioUrl || null,
      approved: false, // Always start unapproved
    },
    translations: [
      {
        language: 'en' as Language,
        content: memory.contentEn || '',
      },
      {
        language: 'ar' as Language,
        content: memory.contentAr || '',
      },
    ].filter((t) => t.content.trim() !== ''), // Only include non-empty translations
  };
}
