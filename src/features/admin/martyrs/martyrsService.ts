import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/storage';
import { cleanupMemoryMediaFiles, type MemoryMediaRow } from '@/lib/storageCleanup';
import { extractStorageObjectPathFromUrl } from '@/shared/utils/url';
import { getErrorMessage } from '@/shared/utils/supabaseError';

export interface MartyrFormData {
  nameEn: string;
  nameAr: string;
  age?: number;
  locationEn: string;
  locationAr: string;
  professionEn: string;
  professionAr: string;
  storyEn: string;
  storyAr: string;
  dateOfMartyrdom: string;
  imageUrl?: string;
}

export interface MartyrListItem {
  id: string;
  nameEn: string;
  nameAr: string;
  age?: number;
  location: string;
  dateOfMartyrdom: string;
  imageUrl?: string;
  memoriesCount: number;
  candlesCount: number;
}

export async function getMartyrsForAdmin(): Promise<MartyrListItem[]> {
  const { data, error } = await supabase
    .from('martyrs')
    .select(`
      id,
      age,
      date_of_martyrdom,
      image_url,
      candles,
      martyr_translations (
        language,
        name,
        location
      ),
      memories (count)
    `)
    .order('date_of_martyrdom', { ascending: false });

  if (error) throw error;

  return (data || []).map((martyr: any) => {
    const translations = martyr.martyr_translations || [];
    return {
      id: martyr.id,
      nameEn: translations.find((t: any) => t.language === 'en')?.name || '',
      nameAr: translations.find((t: any) => t.language === 'ar')?.name || '',
      age: martyr.age,
      location: translations.find((t: any) => t.language === 'en')?.location || '',
      dateOfMartyrdom: martyr.date_of_martyrdom,
      imageUrl: martyr.image_url,
      memoriesCount: martyr.memories?.[0]?.count || 0,
      candlesCount: martyr.candles || 0,
    };
  });
}

export async function getMartyrForEdit(id: string): Promise<MartyrFormData | null> {
  const { data, error } = await supabase
    .from('martyrs')
    .select(`
      id,
      age,
      date_of_martyrdom,
      image_url,
      martyr_translations (
        language,
        name,
        location,
        profession,
        story
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  const translations = data.martyr_translations || [];
  const enTranslation = translations.find((t: any) => t.language === 'en') || {};
  const arTranslation = translations.find((t: any) => t.language === 'ar') || {};

  return {
    nameEn: enTranslation.name || '',
    nameAr: arTranslation.name || '',
    age: data.age,
    locationEn: enTranslation.location || '',
    locationAr: arTranslation.location || '',
    professionEn: enTranslation.profession || '',
    professionAr: arTranslation.profession || '',
    storyEn: enTranslation.story || '',
    storyAr: arTranslation.story || '',
    dateOfMartyrdom: data.date_of_martyrdom,
    imageUrl: data.image_url,
  };
}

export async function createMartyr(formData: MartyrFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Create martyr record
    const { data: martyr, error: martyrError } = await supabase
      .from('martyrs')
      .insert({
        age: formData.age ?? 0,
        date_of_martyrdom: formData.dateOfMartyrdom,
        image_url: formData.imageUrl || null,
      })
      .select()
      .single();

    if (martyrError) throw martyrError;

    // Create translations
    const translations = [
      {
        martyr_id: martyr.id,
        language: 'en',
        name: formData.nameEn,
        location: formData.locationEn,
        profession: formData.professionEn,
        story: formData.storyEn,
      },
      {
        martyr_id: martyr.id,
        language: 'ar',
        name: formData.nameAr,
        location: formData.locationAr,
        profession: formData.professionAr,
        story: formData.storyAr,
      },
    ];

    const { error: translationsError } = await supabase
      .from('martyr_translations')
      .insert(translations);

    if (translationsError) throw translationsError;

    return { success: true };
  } catch (err) {
    console.error('Error creating martyr:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to create martyr') };
  }
}

export async function updateMartyr(id: string, formData: MartyrFormData): Promise<{ success: boolean; error?: string }> {
  try {
    // Update martyr record
    const { error: martyrError } = await supabase
      .from('martyrs')
      .update({
        age: formData.age ?? 0,
        date_of_martyrdom: formData.dateOfMartyrdom,
        image_url: formData.imageUrl || null,
      })
      .eq('id', id);

    if (martyrError) throw martyrError;

    // Upsert both translations by (martyr_id, language)
    const { error: translationsError } = await supabase
      .from('martyr_translations')
      .upsert(
        [
          {
            martyr_id: id,
            language: 'en',
            name: formData.nameEn,
            location: formData.locationEn,
            profession: formData.professionEn,
            story: formData.storyEn,
          },
          {
            martyr_id: id,
            language: 'ar',
            name: formData.nameAr,
            location: formData.locationAr,
            profession: formData.professionAr,
            story: formData.storyAr,
          },
        ],
        {
          onConflict: 'martyr_id,language',
        }
      );

    if (translationsError) throw translationsError;

    return { success: true };
  } catch (err) {
    console.error('Error updating martyr:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to update martyr') };
  }
}

export async function deleteMartyr(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Delete associated memories storage
    const { data: memories, error: memoriesError } = await supabase
      .from('memories')
      .select('photo_url, photo_urls, audio_url')
      .eq('martyr_id', id);

    if (memoriesError) throw memoriesError;

    if (memories && memories.length > 0) {
      await cleanupMemoryMediaFiles(memories as MemoryMediaRow[]);
    }

    // 2. Delete martyr image from storage
    const { data: martyr } = await supabase.from('martyrs').select('image_url').eq('id', id).single();
    if (martyr?.image_url) {
      const objectPath = extractStorageObjectPathFromUrl(martyr.image_url);
      if (objectPath) {
        const { error: removeImageError } = await supabase.storage.from('martyr-images').remove([objectPath]);
        if (removeImageError) throw removeImageError;
      }
    }

    // 3. Delete martyr (cascades to memories and translations)
    const { error } = await supabase
      .from('martyrs')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    console.error('Error deleting martyr:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to delete martyr') };
  }
}

export async function uploadMartyrImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { url, error } = await uploadToStorage(file, {
      bucket: 'martyr-images',
      cacheControl: '3600',
    });

    if (error || !url) throw error || new Error('Failed to upload image');

    return { success: true, url };
  } catch (err) {
    console.error('Error uploading image:', err);
    return { success: false, error: getErrorMessage(err, 'Failed to upload image') };
  }
}
