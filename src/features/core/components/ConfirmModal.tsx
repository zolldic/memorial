import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isDestructive = false
}: ConfirmModalProps) {
  const { t } = useTranslation('common');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="bg-background texture-lines border border-neutral-300 shadow-2xl p-6 max-w-md w-full relative">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900"
          aria-label={t('close')}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold tracking-tight text-neutral-900 mb-2">{title}</h2>
        <p className="text-neutral-700 mb-6">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors uppercase tracking-wider"
          >
            {cancelLabel || t('cancel')}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white transition-colors uppercase tracking-wider ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-neutral-900 hover:bg-black'
            }`}
          >
            {confirmLabel || t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}
