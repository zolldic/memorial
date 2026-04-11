import { Link } from "react-router";
import { useRef, useState } from "react";
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
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  
  const relationshipIcons: Record<string, typeof User> = {
    family: Users,
    friend: User,
    stranger: Eye,
  };

  if (memories.length === 0) return null;

  const pauseOtherAudio = (activeId: string) => {
    Object.entries(audioRefs.current).forEach(([id, audio]) => {
      if (id !== activeId && audio && !audio.paused) {
        audio.pause();
      }
    });
  };

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
                {(lang === "en" ? memory.contentEn : memory.contentAr) ||
                  t("martyrPage.mediaMemoryNoText", { defaultValue: "Shared with media only." })}
              </p>

              {(memory.photoUrl || (memory.photoUrls && memory.photoUrls.length > 0)) && (
                <div className="mb-5 grid grid-cols-2 gap-2">
                  {(memory.photoUrls && memory.photoUrls.length > 0 ? memory.photoUrls : [memory.photoUrl]).map((url, idx) => (
                    <button
                      key={`${memory.id}-photo-${idx}`}
                      type="button"
                      onClick={() => setLightboxPhoto(url)}
                      className="block text-left"
                      aria-label={t("martyrPage.viewFullImage", { defaultValue: "View full image" })}
                    >
                      <img
                        src={url}
                        alt={t("martyrPage.memoryPhotoAlt", { defaultValue: "Shared memory photo" })}
                        loading="lazy"
                        className="w-full h-40 object-cover border border-border/70 hover:opacity-95 transition-opacity"
                      />
                    </button>
                  ))}
                </div>
              )}

              {memory.audioUrl && (
                <div className="mb-5">
                  <audio
                    controls
                    className="w-full"
                    ref={(el) => {
                      audioRefs.current[memory.id] = el;
                    }}
                    onPlay={() => pauseOtherAudio(memory.id)}
                  >
                    <source src={memory.audioUrl} type="audio/webm" />
                    <source src={memory.audioUrl} type="audio/mp4" />
                    {t("martyrPage.audioUnsupported", { defaultValue: "Your browser does not support audio playback." })}
                  </audio>
                </div>
              )}

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

      {lightboxPhoto && (
        <button
          type="button"
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          aria-label={t("martyrPage.closeImageViewer", { defaultValue: "Close image viewer" })}
        >
          <img
            src={lightboxPhoto}
            alt={t("martyrPage.memoryPhotoAlt", { defaultValue: "Shared memory photo" })}
            className="max-w-full max-h-full object-contain"
          />
        </button>
      )}
    </section>
  );
}
