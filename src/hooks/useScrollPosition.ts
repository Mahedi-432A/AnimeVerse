import { useEffect, useState } from 'react';

export function useScrollPosition() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(currentScrollY);
          
          if (Math.abs(currentScrollY - lastScrollY) > 5) {
            setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up');
            lastScrollY = currentScrollY;
          }
          
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', updateScrollPosition);
    return () => window.removeEventListener('scroll', updateScrollPosition);
  }, []);

  return { scrollPosition, scrollDirection };
}