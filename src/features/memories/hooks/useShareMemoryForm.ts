import { useState, useMemo } from 'react';
import { martyrsData } from '@/shared/data/martyrs';
import { useMartyrSearch } from '@/shared/hooks/useMartyrSearch';
import { memoryService } from '@/features/memories/services/memoryService';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

type MemoryType = "story" | "photo" | "voice";
type Relationship = "family" | "friend" | "stranger";

export function useShareMemoryForm() {
  const { t } = useTranslation('dashboard');
  const [step, setStep] = useState(1);
  const [selectedMartyrId, setSelectedMartyrId] = useState<string | null>(null);
  const [memoryType, setMemoryType] = useState<MemoryType>("story");
  const [relationship, setRelationship] = useState<Relationship>("stranger");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { searchQuery, setSearchQuery, filteredMartyrs } = useMartyrSearch({
    martyrs: martyrsData,
    returnEmptyWhenNoQuery: true
  });

  const selectedMartyr = useMemo(() => 
    martyrsData.find((m) => m.id === selectedMartyrId), 
  [selectedMartyrId]);

  const canSubmit = useMemo(() => {
    if (!selectedMartyrId) return false;
    if (memoryType === "story") return content.trim().length > 0;
    if (memoryType === "photo") return photoUrls.length > 0;
    if (memoryType === "voice") return Boolean(audioUrl);
    return false;
  }, [selectedMartyrId, memoryType, content, photoUrls, audioUrl]);

  const handleSubmit = async () => {
    if (!canSubmit || !selectedMartyrId) return;
    
    setIsSubmitting(true);

    try {
      const result = await memoryService.submitMemory({
        martyrId: selectedMartyrId,
        authorName: authorName || 'Anonymous',
        relationship,
        type: memoryType,
        contentEn: content,
        photoUrls,
        audioUrl,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success(t("shareMemory.submissionSuccess"));
      } else {
        toast.error(result.error || t("shareMemory.submissionError"));
      }
    } catch (err) {
      console.error('Error submitting memory:', err);
      toast.error(t("shareMemory.submissionError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSearchQuery("");
    setSelectedMartyrId(null);
    setMemoryType("story");
    setRelationship("stranger");
    setAuthorName("");
    setContent("");
    setPhotoUrls([]);
    setAudioUrl(undefined);
    setSubmitted(false);
    setIsSubmitting(false);
  };

  return {
    step,
    setStep,
    searchQuery,
    setSearchQuery,
    selectedMartyrId,
    setSelectedMartyrId,
    memoryType,
    setMemoryType,
    relationship,
    setRelationship,
    authorName,
    setAuthorName,
    content,
    setContent,
    photoUrls,
    setPhotoUrls,
    audioUrl,
    setAudioUrl,
    canSubmit,
    submitted,
    isSubmitting,
    filteredMartyrs,
    selectedMartyr,
    handleSubmit,
    resetForm
  };
}
