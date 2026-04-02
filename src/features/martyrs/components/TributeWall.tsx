import { Link } from "react-router";
import { useLanguage } from "@/app/providers/LanguageProvider";
import { User, Users, Eye } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { Memory } from "@/shared/types";

interface TributeWallProps {
  martyrId: string;
  memories: Memory[];
}

export function TributeWall({ martyrId, memories }: TributeWallProps) {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  
  const relationshipIcons: Record<string, typeof User> = {
    family: Users,
    friend: User,
    stranger: Eye,
  };

  if (memories.length === 0) return null;

  return (
    <section className="mt-8">
      <div className="border-b-4 border-border pb-4 mb-12">
        <h2 className="font-serif text-4xl font-black uppercase italic tracking-tighter">
          {t("martyrPage.tributeWall")}
        </h2>
        <p className="font-body italic text-muted-foreground mt-2">
          {t("martyrPage.personalMemoriesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-s border-border">
        {memories.map((memory) => {
          const RelIcon = relationshipIcons[memory.relationship] || User;
          return (
            <div
              key={memory.id}
              className="group border-e border-b border-border p-8 bg-background hover:bg-muted transition-colors duration-500 ease-out relative"
            >
              <div className="absolute top-0 end-0 w-0 h-0 border-s-[20px] border-s-transparent border-t-[20px] border-t-[#E5E5E5]" />

              <div className="font-serif text-6xl leading-none opacity-10 mb-2">"</div>
              <p className="font-body italic text-lg leading-loose -mt-6 mb-6">
                {lang === "en" ? memory.contentEn : memory.contentAr}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border-light">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-border flex items-center justify-center">
                    <RelIcon size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-mono text-xs uppercase tracking-widest">
                      {memory.authorName}
                    </div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {memory.relationship === "family" && t("martyrPage.relationship.family")}
                      {memory.relationship === "friend" && t("martyrPage.relationship.friend")}
                      {memory.relationship === "stranger" && t("martyrPage.relationship.stranger")}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {memory.date}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Link
          to={`/share?martyr=${martyrId}`}
          className="inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out"
        >
          {t("martyrPage.addYourMemory")}
        </Link>
      </div>
    </section>
  );
}
