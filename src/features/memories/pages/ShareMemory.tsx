import { useLanguage } from '@/app/providers/LanguageProvider';
import { useShareMemoryForm } from '@/features/memories/hooks/useShareMemoryForm';
import { ShareMemorySuccess } from '@/features/memories/components/ShareMemorySuccess';
import { ShareMemoryProgress } from '@/features/memories/components/ShareMemoryProgress';
import { SelectMartyrStep } from '@/features/memories/components/steps/SelectMartyrStep';
import { MemoryTypeStep } from '@/features/memories/components/steps/MemoryTypeStep';
import { WriteMemoryStep } from '@/features/memories/components/steps/WriteMemoryStep';
import { useDirectionalArrow } from '@/shared/hooks/useArrow';
import { useTranslation } from 'react-i18next';

export function ShareMemory() {
  const { lang } = useLanguage();
  const { t } = useTranslation('dashboard');
  const form = useShareMemoryForm();
  const ArrowIcon = useDirectionalArrow('forward');

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
      <ShareMemoryProgress
        currentStep={form.step}
        selectedMartyrId={form.selectedMartyrId}
        memoryType={form.memoryType}
        onStepClick={form.setStep}
      />

      {/* Step 1: Select Martyr */}
      {form.step === 1 && (
        <SelectMartyrStep
          lang={lang}
          searchQuery={form.searchQuery}
          setSearchQuery={form.setSearchQuery}
          filteredMartyrs={form.filteredMartyrs}
          selectedMartyrId={form.selectedMartyrId}
          selectedMartyr={form.selectedMartyr}
          setSelectedMartyrId={form.setSelectedMartyrId}
          onContinue={() => form.setStep(2)}
          ArrowIcon={ArrowIcon}
        />
      )}

      {/* Step 2: Type of Memory */}
      {form.step === 2 && (
        <MemoryTypeStep
          memoryType={form.memoryType}
          setMemoryType={form.setMemoryType}
          relationship={form.relationship}
          setRelationship={form.setRelationship}
          onBack={() => form.setStep(1)}
          onContinue={() => form.setStep(3)}
          ArrowIcon={ArrowIcon}
        />
      )}

      {/* Step 3: Write the Memory */}
      {form.step === 3 && (
        <WriteMemoryStep
          lang={lang}
          selectedMartyr={form.selectedMartyr}
          memoryType={form.memoryType}
          authorName={form.authorName}
          setAuthorName={form.setAuthorName}
          content={form.content}
          setContent={form.setContent}
          onBack={() => form.setStep(2)}
          onSubmit={form.handleSubmit}
        />
      )}
    </div>
  );
}
