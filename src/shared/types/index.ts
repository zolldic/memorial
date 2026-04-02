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
  date: string;
  approved: boolean;
}

export interface Martyr {
  id: string;
  nameEn: string;
  nameAr: string;
  age: number;
  dateOfMartyrdom: string;
  locationEn: string;
  locationAr: string;
  image: string;
  storyEn: string;
  storyAr: string;
  professionEn: string;
  professionAr: string;
  candles: number;
}
