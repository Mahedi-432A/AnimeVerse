'use client';

import { AnimeData } from '@/lib/api';
import SlideUp, { SlideUpItem } from '@/components/animations/SlideUp';
import AnimeCard from './AnimeCard';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface AnimeGridProps {
  anime: AnimeData[];
  className?: string;
}

export default function AnimeGrid({ anime, className }: AnimeGridProps) {
  // ডুপ্লিকেট রিমুভ করার জন্য useMemo ব্যবহার করা হলো
  const uniqueAnime = useMemo(() => {
    return anime.filter((item, index, self) => 
      index === self.findIndex((t) => t.mal_id === item.mal_id)
    );
  }, [anime]);

  return (
    <SlideUp staggerChildren staggerDelay={0.05} className={cn('w-full', className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {uniqueAnime.map((item) => (
          <SlideUpItem key={item.mal_id}>
            <AnimeCard anime={item} layoutId={`anime-${item.mal_id}`} />
          </SlideUpItem>
        ))}
      </div>
    </SlideUp>
  );
}