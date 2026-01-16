'use client';

import { AnimeData } from '@/lib/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import HeroSlide from './HeroSlide';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';

interface HeroSliderProps {
  anime: AnimeData[];
}

export default function HeroSlider({ anime }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused || anime.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % anime.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, anime.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000); // Resume after 10s
  };

  const nextSlide = () => {
    goToSlide((currentIndex + 1) % anime.length);
  };

  const prevSlide = () => {
    goToSlide((currentIndex - 1 + anime.length) % anime.length);
  };

  if (!anime || anime.length === 0) return null;

  return (
    <div className="relative h-screen w-full">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          <HeroSlide anime={anime[currentIndex]} isActive={true} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 pointer-events-none z-20">
        <Button
          variant="ghost"
          size="lg"
          onClick={prevSlide}
          className="pointer-events-auto glass-strong rounded-full p-3 hover:bg-white/20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={nextSlide}
          className="pointer-events-auto glass-strong rounded-full p-3 hover:bg-white/20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {anime.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-white w-8'
                : 'bg-white/40 w-4 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
