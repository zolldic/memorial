import { Link } from 'react-router';
import { LucideIcon, MapPin, Flame } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Martyr } from '@/shared/types';

interface StoryOfTheWeekProps {
  lang: string;
  featuredMartyr: Martyr;
  ArrowIcon: LucideIcon;
}

function truncateToWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")} ... `;
}

export function StoryOfTheWeek({ lang, featuredMartyr, ArrowIcon }: StoryOfTheWeekProps) {
  const { t } = useTranslation("home");
  const storyPreview = truncateToWords(featuredMartyr.story[lang], 50);

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="mb-12">
          <h3 className="font-body text-sm text-muted-foreground mb-4">
            {t("storyOfTheWeek")}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Photo */}
          <div className="relative overflow-hidden border border-border">
            <div className="aspect-[4/5]">
              <img
                src={featuredMartyr.image}
                alt={featuredMartyr.name[lang]}
                className="w-full h-full object-cover grayscale"
              />
            </div>
            {/* Overlay badge */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <div className="flex items-center gap-2 text-background/60">
                <MapPin size={14} strokeWidth={1.5} />
                <span className="font-body text-xs">
                  {featuredMartyr.location[lang]}
                </span>
              </div>
            </div>
          </div>

          {/* Story */}
          <div className="border border-border border-t-0 lg:border-t lg:border-s-0 p-8 md:p-12 flex flex-col justify-center gap-6 bg-background">
            <div className="flex items-center gap-2">
              <Flame size={14} strokeWidth={1.5} className="text-muted-foreground" />
              <span className="font-body text-xs text-muted-foreground">
                {featuredMartyr.candles.toLocaleString()} {t("candlesLit")}
              </span>
            </div>

            <h2 className="font-serif text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              {featuredMartyr.name[lang]}
            </h2>

            <div className="flex flex-wrap items-center gap-4 font-body text-xs text-muted-foreground">
              <span>{featuredMartyr.profession[lang]}</span>
              <span>·</span>
              <span>{t("age")} {featuredMartyr.age}</span>
              <span>·</span>
              <span>{featuredMartyr.dateOfMartyrdom}</span>
            </div>

           {/* Drop cap story */}
            <p className="font-body text-lg leading-relaxed first-letter:font-serif first-letter:text-2xl first-letter:font-bold first-letter:float-start first-letter:me-3 first-letter:mt-1">
              {storyPreview} 

            </p>
            <div className="mt-2 pt-2 border-t border-border-light flex items-center justify-between">
              <Link
                to={`/martyrs/${featuredMartyr.id}`}
                className="group inline-flex items-center gap-2 font-body text-sm hover:underline"
              >
                {t("readFullProfile")}
                <ArrowIcon size={14} strokeWidth={1.5} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-300 ease-out" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
