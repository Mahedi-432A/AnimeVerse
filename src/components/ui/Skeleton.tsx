import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'card' | 'hero' | 'text';
}

export default function Skeleton({ className, variant = 'card' }: SkeletonProps) {
  const variants = {
    card: 'aspect-[2/3] rounded-xl',
    hero: 'h-screen w-full',
    text: 'h-4 w-full rounded',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-card via-white/5 to-card',
        'relative overflow-hidden',
        variants[variant],
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}

// Specialized skeleton components
export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton variant="card" />
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-card">
      <Skeleton variant="hero" />
      <div className="absolute bottom-20 left-20 space-y-4 w-1/2">
        <Skeleton variant="text" className="h-12 w-3/4" />
        <Skeleton variant="text" className="h-6 w-full" />
        <Skeleton variant="text" className="h-6 w-full" />
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 20 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
