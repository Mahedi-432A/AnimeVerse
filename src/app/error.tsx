'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';
import { RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold gradient-text">Oops!</h1>
        <h2 className="text-2xl font-bold">Something went wrong</h2>
        <p className="text-gray-400">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <Button
          variant="primary"
          size="lg"
          onClick={reset}
          icon={<RefreshCcw className="w-5 h-5" />}
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
