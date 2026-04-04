import { useState, useMemo } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { martyrsData } from '@/shared/data/martyrs';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { HeroSection } from '@/features/home/components/HeroSection';
import { WallOfFaces } from '@/features/home/components/WallOfFaces';
import { StoryOfTheWeek } from '@/features/home/components/StoryOfTheWeek';
import { StatsCounter } from '@/features/home/components/StatsCounter';
import { SearchArchive } from '@/features/home/components/SearchArchive';
import { ClosingCTA } from '@/features/home/components/ClosingCTA';
import { CITY_CHIPS, HOME_YEAR_CHIPS } from '@/shared/utils/filters';
import { Language } from '@/shared/types';


function useArrow( language: Language)
{
  return language == 'en' ? ArrowRight : ArrowLeft
}

export function Home() {
  const { lang } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const ArrowIcon = useArrow(lang)

  // "Story of the Week" — rotate based on week number
  const featuredMartyr = useMemo(() => {
    const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return martyrsData[weekOfYear % martyrsData.length];
  }, []);

  const totalCandles = useMemo(() => 
    martyrsData.reduce((sum, m) => sum + m.candles, 0),
  []);

  return (
    <div className="flex flex-col">
      <HeroSection ArrowIcon={ArrowIcon} />
      
      <WallOfFaces 
        lang={lang} 
        martyrsData={martyrsData} 
        ArrowIcon={ArrowIcon} 
      />

      <StoryOfTheWeek 
        lang={lang} 
        featuredMartyr={featuredMartyr} 
        ArrowIcon={ArrowIcon} 
      />

      <StatsCounter 
        martyrsData={martyrsData} 
        totalCandles={totalCandles} 
      />

      <SearchArchive 
        lang={lang} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        cityChips={CITY_CHIPS} 
        yearChips={HOME_YEAR_CHIPS} 
      />

      <ClosingCTA ArrowIcon={ArrowIcon} />
    </div>
  );
}
