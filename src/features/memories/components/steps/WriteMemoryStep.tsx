import { Camera, Mic, Check } from 'lucide-react';
import { Martyr, Language } from '@/shared/types';
import { useTranslation } from 'react-i18next';

type MemoryType = "story" | "photo" | "voice";

interface WriteMemoryStepProps {
  lang: Language;
  selectedMartyr: Martyr | undefined;
  memoryType: MemoryType;
  authorName: string;
  setAuthorName: (name: string) => void;
  content: string;
  setContent: (content: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function WriteMemoryStep({
  lang,
  selectedMartyr,
  memoryType,
  authorName,
  setAuthorName,
  content,
  setContent,
  onBack,
  onSubmit,
}: WriteMemoryStepProps) {
  const { t } = useTranslation('dashboard');

  return (
    <section className="max-w-prose">
      <h2 className="font-serif text-3xl font-black italic tracking-tighter mb-2">
        {t("shareMemory.step3Title")}
      </h2>
      {selectedMartyr && (
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">
          {t("shareMemory.memoryFor")} {selectedMartyr.name[lang]}
        </p>
      )}

      {/* Author name */}
      <div className="mb-6">
        <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
          {t("shareMemory.yourNameOptional")}
        </label>
        <input
          type="text"
          placeholder={t("shareMemory.anonymous")}
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full px-4 py-4 border-b-2 border-border bg-transparent font-body placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4"
        />
      </div>

      {/* Content */}
      {memoryType === "story" && (
        <div className="mb-6">
          <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
            {t("shareMemory.yourMemory")}
          </label>
          <textarea
            rows={8}
            placeholder={t("shareMemory.storyPlaceholder")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-6 py-6 border-2 border-border bg-background font-body text-lg placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-4 resize-y"
          />
        </div>
      )}

      {memoryType === "photo" && (
        <div className="mb-6">
          <div className="border-2 border-dashed border-border p-12 text-center hover:bg-muted transition-colors duration-500 ease-out cursor-pointer">
            <Camera size={32} strokeWidth={1} className="mx-auto mb-4 text-muted-foreground" />
            <p className="font-body italic text-muted-foreground mb-2">
              {t("shareMemory.photoUploadTitle")}
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("shareMemory.photoUploadLimits")}
            </p>
          </div>
          <textarea
            rows={3}
            placeholder={t("shareMemory.addCaption")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-4 px-4 py-4 border-b-2 border-border bg-transparent font-body placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4 resize-y"
          />
        </div>
      )}

      {memoryType === "voice" && (
        <div className="mb-6">
          <div className="border-2 border-border p-8 text-center bg-background">
            <div className="w-16 h-16 border-2 border-border mx-auto flex items-center justify-center mb-4 hover:bg-foreground hover:text-background transition-colors duration-500 ease-out cursor-pointer">
              <Mic size={24} strokeWidth={1.5} />
            </div>
            <p className="font-body italic text-muted-foreground mb-2">
              {t("shareMemory.voiceUploadTitle")}
            </p>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {t("shareMemory.voiceUploadLimits")}
            </p>
          </div>
          <textarea
            rows={3}
            placeholder={t("shareMemory.addDescription")}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-4 px-4 py-4 border-b-2 border-border bg-transparent font-body placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4 resize-y"
          />
        </div>
      )}

      {/* Notice */}
      <div className="p-6 bg-muted border border-border mb-8">
        <h3 className="font-serif text-lg font-bold mb-3">
          {t("shareMemory.beforeYouSubmit", { defaultValue: "Before you submit" })}
        </h3>
        <ul className="space-y-2 font-body text-sm text-muted-foreground leading-relaxed">
          <li>• {t("shareMemory.reviewNotice")}</li>
          <li>• {t("shareMemory.publicationTiming", { defaultValue: "Approved memories typically appear within 2-3 business days" })}</li>
          <li>• {t("shareMemory.contactClarification", { defaultValue: "We may contact you if we need clarification" })}</li>
          <li>• {t("shareMemory.editAfter", { defaultValue: "You can request changes after submission by contacting us" })}</li>
        </ul>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="border border-border px-6 py-4 font-body hover:bg-muted transition-colors"
        >
          {t("shareMemory.back")}
        </button>
        <button
          onClick={onSubmit}
          disabled={memoryType === "story" && !content.trim()}
          className="bg-foreground text-background px-8 py-4 font-body hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors disabled:opacity-30 disabled:pointer-events-none inline-flex items-center gap-3"
        >
          {t("shareMemory.submitMemory")}
          <Check size={16} strokeWidth={1.5} />
        </button>
      </div>
    </section>
  );
}
