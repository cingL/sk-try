import { useRef, useState, useEffect, useCallback } from 'react';

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  enabled?: boolean;
}

export function usePullToRefresh({ 
  onRefresh, 
  threshold = 80,
  enabled = true 
}: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);
  const isPulling = useRef(false);
  const pullDistanceRef = useRef(0);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setPullDistance(threshold);
    
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
      setTimeout(() => {
        setPullDistance(0);
        pullDistanceRef.current = 0;
      }, 300);
    }
  }, [onRefresh, threshold]);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      // 只在页面顶部时允许下拉刷新
      if (window.scrollY > 0 || isRefreshing) return;
      
      // 检查是否点击了可交互元素
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a') || target.closest('input')) {
        return;
      }
      
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return;
      
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY.current;
      
      // 只允许向下拉，且页面在顶部
      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault();
        const pullAmount = Math.min(distance * 0.5, threshold * 1.5);
        setPullDistance(pullAmount);
        pullDistanceRef.current = pullAmount;
      } else if (distance < 0) {
        // 向上滑动时重置
        isPulling.current = false;
        setPullDistance(0);
        pullDistanceRef.current = 0;
      }
    };

    const handleTouchEnd = () => {
      if (!isPulling.current || isRefreshing) return;
      
      isPulling.current = false;
      const finalDistance = pullDistanceRef.current;
      
      if (finalDistance >= threshold) {
        handleRefresh();
      } else {
        setPullDistance(0);
        pullDistanceRef.current = 0;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, threshold, isRefreshing, handleRefresh]);

  return {
    isRefreshing,
    pullDistance,
    pullProgress: Math.min(pullDistance / threshold, 1)
  };
}
