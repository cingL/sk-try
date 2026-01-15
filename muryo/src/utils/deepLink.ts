import type { LinkPlatform, ExternalLink } from '@/types';

export interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

export function detectPlatform(): PlatformInfo {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
  const isAndroid = /android/i.test(userAgent);
  const isMobile = isIOS || isAndroid;

  return { isIOS, isAndroid, isMobile };
}

const URL_SCHEMES: Record<LinkPlatform, { ios?: string; android?: string; fallback: string }> = {
  rednote: {
    ios: 'xhs://',
    android: 'xhs://',
    fallback: 'https://www.xiaohongshu.com',
  },
  weibo: {
    ios: 'sinaweibo://',
    android: 'sinaweibo://',
    fallback: 'https://weibo.com',
  },
  website: {
    fallback: 'https://',
  },
  other: {
    fallback: 'https://',
  },
};

export function generateDeepLink(link: ExternalLink): string {
  const platform = detectPlatform();
  const schemeConfig = URL_SCHEMES[link.platform];

  if (!schemeConfig) {
    return link.url || 'https://';
  }

  // If URL scheme is provided, use it
  if (link.scheme) {
    return link.scheme;
  }

  // Try platform-specific scheme
  if (platform.isIOS && schemeConfig.ios) {
    return `${schemeConfig.ios}${link.username || ''}`;
  }

  if (platform.isAndroid && schemeConfig.android) {
    return `${schemeConfig.android}${link.username || ''}`;
  }

  // Fallback to HTTPS URL
  if (link.url) {
    return link.url;
  }

  // Generate fallback URL based on platform
  if (link.platform === 'rednote' && link.username) {
    return `https://www.xiaohongshu.com/user/profile/${link.username}`;
  }

  if (link.platform === 'weibo' && link.username) {
    return `https://weibo.com/${link.username}`;
  }

  return schemeConfig.fallback;
}

export function generateFallbackUrl(link: ExternalLink): string {
  if (link.url) {
    return link.url;
  }

  const schemeConfig = URL_SCHEMES[link.platform];
  if (!schemeConfig) {
    return 'https://';
  }

  if (link.platform === 'rednote' && link.username) {
    return `https://www.xiaohongshu.com/user/profile/${link.username}`;
  }

  if (link.platform === 'weibo' && link.username) {
    return `https://weibo.com/${link.username}`;
  }

  return schemeConfig.fallback;
}
