import { Link, useNavigate } from 'react-router';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface QuickChip {
  labelEn?: string;
  labelAr?: string;
  label?: string;
  q: string;
}

interface SearchArchiveProps {
  lang: string;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cityChips: QuickChip[];
  yearChips: QuickChip[];
}

export function SearchArchive({
  lang,
  searchQuery,
  setSearchQuery,
  cityChips,
  yearChips,
}: SearchArchiveProps) {
  const { t } = useTranslation("home");
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 border-t-4 border-border texture-noise">
      <div className="max-w-prose mx-auto px-6 md:px-8 lg:px-12 text-center relative z-10">
        <h2 className="font-serif text-4xl md:text-6xl font-black italic tracking-tighter mb-4">
          {t("searchTheArchive")}
        </h2>
        <p className="font-body text-muted-foreground italic mb-10">
          {t("findMartyrDescription")}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            }
          }}
          className="relative max-w-xl mx-auto mb-8"
        >
          <input
            type="text"
            placeholder={t("searchArchives", { ns: "common" })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-16 bg-background border-2 border-border px-6 pe-14 font-body text-lg placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4 transition-none"
          />
          <button
            type="submit"
            className="absolute end-0 inset-y-0 w-14 bg-foreground text-background flex items-center justify-center hover:bg-background hover:text-foreground border-s-2 border-border transition-colors duration-500 ease-out"
          >
            <Search size={20} strokeWidth={1.5} className="rtl:scale-x-[-1]" />
          </button>
        </form>

        {/* Quick filter chips */}
        <div className="flex flex-col gap-4 items-center">
          {/* Cities */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground self-center me-2">
              {t("city")}
            </span>
            {cityChips.map((chip) => (
              <Link
                key={chip.q}
                to={`/search?q=${encodeURIComponent(chip.q)}`}
                className="px-4 py-2 border border-border font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out"
              >
                {lang === "en" ? chip.labelEn : chip.labelAr}
              </Link>
            ))}
          </div>
          {/* Years */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground self-center me-2">
              {t("year")}
            </span>
            {yearChips.map((chip) => (
              <Link
                key={chip.q}
                to={`/search?q=${encodeURIComponent(chip.q)}`}
                className="px-4 py-2 border border-border font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
