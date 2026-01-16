'use client';

import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { motion } from 'framer-motion';
import { Search, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from './ui/Button';

export default function Navbar() {
  const { scrollPosition, scrollDirection } = useScrollPosition();
  const { openSearch } = useUIStore();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const shouldShow = scrollPosition < 50 || scrollDirection === 'up';
    
    // শুধুমাত্র ভ্যালু চেঞ্জ হলেই স্টেট আপডেট হবে (Crash ফিক্স)
    setIsVisible((prev) => {
      if (prev === shouldShow) return prev;
      return shouldShow;
    });
  }, [scrollDirection, scrollPosition]);

  // Keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openSearch]);

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrollPosition > 50 ? 'glass-strong border-b border-white/5 shadow-lg' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-xl md:text-2xl font-bold gradient-text">
              AnimeVerse
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Trending</Link>
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Upcoming</Link>
            <Link href="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Top Rated</Link>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={openSearch}
            icon={<Search className="w-4 h-4" />}
            className="gap-2"
          >
            <span className="hidden md:inline">Search</span>
            <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 text-xs font-mono bg-white/10 rounded border border-white/20">
              ⌘K
            </kbd>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}