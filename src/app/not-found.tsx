import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-9xl font-bold gradient-text">404</h1>
        <h2 className="text-3xl font-bold">Anime Not Found</h2>
        <p className="text-gray-400 text-lg">
          The anime you&apos;re looking for doesn&apos;t exist in our universe.
        </p>
        <Link href="/">
          <Button variant="primary" size="lg" icon={<Home className="w-5 h-5" />}>
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
