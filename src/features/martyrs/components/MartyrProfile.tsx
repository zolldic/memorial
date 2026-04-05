import { useLanguage } from "@/app/providers/LanguageProvider";
import { Martyr } from "@/shared/types";
import { MapPin, Calendar } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface MartyrProfileProps {
  martyr: Martyr;
}

export function MartyrProfile({ martyr }: MartyrProfileProps) {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  
  return (
    <div className="border border-border/70 overflow-hidden flex flex-col lg:flex-row bg-background">
      {/* Photo */}
      <div className="lg:w-[45%] border-b border-border/70 lg:border-b-0 lg:border-e lg:border-border/70 relative bg-muted/20">
        <div className="aspect-[3/4] lg:h-full relative overflow-hidden">
          <img
            src={martyr.image}
            alt={lang === "en" ? martyr.nameEn : martyr.nameAr}
            className="w-full h-full object-cover grayscale transition-none"
          />
          {/* Age stamp */}
          <div className="absolute top-6 start-6 bg-background border border-border/70 px-3 py-2 z-10 flex items-baseline gap-2">
            <div className="font-serif text-2xl font-bold leading-none">{martyr.age}</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("martyrPage.age")}</div>
          </div>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-8 lg:hidden">
            <h1 className="text-3xl font-serif font-bold text-background leading-none">
              {lang === "en" ? martyr.nameEn : martyr.nameAr}
            </h1>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="lg:w-[55%] p-8 md:p-14 flex flex-col bg-background">
        <div className="flex flex-col gap-8 relative z-10">
          <div className="space-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {t("martyrPage.martyrProfile")}
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[1.02] max-w-xl text-balance">
              {lang === "en" ? martyr.nameEn : martyr.nameAr}
            </h1>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {lang === "en" ? martyr.professionEn : martyr.professionAr}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y border-border/70 py-7">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <Calendar size={12} strokeWidth={1.5} />
                {t("martyrPage.dateOfDeath")}
              </div>
              <div className="text-lg md:text-xl font-serif font-bold">{martyr.dateOfMartyrdom}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                <MapPin size={12} strokeWidth={1.5} />
                  {t("martyrPage.location")}
              </div>
              <div className="text-lg md:text-xl font-serif font-bold">{lang === 'en' ? martyr.locationEn : martyr.locationAr}</div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="h-px bg-border/70 flex-1" />
              <h2 className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">{t("martyrPage.biography")}</h2>
              <div className="h-px bg-border/70 flex-1" />
            </div>

            <p className="text-base md:text-lg font-body leading-loose text-foreground max-w-prose">
              {lang === "en" ? martyr.storyEn : martyr.storyAr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
