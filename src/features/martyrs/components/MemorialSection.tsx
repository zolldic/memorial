import { useLanguage } from "@/app/providers/LanguageProvider";
import { useTranslation } from 'react-i18next';

interface MemorialSectionProps {
  martyrId: string;
}

export function MemorialSection({ martyrId }: MemorialSectionProps) {
  const { t } = useTranslation('dashboard');
  
  return (
    <section className="bg-foreground text-background p-12 text-center texture-radial-inverted mt-4">
      <div className="relative z-10">
        <div className="font-serif text-6xl leading-none opacity-10 mb-2">"</div>
        <p className="font-serif text-xl italic -mt-6 mb-4">"{t("martyrPage.memorialMessage")}"</p>
        <div className="font-mono text-xs uppercase tracking-widest text-background/40 border-t border-background/10 pt-4 inline-block">
          {t("martyrPage.archiveRegistryId")}: {martyrId.padStart(6, '0')}
        </div>
      </div>
    </section>
  );
}
