export type Language = "en" | "ar";

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
