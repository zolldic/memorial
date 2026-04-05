import { useDirectionalArrow } from '@/shared/hooks/useArrow';
import { useTranslation } from 'react-i18next';

export function WorkWithUs() {
  const { t } = useTranslation('dashboard');
  const ArrowIcon = useDirectionalArrow('forward');

  const contributionItems = [
    t('contribute.shareInformation'),
    t('contribute.submitMedia'),
    t('contribute.shareStories'),
  ];

  const guidelines = [
    t('contribute.guideline1'),
    t('contribute.guideline2'),
    t('contribute.guideline3'),
    t('contribute.guideline4'),
    t('contribute.guideline5'),
  ];

  return (
    <div className="py-16 md:py-24 lg:py-32">
      <section className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="pb-6 mb-10 border-b border-border/70">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-4">
            {t('contribute.callForContributions')}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[1.05] max-w-2xl text-balance">
          {t("contribute.title")}
          </h1>
          <p className="mt-6 text-base md:text-lg font-body leading-loose text-muted-foreground max-w-2xl">
            {t("contribute.subtitle")}
          </p>
        </div>

        <div className="space-y-8 md:space-y-10 font-body text-base md:text-lg leading-loose">
          <p className="text-foreground max-w-prose">
            {t("contribute.reviewMessage")}
          </p>
          <section className="pt-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-5">
              {t("contribute.howYouCanHelp")}
            </h2>

            <div className="space-y-4 border-t border-border/70 pt-5">
              {contributionItems.map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 py-3 border-b border-border/40 last:border-b-0">
                  <div className="w-5 flex-shrink-0 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground pt-1">
                    0{idx + 1}
                  </div>
                  <div className="font-body text-foreground">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-2">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-5">
              {t("contribute.submissionGuidelines")}
            </h2>

            <div className="space-y-3 border-t border-border/70 pt-5">
              {guidelines.map((guideline, idx) => (
                <div key={idx} className="grid grid-cols-[2rem_1fr] gap-4 items-start">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground pt-1">
                    {idx + 1}
                  </div>
                  <p className="text-muted-foreground leading-loose">
                    {guideline}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="pt-2 border-t border-border/70">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-5 pt-5">
              {t("contribute.importantNotice")}
            </h2>
            <p className="max-w-prose text-muted-foreground leading-loose">
              {t("contribute.noticeText")}
            </p>
          </section>

          {/* Contact - Action-oriented */}
          <section className="pt-4 border-t border-border/70">
            <h2 className="font-mono text-xs uppercase tracking-[0.28em] text-muted-foreground mb-5 pt-2">
              {t("contribute.contactToContribute")}
            </h2>

            <div className="space-y-5 mb-8">
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground mb-2">{t("contribute.emailAddress")}</div>
                <a
                  href="mailto:archive@memorial-sudan.org"
                  className="text-lg md:text-xl font-serif font-bold hover:underline break-words focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  archive@memorial-sudan.org
                </a>
              </div>
              <div>
                <div className="text-xs font-mono uppercase tracking-[0.22em] text-muted-foreground mb-2">
                  {t("contribute.responseTime")}
                </div>
                <div className="text-muted-foreground leading-loose">
                  {t("contribute.responseTimeValue")}
                </div>
              </div>
            </div>

            <p className="max-w-prose text-sm text-muted-foreground leading-loose mb-6">
              {t("contribute.bottomCTA")}
            </p>

            <a
              href="mailto:archive@memorial-sudan.org"
              className="inline-flex items-center gap-3 border border-foreground/80 text-foreground px-8 py-4 font-body hover:bg-foreground hover:text-background transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              {t("contribute.contactToContribute")}
              <ArrowIcon size={18} strokeWidth={1.5} />
            </a>
          </section>
        </div>
      </section>
    </div>
  );
}