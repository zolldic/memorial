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
      <div className="pb-4 mb-10 border-b border-border/70">
        <h2 className="font-serif text-3xl md:text-4xl font-bold tracking-tight">
          {t("martyrPage.tributeWall")}
        </h2>
        <p className="font-body text-sm md:text-base text-muted-foreground mt-3 leading-loose max-w-2xl">
          {t("martyrPage.personalMemoriesSubtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-border/70">
        {memories.map((memory) => {
          const RelIcon = relationshipIcons[memory.relationship] || User;
          return (
            <div
              key={memory.id}
              className="border-e border-b border-border/70 p-7 md:p-8 bg-background relative"
            >
              <p className="font-body text-base md:text-lg leading-loose text-foreground mb-6">
                {lang === "en" ? memory.contentEn : memory.contentAr}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-border/70">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-border/70 flex items-center justify-center text-muted-foreground">
                    <RelIcon size={14} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em]">
                      {memory.authorName}
                    </div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      {memory.relationship === "family" && t("martyrPage.relationship.family")}
                      {memory.relationship === "friend" && t("martyrPage.relationship.friend")}
                      {memory.relationship === "stranger" && t("martyrPage.relationship.stranger")}
                    </div>
                  </div>
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
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
          className="inline-flex items-center gap-3 border border-foreground/80 text-foreground px-8 py-4 font-body text-sm hover:bg-foreground hover:text-background transition-colors duration-300 ease-out"
        >
          {t("martyrPage.addYourMemory")}
        </Link>
      </div>
    </section>
  );
}
