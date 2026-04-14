import { Link } from 'react-router';
import { Martyr, Language } from '@/shared/types';

interface MartyrCardProps {
  martyr: Martyr;
  lang: Language;
}

export function MartyrCard({ martyr, lang }: MartyrCardProps) {
  return (
    <Link
      to={`/martyrs/${martyr.id}`}
      className="group block border border-border/70 overflow-hidden relative bg-background focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring"
      style={{ margin: '-1px' }}
    >
      {/* Photo */}
      <div className="overflow-hidden aspect-[3/4]">
        <img
          src={martyr.image}
          alt={martyr.name[lang]}
          loading="lazy"
          className="w-full h-full object-cover grayscale transition-none"
        />
      </div>

      {/* Always visible info */}
      <div className="p-4 md:p-5 border-t border-border/70 bg-background">
        <div className="font-serif text-base md:text-lg font-bold leading-tight mb-2 text-foreground">
          {martyr.name[lang]}
        </div>
        <div className="space-y-1.5 font-body text-[11px] md:text-xs text-muted-foreground leading-relaxed">
          <div>{martyr.profession[lang]}</div>
          <div>
            {martyr.location[lang]}
            <span className="mx-2" aria-hidden="true">·</span>
            {martyr.candles.toLocaleString()}
          </div>
        </div>
      </div>
    </Link>
  );
}
