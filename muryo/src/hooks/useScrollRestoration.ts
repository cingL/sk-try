import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SCROLL_POSITIONS_KEY = 'muryo_scroll_positions';

interface ScrollPositions {
  [pathname: string]: number;
}

export function useScrollRestoration() {
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLElement | null>(null);

  // Save scroll position before navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const positions: ScrollPositions = JSON.parse(
        sessionStorage.getItem(SCROLL_POSITIONS_KEY) || '{}'
      );
      positions[location.pathname] = scrollY;
      sessionStorage.setItem(SCROLL_POSITIONS_KEY, JSON.stringify(positions));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [location.pathname]);

  // Restore scroll position after navigation
  useEffect(() => {
    const positions: ScrollPositions = JSON.parse(
      sessionStorage.getItem(SCROLL_POSITIONS_KEY) || '{}'
    );
    const savedPosition = positions[location.pathname];

    if (savedPosition !== undefined) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        window.scrollTo({
          top: savedPosition,
          behavior: 'auto', // Instant scroll, not smooth
        });
      });
    } else {
      // If no saved position, scroll to top
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  return scrollContainerRef;
}
