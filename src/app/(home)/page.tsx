'use client';

import { useQuery } from '@tanstack/react-query';
import { getTopAnime, getUpcomingAnime } from '@/lib/api';
import HeroSlider from '@/components/hero/HeroSlider';
import AnimeGrid from '@/components/anime/AnimeGrid';
import Navbar from '@/components/Navbar';
import { HeroSkeleton, GridSkeleton } from '@/components/ui/Skeleton';
import FadeIn from '@/components/animations/FadeIn';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  // Fetch top anime for hero section
  const { data: topAnime, isLoading: isLoadingTop } = useQuery({
    queryKey: ['topAnime'],
    queryFn: () => getTopAnime(1, 5),
  });

  // Fetch trending anime
  const { data: trendingAnime, isLoading: isLoadingTrending } = useQuery({
    queryKey: ['trendingAnime'],
    queryFn: () => getTopAnime(1, 20),
  });

  // Fetch upcoming anime
  const { data: upcomingAnime, isLoading: isLoadingUpcoming } = useQuery({
    queryKey: ['upcomingAnime'],
    queryFn: () => getUpcomingAnime(1),
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section>
        {isLoadingTop ? (
          <HeroSkeleton />
        ) : topAnime?.data && topAnime.data.length > 0 ? (
          <HeroSlider anime={topAnime.data.slice(0, 5)} />
        ) : null}
      </section>

      {/* Trending Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Trending <span className="gradient-text">Now</span>
              </h2>
              <p className="text-gray-400">
                Top-rated anime that everyone&apos;s watching
              </p>
            </div>
          </FadeIn>

          {isLoadingTrending ? (
            <GridSkeleton count={20} />
          ) : trendingAnime?.data ? (
            <AnimeGrid anime={trendingAnime.data} />
          ) : null}
        </div>
      </section>

      {/* Upcoming Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <FadeIn>
            <div className="mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Coming <span className="gradient-text">Soon</span>
              </h2>
              <p className="text-gray-400">
                Get ready for these upcoming releases
              </p>
            </div>
          </FadeIn>

          {isLoadingUpcoming ? (
            <GridSkeleton count={20} />
          ) : upcomingAnime?.data ? (
            <AnimeGrid anime={upcomingAnime.data} />
          ) : null}
        </div>
      </section>
    </main>
  );
}
