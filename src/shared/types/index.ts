export type Language = "en" | "ar";

export type MemoryType = "story" | "photo" | "voice";

export type Relationship = "family" | "friend" | "stranger";


export interface Memory {
  id: string;
  martyrId: string;
  authorName: string;
  relationship: Relationship;
  type: MemoryType;
  contentEn: string;
  contentAr: string;
  photoUrl?: string;
  audioUrl?: string;
  date: string;
  approved: boolean;
}

export interface Martyr {
  id: string;
  name: Record<Language, string>;
  age: number;
  dateOfMartyrdom: string;
  location: Record<Language, string>;
  image: string;
  story: Record<Language, string>;
  profession: Record<Language, string>;
  candles: number;
}
