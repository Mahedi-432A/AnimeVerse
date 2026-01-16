'use client';

import { AnimeData } from '@/lib/api';
import { cn, getAnimeTitle, getYouTubeEmbedUrl, truncateText } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Info, Play, Star } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Button from '../ui/Button';

interface HeroSlideProps {
  anime: AnimeData;
  isActive: boolean;
}

export default function HeroSlide({ anime, isActive }: HeroSlideProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const title = getAnimeTitle(anime);
  const embedUrl = getYouTubeEmbedUrl(anime.trailer?.youtube_id);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative h-screen w-full overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Parallax */}
      <motion.div
        className="absolute inset-0"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        <Image
          src={anime.images.jpg.large_image_url}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/40" />
      </motion.div>

      {/* Video Background on Hover (if available) */}
      {embedUrl && isActive && (
        <div className="absolute inset-0 opacity-0 hover:opacity-30 transition-opacity duration-700 pointer-events-none">
          <iframe
            src={embedUrl}
            className="w-full h-full object-cover scale-150"
            allow="autoplay; encrypted-media"
            title={`${title} Trailer`}
          />
        </div>
      )}

      {/* Content (Text moves slower for parallax effect) */}
      <motion.div
        className="relative z-10 h-full flex items-end pb-20 md:pb-32"
        animate={{
          x: mousePosition.x * 0.3,
          y: mousePosition.y * 0.3,
        }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl space-y-6"
          >
            {/* Rank Badge */}
            {anime.rank && (
              <div className="inline-flex items-center gap-2 glass-strong px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-semibold">
                  Ranked #{anime.rank}
                </span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              {title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300">
              {anime.score && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold">{anime.score.toFixed(1)}</span>
                </div>
              )}
              {anime.year && <span>{anime.year}</span>}
              {anime.episodes && <span>• {anime.episodes} Episodes</span>}
              {anime.status && <span>• {anime.status}</span>}
            </div>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {anime.genres.slice(0, 4).map((genre) => (
                  <span
                    key={genre.mal_id}
                    className="px-3 py-1 text-xs font-medium glass rounded-full"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {anime.synopsis && (
              <p className="text-base md:text-lg text-gray-300 leading-relaxed">
                {truncateText(anime.synopsis, 200)}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                icon={<Play className="w-5 h-5" />}
              >
                Watch Now
              </Button>
              <Button
                variant="secondary"
                size="lg"
                icon={<Info className="w-5 h-5" />}
              >
                More Info
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
