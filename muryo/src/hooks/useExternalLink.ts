import { useCallback } from 'react';
import { generateDeepLink, generateFallbackUrl } from '@/utils/deepLink';
import type { ExternalLink } from '@/types';

export function useExternalLink() {
  const openLink = useCallback((link: ExternalLink) => {
    const deepLink = generateDeepLink(link);
    const fallbackUrl = generateFallbackUrl(link);

    // Try deep link first (for mobile apps)
    // Create a hidden link element and click it
    const linkElement = document.createElement('a');
    linkElement.href = deepLink;
    linkElement.style.display = 'none';
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);

    // Set a timeout to open fallback if deep link doesn't work
    // This is a common pattern: if app opens, user won't see this
    // If app doesn't open, fallback opens after delay
    setTimeout(() => {
      // Check if we're still on the page (app didn't open)
      // If user navigated away, don't open fallback
      if (document.visibilityState === 'visible') {
        window.open(fallbackUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1000);
  }, []);

  return { openLink };
}
