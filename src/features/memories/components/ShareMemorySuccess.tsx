import { Check } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';
import { Martyr } from '@/shared/types';

interface Props {
  selectedMartyr: Martyr | undefined;
  resetForm: () => void;
}

export function ShareMemorySuccess({ selectedMartyr, resetForm }: Props) {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');

  return (
    <div className="py-20 max-w-2xl mx-auto px-6 md:px-8 lg:px-12">
      <div className="text-center mb-12">
        <div className="w-16 h-16 border border-border mx-auto flex items-center justify-center mb-6 bg-muted">
          <Check size={32} strokeWidth={1.5} />
        </div>
        <h1 className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4">
          {t("shareMemory.successTitle")}
        </h1>
        {selectedMartyr && (
          <p className="font-body text-lg text-muted-foreground">
            {t("shareMemory.memoryFor")}: <strong>{lang === "en" ? selectedMartyr.nameEn : selectedMartyr.nameAr}</strong>
          </p>
        )}
      </div>

      <div className="bg-muted border border-border p-8 mb-8">
        <h2 className="font-serif text-xl font-bold mb-4">
          {t("shareMemory.whatHappensNext", { defaultValue: "What happens next" })}
        </h2>
        <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
          <p>
            {t("shareMemory.reviewProcess", { 
              defaultValue: "Your submission will be reviewed by our team to ensure it honors the memory of the martyrs respectfully and accurately." 
            })}
          </p>
          <p>
            {t("shareMemory.reviewTiming", { 
              defaultValue: "This typically takes 2-3 business days. Once approved, your memory will appear on the memorial page." 
            })}
          </p>
          <p>
            {t("shareMemory.contactInfo", { 
              defaultValue: "If we need any clarification, we may reach out using the contact information you provided." 
            })}
          </p>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={resetForm}
          className="bg-foreground text-background px-8 py-4 font-body hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-300"
        >
          {t("shareMemory.shareAnother")}
        </button>
      </div>
    </div>
  );
}
