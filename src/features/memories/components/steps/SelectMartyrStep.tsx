import { Search, X, Plus } from 'lucide-react';
import { Martyr, Language } from '@/shared/types';
import { useTranslation } from 'react-i18next';

interface SelectMartyrStepProps {
  lang: Language;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredMartyrs: Martyr[];
  selectedMartyrId: string | null;
  selectedMartyr: Martyr | undefined;
  setSelectedMartyrId: (id: string | null) => void;
  onContinue: () => void;
  ArrowIcon: React.ComponentType<{ size: number; strokeWidth: number }>;
}

export function SelectMartyrStep({
  lang,
  searchQuery,
  setSearchQuery,
  filteredMartyrs,
  selectedMartyrId,
  selectedMartyr,
  setSelectedMartyrId,
  onContinue,
  ArrowIcon,
}: SelectMartyrStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <section className="max-w-prose">
      <h2 className="font-serif text-2xl font-bold tracking-tight mb-2">
        {t("shareMemory.step1Title")}
      </h2>
      <p className="font-body text-muted-foreground mb-8">
        {t("shareMemory.step1Subtitle")}
      </p>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none">
          <Search size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder={t("shareMemory.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full ps-12 pe-10 py-4 border border-border bg-background font-body placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 end-0 pe-3 flex items-center">
            <X size={16} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Results */}
      {searchQuery.trim() && (
        <div className="border-2 border-border max-h-80 overflow-y-auto">
          {filteredMartyrs.length > 0 ? (
            filteredMartyrs.map((m) => (
              <button
                key={m.id}
                onClick={() => { setSelectedMartyrId(m.id); onContinue(); }}
                className={`w-full flex items-center gap-4 p-4 border-b border-border-light last:border-b-0 text-start hover:bg-foreground hover:text-background transition-colors duration-500 ease-out ${
                  selectedMartyrId === m.id ? "bg-foreground text-background" : ""
                }`}
              >
                <img src={m.image} alt={m.name[lang]} className="w-12 h-12 object-cover grayscale" />
                <div>
                  <div className="font-serif text-lg font-black">{m.name[lang]}</div>
                  <div className="font-mono text-xs uppercase tracking-widest opacity-50">
                    {m.profession[lang]} · {m.dateOfMartyrdom}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center">
              <p className="font-body italic text-muted-foreground mb-4">
                {t("shareMemory.noMatchFound")}
              </p>
              <button className="inline-flex items-center gap-2 border-2 border-border px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out">
                <Plus size={14} strokeWidth={1.5} />
                {t("shareMemory.addNewMartyr")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Selected state */}
      {selectedMartyrId && !searchQuery.trim() && selectedMartyr && (
        <div className="border-2 border-border p-6 flex items-center gap-6 bg-background">
          <img src={selectedMartyr.image} alt={selectedMartyr.name[lang]} className="w-20 h-20 object-cover grayscale" />
          <div className="flex-1">
            <div className="font-serif text-2xl font-black">{selectedMartyr.name[lang]}</div>
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {selectedMartyr.profession[lang]}
            </div>
          </div>
          <button onClick={() => { setSelectedMartyrId(null); setSearchQuery(""); }} className="p-2 min-w-[44px] min-h-[44px] border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out">
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>
      )}

      {selectedMartyrId && (
        <button
          onClick={onContinue}
          className="mt-8 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out inline-flex items-center gap-3"
        >
          {t("shareMemory.continue")}
          <ArrowIcon size={16} strokeWidth={1.5} />
        </button>
      )}
    </section>
  );
}
