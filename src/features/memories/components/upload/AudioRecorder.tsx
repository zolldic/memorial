import { useAudioRecorder } from './useAudioRecorder';
import { Mic, Square, Play, Pause, RotateCcw, Upload } from 'lucide-react';
import { useState } from 'react';
import { uploadToStorage } from '@/lib/storage';
import { useTranslation } from 'react-i18next';

interface AudioRecorderProps {
  onAudioUploaded: (url: string) => void;
  onAudioRemoved: () => void;
}

export function AudioRecorder({ onAudioUploaded, onAudioRemoved }: AudioRecorderProps) {
  const { t } = useTranslation('dashboard');
  const {
    isRecording,
    isPaused,
    duration,
    audioUrl,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    formatDuration,
    maxDuration,
  } = useAudioRecorder();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleUpload = async () => {
    if (!audioBlob) return;
    if (audioBlob.size > 25 * 1024 * 1024) {
      setUploadError(t('shareMemory.audioTooLarge', { defaultValue: 'Audio is too large. Maximum size is 25MB.' }));
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const fileExt = audioBlob.type.includes('webm') ? 'webm' : 'mp4';

      const { url, error } = await uploadToStorage(audioBlob, {
        bucket: 'memory-audio',
        extension: fileExt,
        contentType: audioBlob.type || undefined,
        cacheControl: '3600',
      });

      if (error || !url) {
        throw error || new Error('Upload failed');
      }

      onAudioUploaded(url);
    } catch (err) {
      console.error('Error uploading audio:', err);
      setUploadError(t('shareMemory.audioUploadFailed', { defaultValue: 'Failed to upload audio. Please try again.' }));
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    resetRecording();
    onAudioRemoved();
    setUploadError('');
  };

  const durationPercent = (duration / maxDuration) * 100;

  return (
    <div className="space-y-4">
      <div className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-6">
        {/* Recording Status */}
        {isRecording && (
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-neutral-700">
                {isPaused
                  ? t('shareMemory.recordingPaused', { defaultValue: 'Paused' })
                  : t('shareMemory.recordingActive', { defaultValue: 'Recording' })}
              </span>
            </div>
          </div>
        )}

        {/* Timer and Progress */}
        {(isRecording || audioUrl) && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-mono font-bold text-neutral-900">
                {formatDuration(duration)}
              </span>
              <span className="text-sm text-neutral-500">
                / {formatDuration(maxDuration)}
              </span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all ${
                  durationPercent >= 90 ? 'bg-red-600' : 'bg-primary'
                }`}
                style={{ width: `${durationPercent}%` }}
              />
            </div>
            {durationPercent >= 90 && (
              <p className="text-xs text-red-600 mt-1">
                {t('shareMemory.approachingMaxDuration', { defaultValue: 'Approaching maximum duration' })}
              </p>
            )}
          </div>
        )}

        {/* Playback */}
        {audioUrl && !isRecording && (
          <div className="mb-6">
            <audio controls className="w-full" src={audioUrl}>
              {t('shareMemory.audioUnsupported', { defaultValue: 'Your browser does not support audio playback.' })}
            </audio>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRecording && !audioUrl && (
            <button
              onClick={startRecording}
              className="flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full hover:bg-primary/90 transition-colors font-semibold shadow-lg"
              aria-label="Start recording"
            >
              <Mic size={20} />
              {t('shareMemory.startRecording', { defaultValue: 'Start Recording' })}
            </button>
          )}

          {isRecording && (
            <>
              {!isPaused ? (
                <button
                  onClick={pauseRecording}
                  className="p-4 bg-yellow-600 text-white rounded-full hover:bg-yellow-700 transition-colors shadow-lg"
                  aria-label="Pause recording"
                >
                  <Pause size={24} />
                </button>
              ) : (
                <button
                  onClick={resumeRecording}
                  className="p-4 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
                  aria-label="Resume recording"
                >
                  <Play size={24} />
                </button>
              )}

              <button
                onClick={stopRecording}
                className="p-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                aria-label="Stop recording"
              >
                <Square size={24} />
              </button>
            </>
          )}

          {audioUrl && !isRecording && (
            <>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border-2 border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium"
                  disabled={uploading}
                >
                  <RotateCcw size={18} />
                  {t('shareMemory.reRecord', { defaultValue: 'Re-record' })}
                </button>

              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {t('shareMemory.uploading', { defaultValue: 'Uploading...' })}
                  </>
                ) : (
                  <>
                    <Upload size={18} />
                    {t('shareMemory.uploadAudio', { defaultValue: 'Upload' })}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Errors */}
      {(error || uploadError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error || uploadError}
        </div>
      )}

      {/* Instructions */}
      {!isRecording && !audioUrl && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-medium mb-1">
            {t('shareMemory.recordingTips', { defaultValue: 'Recording Tips:' })}
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>{t('shareMemory.recordingTipMax', { defaultValue: 'Maximum recording time: 5 minutes' })}</li>
            <li>{t('shareMemory.recordingTipQuiet', { defaultValue: 'Find a quiet place for best quality' })}</li>
            <li>{t('shareMemory.recordingTipPermission', { defaultValue: 'Allow microphone access when prompted' })}</li>
            <li>{t('shareMemory.recordingTipSpeak', { defaultValue: 'Speak clearly and at a normal pace' })}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
