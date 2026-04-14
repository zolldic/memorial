import { useMemo } from 'react';
import { useLanguage } from '@/app/providers/LanguageProvider';
import { useMartyrs } from '@/features/martyrs/hooks/useMartyrs';
import { useDirectionalArrow } from '@/shared/hooks/useArrow';
import { HeroSection } from '@/features/home/components/HeroSection';
import { WallOfFaces } from '@/features/home/components/WallOfFaces';
import { StoryOfTheWeek } from '@/features/home/components/StoryOfTheWeek';
import { ClosingCTA } from '@/features/home/components/ClosingCTA';


export function Home() {
  const { lang } = useLanguage();
  const ArrowIcon = useDirectionalArrow('forward');
  const { martyrs } = useMartyrs();

  const martyrImages = useMemo(() => martyrs.map(m => m.image), [martyrs]);

  // "Story of the Week" — rotate based on week number
  const featuredMartyr = useMemo(() => {
    if (martyrs.length === 0) return null;
    const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return martyrs[weekOfYear % martyrs.length];
  }, [martyrs]);


  return (
    <div className="flex flex-col">
      <HeroSection ArrowIcon={ArrowIcon} martyrImages={martyrImages} />
      
      {martyrs.length > 0 && (
        <WallOfFaces 
          lang={lang} 
          martyrsData={martyrs} 
          ArrowIcon={ArrowIcon} 
        />
      )}

      {featuredMartyr && (
        <StoryOfTheWeek 
          lang={lang} 
          featuredMartyr={featuredMartyr} 
          ArrowIcon={ArrowIcon} 
        />
      )}

      <ClosingCTA ArrowIcon={ArrowIcon} />
    </div>
  );
}
