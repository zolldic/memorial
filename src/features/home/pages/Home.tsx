import { useMemo } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { martyrsData } from '@/shared/data/martyrs';
import { useDirectionalArrow } from '@/shared/hooks/useArrow';
import { HeroSection } from '@/features/home/components/HeroSection';
import { WallOfFaces } from '@/features/home/components/WallOfFaces';
import { StoryOfTheWeek } from '@/features/home/components/StoryOfTheWeek';
import { ClosingCTA } from '@/features/home/components/ClosingCTA';


export function Home() {
  const { lang } = useLanguage();
  const ArrowIcon = useDirectionalArrow('forward');

  // "Story of the Week" — rotate based on week number
  const featuredMartyr = useMemo(() => {
    const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return martyrsData[weekOfYear % martyrsData.length];
  }, []);


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

      <ClosingCTA ArrowIcon={ArrowIcon} />
    </div>
  );
}
