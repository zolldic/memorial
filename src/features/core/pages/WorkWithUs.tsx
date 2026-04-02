import { FileText, Image as ImageIcon, MessageSquare, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useTranslation } from 'react-i18next';

export function WorkWithUs() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="py-16 md:py-24 lg:py-32 max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Header - Clear and procedural */}
      <section className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight mb-6">
          {t("contribute.title")}
        </h1>
        <p className="text-lg font-body text-muted-foreground leading-relaxed mb-8">
          {t("contribute.subtitle")}
        </p>

        {/* Trust statement upfront */}
        <div className="bg-muted border border-border p-6">
          <p className="font-body leading-relaxed">
            {t("contribute.reviewMessage")}
          </p>
        </div>
      </section>

      {/* How to contribute - Step by step */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-8">
          {t("contribute.howToContribute", { defaultValue: "How to contribute" })}
        </h2>

        <div className="space-y-8">
          {[
            { icon: FileText, title: t("contribute.shareInformation"), text: t("contribute.shareInfoText") },
            { icon: ImageIcon, title: t("contribute.submitMedia"), text: t("contribute.submitMediaText") },
            { icon: MessageSquare, title: t("contribute.shareStories"), text: t("contribute.shareStoriesText") }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-6 items-start pb-8 border-b border-border-light last:border-b-0">
              <div className="flex-shrink-0 w-12 h-12 border border-border flex items-center justify-center bg-muted">
                <item.icon size={20} strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold mb-2">{item.title}</h3>
                <p className="font-body text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guidelines - Checklist format */}
      <section className="mb-16">
        <h2 className="text-2xl font-serif font-bold mb-6">
          {t("contribute.submissionGuidelines")}
        </h2>
        <div className="space-y-3">
          {[
            t("contribute.guideline1"),
            t("contribute.guideline2"),
            t("contribute.guideline3"),
            t("contribute.guideline4"),
            t("contribute.guideline5")
          ].map((guideline, idx) => (
            <div key={idx} className="flex gap-3 items-start font-body">
              <div className="flex-shrink-0 w-6 h-6 bg-foreground text-background flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <p className="text-muted-foreground leading-relaxed pt-0.5">{guideline}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important notice - Visible but not overwhelming */}
      <section className="mb-16">
        <div className="border-l-4 border-foreground pl-6 py-4 bg-muted">
          <div className="flex gap-3 items-start mb-3">
            <AlertCircle size={20} strokeWidth={1.5} className="flex-shrink-0 mt-0.5" />
            <h3 className="font-serif text-lg font-bold">{t("contribute.importantNotice")}</h3>
          </div>
          <p className="font-body text-muted-foreground leading-relaxed">
            {t("contribute.noticeText")}
          </p>
        </div>
      </section>

      {/* Contact - Action-oriented */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-serif font-bold mb-6">
          {t("contribute.contactToContribute")}
        </h2>
        
        <div className="space-y-6 mb-8">
          <div>
            <div className="text-sm font-body text-muted-foreground mb-2">{t("contribute.emailAddress")}</div>
            <a 
              href="mailto:archive@memorial-sudan.org" 
              className="text-xl font-serif font-bold hover:underline break-words"
            >
              archive@memorial-sudan.org
            </a>
          </div>
          <div>
            <div className="text-sm font-body text-muted-foreground mb-2">
              {t("contribute.responseTime")}
            </div>
            <div className="font-body text-muted-foreground">
              {t("contribute.responseTimeValue")}
            </div>
          </div>
        </div>

        <p className="font-body text-sm text-muted-foreground mb-6">
          {t("contribute.bottomCTA")}
        </p>

        <a
          href="mailto:archive@memorial-sudan.org"
          className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-body hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors"
        >
          {t("contribute.contactToContribute")}
          <ArrowIcon size={18} strokeWidth={1.5} />
        </a>
      </section>
    </div>
  );
}