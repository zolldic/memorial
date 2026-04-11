import { useEffect, useRef, useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePhotoUpload } from './usePhotoUpload';

interface MultiPhotoUploadProps {
  initialUrls?: string[];
  onPhotosChanged: (urls: string[]) => void;
  maxPhotos?: number;
}

export function MultiPhotoUpload({
  initialUrls = [],
  onPhotosChanged,
  maxPhotos = 6,
}: MultiPhotoUploadProps) {
  const { t } = useTranslation('dashboard');
  const { uploadPhoto, uploading } = usePhotoUpload();
  const [photoUrls, setPhotoUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotoUrls(initialUrls);
  }, [initialUrls]);

  const syncUrls = (urls: string[]) => {
    setPhotoUrls(urls);
    onPhotosChanged(urls);
  };

  const handleSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');

    if (photoUrls.length + files.length > maxPhotos) {
      setError(
        t('shareMemory.maxPhotosReached', {
          defaultValue: `Maximum ${maxPhotos} photos allowed.`,
        })
      );
      return;
    }

    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const result = await uploadPhoto(file);
      if (!result.success || !result.url) {
        setError(
          result.error === 'invalid-type'
            ? t('shareMemory.invalidPhotoType', { defaultValue: 'Invalid file type. Please upload JPEG, PNG, or WebP.' })
            : result.error === 'file-too-large'
              ? t('shareMemory.photoTooLarge', { defaultValue: 'Photo is too large. Maximum size is 5MB.' })
              : t('shareMemory.photoUploadFailed', { defaultValue: 'Failed to upload photo. Please try again.' })
        );
        break;
      }
      uploaded.push(result.url);
    }

    if (uploaded.length > 0) {
      syncUrls([...photoUrls, ...uploaded]);
    }
  };

  const removePhoto = (index: number) => {
    const next = photoUrls.filter((_, i) => i !== index);
    syncUrls(next);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          uploading || photoUrls.length >= maxPhotos ? 'opacity-60 pointer-events-none' : 'hover:bg-muted'
        }`}
      >
        <ImageIcon className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">
          {t('shareMemory.multiPhotoHint', { defaultValue: 'Upload one or more photos' })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {t('shareMemory.photoFileTypes', { defaultValue: 'JPEG, PNG, or WebP • Max 5MB' })}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {photoUrls.length}/{maxPhotos}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleSelect(e.target.files)}
      />

      {photoUrls.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {photoUrls.map((url, idx) => (
            <div key={`${url}-${idx}`} className="relative">
              <img
                src={url}
                alt={t('shareMemory.uploadedMemoryPhoto', { defaultValue: 'Uploaded memory photo' })}
                className="w-full h-28 object-cover rounded-lg border border-border"
              />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                aria-label={t('shareMemory.removePhoto', { defaultValue: 'Remove photo' })}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
