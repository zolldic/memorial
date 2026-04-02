import { martyrsData } from '@/shared/data/martyrs';
import { Shield, History, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function About() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="py-16 md:py-24 lg:py-32">
      {/* Header - Editorial/Narrative */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 mb-20">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight mb-8">
          {t("about.title")}
        </h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl font-body leading-relaxed text-muted-foreground mb-6">
            {t("about.deck")}
          </p>
        </div>
      </section>

      {/* Mission - Story-like layout */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 mb-20">
        <h2 className="text-3xl font-serif font-bold mb-8 pb-4 border-b border-border">
          {t("about.ourMission")}
        </h2>
        <div className="space-y-6 font-body text-lg leading-relaxed">
          <p>{t("about.missionText1")}</p>
          <p className="text-muted-foreground">{t("about.missionText2")}</p>
        </div>
      </section>

      {/* Quote - Pull quote treatment */}
      <section className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 mb-20">
        <blockquote className="border-l-4 border-foreground pl-8 py-4">
          <p className="text-2xl md:text-3xl font-serif italic leading-tight mb-4">
            "{t("about.quoteText")}"
          </p>
          <footer className="font-body text-sm text-muted-foreground">
            — {t("about.quoteDedication")}
          </footer>
        </blockquote>
      </section>

      {/* Values - Text-focused */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 mb-20">
        <h2 className="text-3xl font-serif font-bold mb-8 pb-4 border-b border-border">
          {t("about.ourValues")}
        </h2>
        <div className="space-y-10">
          {[
            { icon: Shield, title: t("about.dignityRespect"), text: t("about.dignityText") },
            { icon: History, title: t("about.historicalAccuracy"), text: t("about.accuracyText") },
            { icon: Users, title: t("about.collectiveMemory"), text: t("about.memoryText") }
          ].map((value, idx) => (
            <div key={idx} className="flex gap-6 items-start">
              <div className="flex-shrink-0">
                <value.icon size={24} strokeWidth={1.5} className="text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold mb-3">{value.title}</h3>
                <p className="font-body leading-relaxed text-muted-foreground">{value.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats - Minimal inline */}
      <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="pt-12 border-t border-border">
          <div className="flex flex-wrap gap-12">
            <div>
              <div className="text-sm font-body text-muted-foreground mb-1">{t("about.revolutionYear")}</div>
              <div className="text-3xl font-serif font-bold">2018</div>
            </div>
            <div>
              <div className="text-sm font-body text-muted-foreground mb-1">{t("about.livesRemembered")}</div>
              <div className="text-3xl font-serif font-bold">{martyrsData.length}</div>
            </div>
            <div>
              <div className="text-sm font-body text-muted-foreground mb-1">{t("about.ongoingArchive")}</div>
              <div className="text-3xl font-serif font-bold">∞</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}