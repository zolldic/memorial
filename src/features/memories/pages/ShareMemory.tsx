import { useLanguage } from '@/app/providers/LanguageProvider';
import { useShareMemoryForm } from '@/features/memories/hooks/useShareMemoryForm';
import { ShareMemorySuccess } from '@/features/memories/components/ShareMemorySuccess';
import { Search, X, FileText, Camera, Mic, Check, ArrowRight, ArrowLeft, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function ShareMemory() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const form = useShareMemoryForm();
  
  const isRtl = lang === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

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

  if (form.submitted) {
    return <ShareMemorySuccess selectedMartyr={form.selectedMartyr} resetForm={form.resetForm} />;
  }

  return (
    <div className="py-16 md:py-24 lg:py-32 max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
      {/* Header */}
      <section className="border-b border-border pb-12 mb-12">
        <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-tight mb-6">
          {t("shareMemory.shareAMemory")}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl font-body leading-relaxed mb-6">
          {t("shareMemory.introText")}
        </p>
        <div className="bg-muted border border-border p-6 max-w-2xl">
          <h2 className="font-serif text-lg font-bold mb-3">
            {t("shareMemory.yourPrivacy", { defaultValue: "Your privacy and dignity" })}
          </h2>
          <ul className="space-y-2 font-body text-sm text-muted-foreground leading-relaxed">
            <li>• {t("shareMemory.privacyReview", { defaultValue: "All submissions are reviewed before publication" })}</li>
            <li>• {t("shareMemory.privacyAnonymous", { defaultValue: "You can contribute anonymously if you prefer" })}</li>
            <li>• {t("shareMemory.privacyRespect", { defaultValue: "We treat every memory with respect and care" })}</li>
          </ul>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="flex items-center gap-0 mb-12 max-w-lg">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <button
              onClick={() => {
                if (s === 1) form.setStep(1);
                if (s === 2 && form.selectedMartyrId) form.setStep(2);
                if (s === 3 && form.selectedMartyrId && form.memoryType) form.setStep(3);
              }}
              className={`w-10 h-10 flex items-center justify-center font-body text-sm border transition-colors ${
                form.step >= s ? "bg-foreground text-background border-foreground" : "bg-background text-muted-foreground border-border"
              }`}
            >
              {s}
            </button>
            {s < 3 && (
              <div className={`flex-1 h-px ${form.step > s ? "bg-foreground" : "bg-border-light"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Martyr */}
      {form.step === 1 && (
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
              value={form.searchQuery}
              onChange={(e) => form.setSearchQuery(e.target.value)}
              className="w-full ps-12 pe-10 py-4 border border-border bg-background font-body placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
            />
            {form.searchQuery && (
              <button onClick={() => form.setSearchQuery("")} className="absolute inset-y-0 end-0 pe-3 flex items-center">
                <X size={16} strokeWidth={1.5} />
              </button>
            )}
          </div>

          {/* Results */}
          {form.searchQuery.trim() && (
            <div className="border-2 border-border max-h-80 overflow-y-auto">
              {form.filteredMartyrs.length > 0 ? (
                form.filteredMartyrs.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { form.setSelectedMartyrId(m.id); form.setStep(2); }}
                    className={`w-full flex items-center gap-4 p-4 border-b border-border-light last:border-b-0 text-start hover:bg-foreground hover:text-background transition-colors duration-500 ease-out ${
                      form.selectedMartyrId === m.id ? "bg-foreground text-background" : ""
                    }`}
                  >
                    <img src={m.image} alt={lang === "en" ? m.nameEn : m.nameAr} className="w-12 h-12 object-cover grayscale" />
                    <div>
                      <div className="font-serif text-lg font-black">{lang === "en" ? m.nameEn : m.nameAr}</div>
                      <div className="font-mono text-xs uppercase tracking-widest opacity-50">
                        {lang === "en" ? m.professionEn : m.professionAr} · {m.dateOfMartyrdom}
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
          {form.selectedMartyrId && !form.searchQuery.trim() && form.selectedMartyr && (
            <div className="border-2 border-border p-6 flex items-center gap-6 bg-background">
                <img src={form.selectedMartyr.image} alt={lang === "en" ? form.selectedMartyr.nameEn : form.selectedMartyr.nameAr} className="w-20 h-20 object-cover grayscale" />
              <div className="flex-1">
                <div className="font-serif text-2xl font-black">{lang === "en" ? form.selectedMartyr.nameEn : form.selectedMartyr.nameAr}</div>
                <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {lang === "en" ? form.selectedMartyr.professionEn : form.selectedMartyr.professionAr}
                </div>
              </div>
              <button onClick={() => { form.setSelectedMartyrId(null); form.setSearchQuery(""); }} className="p-2 min-w-[44px] min-h-[44px] border-2 border-border hover:bg-foreground hover:text-background transition-colors duration-500 ease-out">
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {form.selectedMartyrId && (
            <button
              onClick={() => form.setStep(2)}
              className="mt-8 bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out inline-flex items-center gap-3"
            >
              {t("shareMemory.continue")}
              <ArrowIcon size={16} strokeWidth={1.5} />
            </button>
          )}
        </section>
      )}

      {/* Step 2: Type of Memory */}
      {form.step === 2 && (
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
                onClick={() => form.setMemoryType(mt.type)}
                className={`group flex items-start gap-6 p-6 border-b border-border last:border-b-0 text-start transition-colors duration-500 ease-out ${
                  form.memoryType === mt.type ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                }`}
              >
                <div className={`w-12 h-12 border-2 flex items-center justify-center flex-shrink-0 ${
                  form.memoryType === mt.type ? "border-background" : "border-border"
                }`}>
                  <mt.icon size={20} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="font-serif text-xl font-black">{mt.label}</div>
                  <div className={`font-body italic text-sm mt-1 ${form.memoryType === mt.type ? "text-background/60" : "text-muted-foreground"}`}>
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
                  onClick={() => form.setRelationship(r.value)}
                  className={`px-5 py-3 min-h-[44px] border-2 border-border font-mono text-xs uppercase tracking-widest transition-colors duration-500 ease-out ${
                    form.relationship === r.value ? "bg-foreground text-background" : "bg-background hover:bg-muted"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              onClick={() => form.setStep(1)}
              className="border-2 border-border px-6 py-4 font-mono text-sm uppercase tracking-widest hover:bg-foreground hover:text-background transition-colors duration-500 ease-out"
            >
              {t("shareMemory.back")}
            </button>
            <button
              onClick={() => form.setStep(3)}
              className="bg-foreground text-background px-8 py-4 font-mono text-sm uppercase tracking-widest hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors duration-500 ease-out inline-flex items-center gap-3"
            >
              {t("shareMemory.continue")}
              <ArrowIcon size={16} strokeWidth={1.5} />
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Write the Memory */}
      {form.step === 3 && (
        <section className="max-w-prose">
          <h2 className="font-serif text-3xl font-black italic tracking-tighter mb-2">
            {t("shareMemory.step3Title")}
          </h2>
          {form.selectedMartyr && (
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-8">
              {t("shareMemory.memoryFor")} {lang === "en" ? form.selectedMartyr.nameEn : form.selectedMartyr.nameAr}
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
              value={form.authorName}
              onChange={(e) => form.setAuthorName(e.target.value)}
              className="w-full px-4 py-4 border-b-2 border-border bg-transparent font-body placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4"
            />
          </div>

          {/* Content */}
          {form.memoryType === "story" && (
            <div className="mb-6">
              <label className="block font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {t("shareMemory.yourMemory")}
              </label>
              <textarea
                rows={8}
                placeholder={t("shareMemory.storyPlaceholder")}
                value={form.content}
                onChange={(e) => form.setContent(e.target.value)}
                className="w-full px-6 py-6 border-2 border-border bg-background font-body text-lg placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-4 resize-y"
              />
            </div>
          )}

          {form.memoryType === "photo" && (
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
                value={form.content}
                onChange={(e) => form.setContent(e.target.value)}
                className="w-full mt-4 px-4 py-4 border-b-2 border-border bg-transparent font-body placeholder:italic placeholder:text-muted-foreground focus:outline-none focus:border-b-4 resize-y"
              />
            </div>
          )}

          {form.memoryType === "voice" && (
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
                value={form.content}
                onChange={(e) => form.setContent(e.target.value)}
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
              onClick={() => form.setStep(2)}
              className="border border-border px-6 py-4 font-body hover:bg-muted transition-colors"
            >
              {t("shareMemory.back")}
            </button>
            <button
              onClick={form.handleSubmit}
              disabled={form.memoryType === "story" && !form.content.trim()}
              className="bg-foreground text-background px-8 py-4 font-body hover:bg-background hover:text-foreground hover:outline hover:outline-2 hover:outline-ring transition-colors disabled:opacity-30 disabled:pointer-events-none inline-flex items-center gap-3"
            >
              {t("shareMemory.submitMemory")}
              <Check size={16} strokeWidth={1.5} />
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
