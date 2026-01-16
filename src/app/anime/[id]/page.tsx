'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAnimeById } from '@/lib/api';
import { motion } from 'framer-motion';
import { Calendar, Star, TrendingUp, Users, Clock, Play } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Button from '@/components/ui/Button';
import Navbar from '@/components/Navbar';
import { formatNumber, formatScore, getAnimeTitle, getYouTubeEmbedUrl } from '@/lib/utils';
import Skeleton from '@/components/ui/Skeleton';

export default function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const animeId = parseInt(id);

  if (isNaN(animeId)) {
    return notFound();
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: () => getAnimeById(animeId),
  });

  if (isError) {
    return notFound();
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 px-4">
          <Skeleton variant="hero" className="h-[60vh]" />
        </div>
      </div>
    );
  }

  const anime = data?.data;
  if (!anime) return notFound();

  const title = getAnimeTitle(anime);
  const embedUrl = getYouTubeEmbedUrl(anime.trailer?.youtube_id);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Background Image */}
        <motion.div
          layoutId={`anime-${anime.mal_id}`}
          className="absolute inset-0"
        >
          <Image
            src={anime.images.jpg.large_image_url}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/70" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 h-full flex items-end pb-16 md:pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl space-y-6"
            >
              {/* Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                {title}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-base md:text-lg">
                {anime.score && (
                  <div className="flex items-center gap-2 glass-strong px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{formatScore(anime.score)}</span>
                  </div>
                )}
                {anime.rank && (
                  <div className="glass-strong px-4 py-2 rounded-lg">
                    <span className="font-semibold gradient-text">
                      Ranked #{anime.rank}
                    </span>
                  </div>
                )}
                {anime.popularity && (
                  <div className="glass px-4 py-2 rounded-lg flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>#{anime.popularity} Popularity</span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4">
                {embedUrl && (
                  <Button variant="primary" size="lg" icon={<Play className="w-5 h-5" />}>
                    Watch Trailer
                  </Button>
                )}
                <Button variant="secondary" size="lg">
                  Add to List
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {anime.synopsis || 'No synopsis available.'}
              </p>
            </div>

            {/* Trailer */}
            {embedUrl && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Trailer</h2>
                <div className="aspect-video rounded-xl overflow-hidden glass">
                  <iframe
                    src={embedUrl.replace('autoplay=1&mute=1', 'autoplay=0')}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${title} Trailer`}
                  />
                </div>
              </div>
            )}

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map((genre) => (
                    <span
                      key={genre.mal_id}
                      className="px-4 py-2 glass-strong rounded-lg text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-strong rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-bold mb-4">Information</h3>

              {anime.episodes && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-accent-violet mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Episodes</p>
                    <p className="font-semibold">{anime.episodes}</p>
                  </div>
                </div>
              )}

              {anime.status && (
                <div className="flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-accent-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <p className="font-semibold">{anime.status}</p>
                  </div>
                </div>
              )}

              {anime.aired?.string && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-accent-violet mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Aired</p>
                    <p className="font-semibold">{anime.aired.string}</p>
                  </div>
                </div>
              )}

              {anime.members && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-accent-cyan mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-400">Members</p>
                    <p className="font-semibold">{formatNumber(anime.members)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="glass-strong rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">Studios</h3>
                <div className="space-y-2">
                  {anime.studios.map((studio) => (
                    <p key={studio.mal_id} className="text-gray-300">
                      {studio.name}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
