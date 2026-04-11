import { useEffect, useRef, useState } from 'react';
import { usePhotoUpload } from './usePhotoUpload';
import { X, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  onPhotoRemoved: () => void;
  initialUrl?: string;
}

export function PhotoUpload({ onPhotoUploaded, onPhotoRemoved, initialUrl }: PhotoUploadProps) {
  const { t } = useTranslation('dashboard');
  const { uploadPhoto, uploading, progress } = usePhotoUpload();
  const [preview, setPreview] = useState<string>(initialUrl || '');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const lastFileSignatureRef = useRef<string>('');

  useEffect(() => {
    setPreview(initialUrl || '');
  }, [initialUrl]);

  const handleFile = async (file: File) => {
    setError('');
    const signature = `${file.name}-${file.size}-${file.lastModified}`;
    if (signature === lastFileSignatureRef.current) {
      setError(t('shareMemory.duplicateFile', { defaultValue: 'You already selected this file.' }));
      return;
    }
    lastFileSignatureRef.current = signature;
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    const result = await uploadPhoto(file);
    
    if (result.success && result.url) {
      onPhotoUploaded(result.url);
    } else {
      const mappedError = result.error === 'invalid-type'
        ? t('shareMemory.invalidPhotoType', { defaultValue: 'Invalid file type. Please upload JPEG, PNG, or WebP.' })
        : result.error === 'file-too-large'
          ? t('shareMemory.photoTooLarge', { defaultValue: 'Photo is too large. Maximum size is 5MB.' })
          : t('shareMemory.photoUploadFailed', { defaultValue: 'Failed to upload photo. Please try again.' });
      setError(mappedError);
      setPreview('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleRemove = () => {
    setPreview('');
    setError('');
    lastFileSignatureRef.current = '';
    onPhotoRemoved();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
            ${dragActive 
              ? 'border-primary bg-primary/5 scale-105' 
              : 'border-neutral-300 hover:border-primary hover:bg-neutral-50'
            }
            ${uploading ? 'pointer-events-none opacity-75' : ''}
          `}
          role="button"
          tabIndex={0}
          aria-label={t('shareMemory.uploadPhotoAria', { defaultValue: 'Upload photo' })}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              fileInputRef.current?.click();
            }
          }}
        >
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-neutral-400" />
          
          {uploading ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-neutral-700">
                {t('shareMemory.uploading', { defaultValue: 'Uploading...' })}
              </p>
              <div className="w-full max-w-xs mx-auto bg-neutral-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-neutral-500">{progress}%</p>
            </div>
          ) : (
            <>
                <p className="text-base font-medium text-neutral-900 mb-1">
                {t('shareMemory.photoDropHint', { defaultValue: 'Drop your photo here or click to browse' })}
              </p>
              <p className="text-sm text-neutral-500">
                {t('shareMemory.photoFileTypes', { defaultValue: 'JPEG, PNG, or WebP • Max 5MB' })}
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            aria-label={t('shareMemory.selectPhotoAria', { defaultValue: 'Select photo file' })}
          />
        </div>
      ) : (
        <div className="relative inline-block">
          <img
            src={preview}
            alt={t('shareMemory.uploadedMemoryPhoto', { defaultValue: 'Uploaded memory photo' })}
            className="max-w-full h-auto max-h-64 rounded-xl border-2 border-neutral-200"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-3 -right-3 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
            aria-label={t('shareMemory.removePhoto', { defaultValue: 'Remove photo' })}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
