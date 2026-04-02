import { martyrsData } from "@/shared/data/martyrs";
import { mockMemories } from "@/shared/data/memories";
import { Martyr } from "@/shared/types";
import { Memory } from "@/shared/data/memories";

// Simulating API delay for a better "loading" experience and to prepare for real APIs
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const martyrService = {
  getMartyrs: async (): Promise<Martyr[]> => {
    await delay(300);
    return [...martyrsData];
  },

  getMartyrById: async (id: string | undefined): Promise<Martyr | undefined> => {
    if (!id) return undefined;
    await delay(200);
    return martyrsData.find((m) => m.id === id);
  },

  getMemoriesByMartyrId: async (id: string | undefined): Promise<Memory[]> => {
    if (!id) return [];
    await delay(200);
    return mockMemories.filter((m) => m.martyrId === id && m.approved);
  },

  searchMartyrs: async (query: string): Promise<Martyr[]> => {
    await delay(400);
    const q = query.toLowerCase();
    if (!q) return martyrsData;
    
    return martyrsData.filter((m) =>
      m.nameEn.toLowerCase().includes(q) ||
      m.nameAr.toLowerCase().includes(q) ||
      m.locationEn.toLowerCase().includes(q) ||
      m.locationAr.toLowerCase().includes(q) ||
      m.storyEn.toLowerCase().includes(q) ||
      m.storyAr.toLowerCase().includes(q)
    );
  },
};
