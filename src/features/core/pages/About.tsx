import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation('dashboard');

  const paragraphs = [
    t('about.paragraph1'),
    t('about.paragraph2'),
    t('about.paragraph3'),
    t('about.paragraph4'),
    t('about.paragraph5'),
  ];

  return (
    <div className="py-16 md:py-24 lg:py-32">
      <section className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-12 pb-6 border-b border-border/70">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
            {t('about.subtitle')}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[1.05] max-w-2xl text-balance">
            {t("about.title")}
          </h1>
          <p className="mt-6 text-base md:text-lg font-body leading-loose text-muted-foreground max-w-2xl">
            {t("about.deck")}
          </p>
        </div>

        <div className="space-y-8 md:space-y-10 font-body text-base md:text-lg leading-loose max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={index === 0 ? 'text-foreground' : 'text-muted-foreground'}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border/70">
          <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {t('about.closingNote')}
          </p>
        </div>
      </section>
    </div>
  );
}