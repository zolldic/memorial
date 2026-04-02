import { Link } from 'react-router';
import { MapPin, Flame } from 'lucide-react';
import { Martyr } from '@/shared/types';

interface MartyrCardProps {
  martyr: Martyr;
  idx: number;
  lang: string;
}

export function MartyrCard({ martyr, idx, lang }: MartyrCardProps) {
  return (
    <Link
      to={`/martyrs/${martyr.id}`}
      className="group block border border-border overflow-hidden relative bg-background hover:shadow-lg transition-shadow duration-300"
      style={{ margin: '-1px' }}
    >
      {/* Photo */}
      <div className={`overflow-hidden ${idx % 3 === 0 ? 'aspect-[3/4]' : idx % 3 === 1 ? 'aspect-square' : 'aspect-[4/5]'}`}>
        <img
          src={martyr.image}
          alt={lang === "en" ? martyr.nameEn : martyr.nameAr}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 ease-out"
        />
      </div>

      {/* Always visible info */}
      <div className="p-4 border-t border-border bg-background group-hover:bg-foreground group-hover:text-background transition-colors duration-300 ease-out">
        <div className="font-serif text-lg font-bold leading-tight mb-2">
          {lang === "en" ? martyr.nameEn : martyr.nameAr}
        </div>
        <div className="flex flex-col gap-1.5 font-body text-xs text-muted-foreground group-hover:text-background/70">
          <div>{lang === "en" ? martyr.professionEn : martyr.professionAr}</div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <MapPin size={12} strokeWidth={1.5} />
              {lang === "en" ? martyr.locationEn : martyr.locationAr}
            </span>
            <span className="flex items-center gap-1">
              <Flame size={12} strokeWidth={1.5} />
              {martyr.candles.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
