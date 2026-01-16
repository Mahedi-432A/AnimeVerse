'use client';

import { useUIStore } from '@/lib/store';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { searchAnime } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import Input from './ui/Input';
import AnimeCard from './anime/AnimeCard';
import { CardSkeleton } from './ui/Skeleton';

export default function SearchModal() {
  const { isSearchOpen, closeSearch, searchQuery, setSearchQuery } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(searchQuery, 500);

  // Fetch search results
  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchAnime(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
    };

    if (isSearchOpen) {
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen, closeSearch]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-3xl glass-strong rounded-2xl shadow-2xl pointer-events-auto max-h-[80vh] flex flex-col"
            >
              {/* Search Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Search anime..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    className="flex-1"
                  />
                  <button
                    onClick={closeSearch}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                {debouncedQuery.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Start typing to search anime...</p>
                  </div>
                )}

                {debouncedQuery.length > 0 && debouncedQuery.length <= 2 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>Type at least 3 characters to search</p>
                  </div>
                )}

                {isLoading && debouncedQuery.length > 2 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {data && data.data.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <p>No results found for &quot;{debouncedQuery}&quot;</p>
                  </div>
                )}

                {data && data.data.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.data.slice(0, 12).map((anime) => (
                      <div key={anime.mal_id} onClick={closeSearch}>
                        <AnimeCard anime={anime} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Hint */}
              <div className="p-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-500">
                <span>Type to search</span>
                <span>Press ESC to close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
