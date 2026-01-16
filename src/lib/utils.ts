import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with K/M suffix
 */
export function formatNumber(num: number | undefined): string {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format score with 1 decimal place
 */
export function formatScore(score: number | undefined): string {
  if (!score) return 'N/A';
  return score.toFixed(1);
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function getYouTubeEmbedUrl(youtubeId?: string): string | null {
  if (!youtubeId) return null;
  return `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string | undefined, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Get anime title (prefer English, fallback to original)
 */
export function getAnimeTitle(anime: { title: string; title_english?: string }): string {
  return anime.title_english || anime.title;
}
