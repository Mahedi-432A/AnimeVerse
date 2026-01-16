'use client';

import { AnimeData } from '@/lib/api';
import { cn, formatScore, getAnimeTitle, truncateText } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface AnimeCardProps {
  anime: AnimeData;
  layoutId?: string;
}

export default function AnimeCard({ anime, layoutId }: AnimeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const title = getAnimeTitle(anime);

  return (
    <Link href={`/anime/${anime.mal_id}`}>
      <motion.div
        layoutId={layoutId}
        className="group relative cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Card Container */}
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-card">
          {/* Image */}
          <Image
            src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
            alt={title}
            fill
            className={cn(
              'object-cover transition-all duration-500',
              isHovered ? 'scale-110 brightness-50' : 'brightness-90'
            )}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />

          {/* Glow Border on Hover */}
          <div
            className={cn(
              'absolute inset-0 rounded-xl transition-all duration-300',
              isHovered
                ? 'ring-2 ring-accent-violet shadow-lg shadow-accent-violet/50'
                : 'ring-0'
            )}
          />

          {/* Score Badge */}
          {anime.score && (
            <div className="absolute top-3 right-3 flex items-center gap-1 glass-strong px-2.5 py-1.5 rounded-lg">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold">{formatScore(anime.score)}</span>
            </div>
          )}

          {/* Rank Badge */}
          {anime.rank && anime.rank <= 100 && (
            <div className="absolute top-3 left-3 glass-strong px-2.5 py-1.5 rounded-lg">
              <span className="text-xs font-bold gradient-text">#{anime.rank}</span>
            </div>
          )}

          {/* Synopsis Overlay on Hover */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-4 flex flex-col justify-end"
          >
            <div className="space-y-2">
              {anime.synopsis && (
                <p className="text-sm text-gray-200 line-clamp-4">
                  {truncateText(anime.synopsis, 120)}
                </p>
              )}
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">View Details</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Title & Info Below Card */}
        <div className="mt-3 space-y-1">
          <h3 className="font-semibold text-white line-clamp-2 group-hover:text-accent-violet transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {anime.year && <span>{anime.year}</span>}
            {anime.episodes && (
              <>
                <span>•</span>
                <span>{anime.episodes} eps</span>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
