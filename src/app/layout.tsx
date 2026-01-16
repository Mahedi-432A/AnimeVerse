import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import SearchModal from '@/components/SearchModal';
import { Metadata } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AnimeVerse - Discover Your Next Favorite Anime',
  description: 'Explore trending, upcoming, and top-rated anime with AnimeVerse. Your cinematic gateway to the anime universe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          {children}
          <SearchModal />
        </Providers>
      </body>
    </html>
  );
}
