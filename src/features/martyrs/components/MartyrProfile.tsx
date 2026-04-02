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
    <div className="border-2 border-border overflow-hidden flex flex-col lg:flex-row">
      {/* Photo */}
      <div className="lg:w-[45%] border-b-2 lg:border-b-0 lg:border-e-2 border-border relative bg-muted">
        <div className="aspect-[3/4] lg:h-full relative overflow-hidden">
          <img
            src={martyr.image}
            alt={lang === "en" ? martyr.nameEn : martyr.nameAr}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
          />
          {/* Age stamp */}
          <div className="absolute top-8 start-8 -rotate-12 bg-background border-2 border-border p-4 z-10 flex flex-col items-center">
            <div className="font-serif text-3xl font-black leading-none">{martyr.age}</div>
            <div className="font-mono text-xs uppercase tracking-widest mt-1">{t("martyrPage.age")}</div>
          </div>

          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-8 lg:hidden">
            <h1 className="text-4xl font-serif font-black text-background uppercase leading-none italic tracking-tighter">
              {lang === "en" ? martyr.nameEn : martyr.nameAr}
            </h1>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="lg:w-[55%] p-8 md:p-16 flex flex-col bg-background texture-grid">
        <div className="flex flex-col gap-10 relative z-10">
          <div className="space-y-4">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("martyrPage.martyrProfile")}
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-black uppercase tracking-tighter leading-[0.85]">
              {lang === "en" ? martyr.nameEn : martyr.nameAr}
            </h1>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {lang === "en" ? martyr.professionEn : martyr.professionAr}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-y-2 border-border/10 py-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <Calendar size={12} strokeWidth={1.5} />
                {t("martyrPage.dateOfDeath")}
              </div>
              <div className="text-xl font-serif font-black italic">{martyr.dateOfMartyrdom}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                <MapPin size={12} strokeWidth={1.5} />
                  {t("martyrPage.location")}
              </div>
              <div className="text-xl font-serif font-black italic">{lang === 'en' ? martyr.locationEn : martyr.locationAr}</div>
            </div>
          </div>

          {/* Biography */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px bg-foreground flex-1" />
              <h2 className="font-serif text-2xl font-black uppercase italic tracking-tighter">{t("martyrPage.biography")}</h2>
              <div className="h-px bg-foreground flex-1" />
            </div>

            <p className="text-lg font-body leading-loose first-letter:font-serif first-letter:text-5xl first-letter:font-black first-letter:float-start first-letter:me-3 first-letter:mt-1 first-letter:border-2 first-letter:border-border first-letter:px-2 first-letter:leading-none">
              {lang === "en" ? martyr.storyEn : martyr.storyAr}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
