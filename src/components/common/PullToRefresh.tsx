import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RefreshCw, ArrowDown, AlertCircle } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<any> | void;
  children: React.ReactNode;
  containerId?: string;
  disabled?: boolean;
  className?: string;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({
  onRefresh,
  children,
  containerId,
  disabled = false,
  className = ''
}) => {
  const [pullDistance, setPullDistance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const startYRef = useRef<number>(0);
  const startXRef = useRef<number>(0);
  const isPullingRef = useRef<boolean>(false);
  const isTouchingRef = useRef<boolean>(false);
  const hasTriggeredHapticRef = useRef<boolean>(false);

  const PULL_THRESHOLD = 60; // Distance needed to trigger refresh
  const MAX_PULL = 90; // Maximum visual pull distance
  const HOLD_DISTANCE = 48; // Distance indicator rests during refresh

  // Helper to find the active scrollable container
  const getScrollContainer = useCallback((): HTMLElement | Window => {
    if (containerId) {
      const el = document.getElementById(containerId);
      if (el) return el;
    }
    // Search upwards for scroll container
    let parent = wrapperRef.current?.parentElement;
    while (parent) {
      const style = window.getComputedStyle(parent);
      if (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return window;
  }, [containerId]);

  const getScrollTop = useCallback((): number => {
    const container = getScrollContainer();
    if (container === window) {
      return window.scrollY || document.documentElement.scrollTop || 0;
    }
    return (container as HTMLElement).scrollTop || 0;
  }, [getScrollContainer]);

  const executeRefresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setPullDistance(HOLD_DISTANCE);
    setErrorMessage(null);

    try {
      await Promise.resolve(onRefresh());
    } catch (err: any) {
      console.warn('PullToRefresh failed:', err?.message || err);
      setErrorMessage("Couldn't refresh. Please try again.");
      setTimeout(() => {
        setErrorMessage(null);
      }, 3200);
    } finally {
      // Smooth reset after refresh finishes
      setTimeout(() => {
        setIsRefreshing(false);
        setPullDistance(0);
      }, 350);
    }
  }, [isRefreshing, onRefresh]);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled || isRefreshing) return;
    const scrollTop = getScrollTop();
    // Only allow pull-down if already scrolled to the top
    if (scrollTop <= 1) {
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      isTouchingRef.current = true;
      isPullingRef.current = false;
      hasTriggeredHapticRef.current = false;
    } else {
      isTouchingRef.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchingRef.current || disabled || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const currentX = e.touches[0].clientX;
    const deltaY = currentY - startYRef.current;
    const deltaX = Math.abs(currentX - startXRef.current);

    // If horizontal scroll is dominant, cancel pull-to-refresh
    if (!isPullingRef.current && deltaX > deltaY) {
      isTouchingRef.current = false;
      return;
    }

    // Only process downward pulls when at the top
    const scrollTop = getScrollTop();
    if (deltaY > 0 && scrollTop <= 1) {
      isPullingRef.current = true;
      // Damped curve for natural elasticity
      const damping = 0.45;
      const calculated = Math.min(MAX_PULL, deltaY * damping);
      setPullDistance(calculated);

      // Light haptic feedback once threshold is crossed
      if (calculated >= PULL_THRESHOLD && !hasTriggeredHapticRef.current) {
        hasTriggeredHapticRef.current = true;
        if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
          window.navigator.vibrate(15);
        }
      } else if (calculated < PULL_THRESHOLD) {
        hasTriggeredHapticRef.current = false;
      }

      // Prevent native browser refresh or bounce if supported
      if (e.cancelable && deltaY > 15) {
        e.preventDefault();
      }
    } else {
      setPullDistance(0);
      isPullingRef.current = false;
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchingRef.current || disabled) return;
    isTouchingRef.current = false;

    if (pullDistance >= PULL_THRESHOLD && !isRefreshing) {
      executeRefresh();
    } else if (!isRefreshing) {
      setPullDistance(0);
    }
    isPullingRef.current = false;
  };

  // Keep pullDistance synchronized if refreshing
  const effectivePullDistance = isRefreshing ? HOLD_DISTANCE : pullDistance;
  const isThresholdMet = pullDistance >= PULL_THRESHOLD;

  return (
    <div
      ref={wrapperRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`relative w-full ${className}`}
    >
      {/* ─── PULL REFRESH INDICATOR PILL ─── */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-transform duration-100 ease-out"
        style={{
          top: 0,
          transform: `translate(-50%, ${effectivePullDistance > 8 ? effectivePullDistance - 38 : -50}px)`,
          opacity: effectivePullDistance > 8 ? Math.min(1, effectivePullDistance / 35) : 0,
          pointerEvents: 'none'
        }}
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-slate-200/90 text-xs font-bold text-[#087F5B]">
          {isRefreshing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#087F5B]" />
              <span className="text-[11px] font-bold text-slate-800">Refreshing...</span>
            </>
          ) : isThresholdMet ? (
            <>
              <ArrowDown className="w-3.5 h-3.5 text-[#087F5B] transition-transform duration-200 rotate-180" />
              <span className="text-[11px] font-bold text-[#087F5B]">Release to refresh</span>
            </>
          ) : (
            <>
              <ArrowDown
                className="w-3.5 h-3.5 text-slate-500 transition-transform duration-100"
                style={{
                  transform: `rotate(${Math.min(180, (effectivePullDistance / PULL_THRESHOLD) * 180)}deg)`
                }}
              />
              <span className="text-[11px] font-semibold text-slate-600">Pull to refresh</span>
            </>
          )}
        </div>
      </div>

      {/* ─── ERROR TOAST NOTIFICATION (Non-intrusive) ─── */}
      {errorMessage && (
        <div className="fixed top-18 left-1/2 -translate-x-1/2 z-50 max-w-[320px] w-[90%] bg-slate-900/95 text-white px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-top-2 border border-white/10 backdrop-blur-md">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
        </div>
      )}

      {/* ─── CONTENT CONTAINER (Gently displaced during pull gesture) ─── */}
      <div
        style={{
          transform: effectivePullDistance > 0 ? `translate3d(0, ${effectivePullDistance * 0.4}px, 0)` : 'none',
          transition: isTouchingRef.current ? 'none' : 'transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        {children}
      </div>
    </div>
  );
};
