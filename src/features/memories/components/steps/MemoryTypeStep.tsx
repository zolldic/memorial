import { FileText, Camera, Mic } from 'lucide-react';
import { useTranslation } from 'react-i18next';

type MemoryType = "story" | "photo" | "voice";
type Relationship = "family" | "friend" | "stranger";

interface MemoryTypeStepProps {
  memoryType: MemoryType;
  setMemoryType: (type: MemoryType) => void;
  relationship: Relationship;
  setRelationship: (rel: Relationship) => void;
  onBack: () => void;
  onContinue: () => void;
  ArrowIcon: React.ComponentType<{ size: number; strokeWidth: number }>;
}

export function MemoryTypeStep({
  memoryType,
  setMemoryType,
  relationship,
  setRelationship,
  onBack,
  onContinue,
  ArrowIcon,
}: MemoryTypeStepProps) {
  const { t } = useTranslation('dashboard');

  const memoryTypes = [
    { type: "story" as const, icon: FileText, label: t("shareMemory.typeStory"), desc: t("shareMemory.storyPlaceholder") },
    { type: "photo" as const, icon: Camera, label: t("shareMemory.typePhoto"), desc: t("shareMemory.photoUploadTitle") },
    { type: "voice" as const, icon: Mic, label: t("shareMemory.typeVoice"), desc: t("shareMemory.voiceUploadTitle") }
  ];

  const relationships = [
    { value: "family" as const, label: t("martyrPage.relationship.family") },
    { value: "friend" as const, label: t("martyrPage.relationship.friend") },
    { value: "stranger" as const, label: t("martyrPage.relationship.stranger") },
  ];

  return (
    <section className="max-w-prose">
      <h2 className="font-serif text-3xl font-black italic tracking-tighter mb-2">
        {t("shareMemory.step2Title")}
      </h2>
      <p className="font-body text-muted-foreground italic mb-8">
        {t("shareMemory.step2Subtitle")}
      </p>

      <div className="grid grid-cols-1 gap-0 border border-border">
        {memoryTypes.map((mt) => (
          <button
            key={mt.type}
            onClick={() => setMemoryType(mt.type)}
            className={`group flex items-start gap-6 p-6 border-b border-border last:border-b-0 text-start transition-colors duration-500 ease-out ${
              memoryType === mt.type ? "bg-foreground text-background" : "bg-background hover:bg-muted"
            }`}
          >
            <div className={`w-12 h-12 border-2 flex items-center justify-center flex-shrink-0 ${
              memoryType === mt.type ? "border-background" : "border-border"
            }`}>
              <mt.icon size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-serif text-xl font-black">{mt.label}</div>
              <div className={`font-body italic text-sm mt-1 ${memoryType === mt.type ? "text-background/60" : "text-muted-foreground"}`}>
                {mt.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Relationship */}
      <div className="mt-10">
        <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
          {t("shareMemory.yourRelationship")}
        </h3>
        <div className="flex flex-wrap gap-3">
          {relationships.map((r) => (
            <button
              key={r.value}
              onClick={() => setRelationship(r.value)}
              className={`px-5 py-3 min-h-[44px] border-2 border-border font-mono text-xs uppercase tracking-widest transition-colors duration-500 ease-out ${
                relationship === r.value ? "bg-foreground text-background" : "bg-background hover:bg-muted"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-10">
        <button
          onClick={onBack}
          className="border-2 border-border px-6 py-4 font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out"
        >
          {t("shareMemory.back")}
        </button>
        <button
          onClick={onContinue}
          className="bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out inline-flex items-center gap-3"
        >
          {t("shareMemory.continue")}
          <ArrowIcon size={16} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
