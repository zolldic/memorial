import { useTranslation } from 'react-i18next';

interface MemorialSectionProps {
  martyrId: string;
}

export function MemorialSection({ martyrId }: MemorialSectionProps) {
  const { t } = useTranslation('dashboard');
  
  return (
    <section className="mt-6 border-t border-border/70 pt-8 pb-8 text-center">
      <div className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12">
        <p className="font-serif text-lg md:text-xl leading-relaxed text-foreground max-w-2xl mx-auto">
          {t("martyrPage.memorialMessage")}
        </p>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {t("martyrPage.archiveRegistryId")}: {martyrId.padStart(6, '0')}
        </div>
      </div>
    </section>
  );
}
