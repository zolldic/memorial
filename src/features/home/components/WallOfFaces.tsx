import { Link } from 'react-router';
import { useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Martyr } from '@/shared/types';

interface WallOfFacesProps {
  lang: string;
  martyrsData: Martyr[];
  ArrowIcon: LucideIcon;
}

interface FaceImageProps {
  image: string;
  alt: string;
  aspectClassName?: string;
}

function FaceImage({ image, alt, aspectClassName = 'aspect-[3/4]' }: FaceImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`${aspectClassName} overflow-hidden relative bg-muted`}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-foreground/5 animate-pulse" aria-hidden="true" />
      )}

      {hasError ? (
        <div className="w-full h-full flex items-center justify-center px-3 text-center border border-border/20">
          <p className="font-body text-xs text-foreground/70 leading-relaxed">{alt}</p>
        </div>
      ) : (
        <img
          src={image}
          alt={alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-focus-visible:grayscale-0 transition-none"
        />
      )}
    </div>
  );
}

export function WallOfFaces({ lang, martyrsData, ArrowIcon }: WallOfFacesProps) {
  const { t } = useTranslation("home");
  const waterfallProfiles = martyrsData.slice(0, 6);
  const waterfallColumns = [
    waterfallProfiles.filter((_, index) => index % 3 === 0),
    waterfallProfiles.filter((_, index) => index % 3 === 1),
    waterfallProfiles.filter((_, index) => index % 3 === 2),
  ];

  return (
    <section className="py-16 md:py-24 border-t border-border/40">
      <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex items-end justify-between mb-10 gap-6">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl md:text-5xl font-bold tracking-tight">
              {t("wallOfFaces")}
            </h2>
          </div>
          <Link
            to="/martyrs"
            className="hidden md:inline-flex items-center gap-2 font-body text-sm hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {t("viewAll")}
            <ArrowIcon size={14} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Waterfall preview */}
        <div className="grid gap-8 md:gap-10 lg:grid-cols-3 items-start">
          {waterfallColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className="flex flex-col gap-8"
              style={{ marginTop: columnIndex === 1 ? '2.5rem' : columnIndex === 2 ? '5rem' : '0' }}
            >
              {column.map((martyr, itemIndex) => {
                const isTallCard = columnIndex === 1 && itemIndex === 0;
                const isShortCard = columnIndex === 2 && itemIndex === 0;

                return (
                  <Link
                    key={martyr.id}
                    to={`/martyrs/${martyr.id}`}
                    className="group overflow-hidden relative bg-muted border border-border/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
                    aria-label={`${martyr.name[lang]}, ${martyr.profession[lang]}`}
                  >
                    <FaceImage
                      image={martyr.image}
                      alt={`${martyr.name[lang]}, ${martyr.profession[lang]}`}
                      aspectClassName={
                        isTallCard
                          ? 'aspect-[4/5]'
                          : isShortCard
                            ? 'aspect-[3/3.55]'
                            : 'aspect-[3/4]'
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/88 via-foreground/55 to-transparent p-4 pt-12">
                      <div className="font-serif text-background text-base font-bold leading-tight">
                        {martyr.name[lang]}
                      </div>
                      <div className="font-body text-background/60 text-xs mt-1">
                        {martyr.profession[lang]}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/martyrs"
            className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 font-body text-sm hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-300 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
          >
            {t("visitGallery")}
            <ArrowIcon size={16} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </section>
  );
}
