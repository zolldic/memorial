import { useState, useMemo } from 'react';
import { martyrsData } from '@/shared/data/martyrs';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

type MemoryType = "story" | "photo" | "voice";
type Relationship = "family" | "friend" | "stranger";

export function useShareMemoryForm() {
  const { t } = useTranslation('dashboard');
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMartyrId, setSelectedMartyrId] = useState<string | null>(null);
  const [memoryType, setMemoryType] = useState<MemoryType>("story");
  const [relationship, setRelationship] = useState<Relationship>("stranger");
  const [authorName, setAuthorName] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const filteredMartyrs = useMemo(() => {
    return searchQuery.trim()
      ? martyrsData.filter((m) =>
          m.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.nameAr.includes(searchQuery)
        )
      : [];
  }, [searchQuery]);

  const selectedMartyr = useMemo(() => 
    martyrsData.find((m) => m.id === selectedMartyrId), 
  [selectedMartyrId]);

  const handleSubmit = () => {
    if (!selectedMartyrId || !content.trim()) return;
    setSubmitted(true);
    toast.success(t("shareMemory.submissionSuccess"));
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
    filteredMartyrs,
    selectedMartyr,
    handleSubmit,
    resetForm
  };
}
