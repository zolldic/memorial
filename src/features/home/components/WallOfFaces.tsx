import { Link } from 'react-router';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Martyr {
  id: string;
  nameEn: string;
  nameAr: string;
  image: string;
  professionEn: string;
  professionAr: string;
}

interface WallOfFacesProps {
  lang: string;
  martyrsData: Martyr[];
  ArrowIcon: LucideIcon;
}

export function WallOfFaces({ lang, martyrsData, ArrowIcon }: WallOfFacesProps) {
  const { t } = useTranslation("home");

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              {t("martyrsList.title", { ns: "dashboard" })}
            </h2>
          </div>
          <Link
            to="/martyrs"
            className="hidden md:inline-flex items-center gap-2 font-body text-sm hover:underline"
          >
            {t("viewAll")}
            <ArrowIcon size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* 4-column preview grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
          {martyrsData.slice(0, 8).map((martyr) => (
            <Link
              key={martyr.id}
              to={`/martyrs/${martyr.id}`}
              className="group border-e border-b border-border overflow-hidden relative bg-muted"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={martyr.image}
                  alt={lang === "en" ? martyr.nameEn : martyr.nameAr}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
                />
              </div>
              {/* Name always visible at bottom */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/90 via-foreground/60 to-transparent p-4 pt-12">
                <div className="font-serif text-background text-base font-bold leading-tight">
                  {lang === "en" ? martyr.nameEn : martyr.nameAr}
                </div>
                <div className="font-body text-background/60 text-xs mt-1">
                  {lang === "en" ? martyr.professionEn : martyr.professionAr}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/martyrs"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-body text-sm hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-300 ease-out"
          >
            {t("visitGallery")}
            <ArrowIcon size={16} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </section>
  );
}
