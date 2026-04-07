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
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { searchQuery, setSearchQuery, filteredMartyrs } = useMartyrSearch({
    martyrs: martyrsData,
    returnEmptyWhenNoQuery: true
  });

  const selectedMartyr = useMemo(() => 
    martyrsData.find((m) => m.id === selectedMartyrId), 
  [selectedMartyrId]);

  const handleSubmit = async () => {
    if (!selectedMartyrId || !content.trim()) return;
    
    setIsSubmitting(true);

    try {
      const result = await memoryService.submitMemory({
        martyrId: selectedMartyrId,
        authorName: authorName || 'Anonymous',
        relationship,
        type: memoryType,
        contentEn: content, // For now, submit in one language
        // In production, you'd detect language or ask user
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
    submitted,
    isSubmitting,
    filteredMartyrs,
    selectedMartyr,
    handleSubmit,
    resetForm
  };
}
