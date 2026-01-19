import { useState, useRef, TouchEvent } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Minimum distance to be considered a swipe (in pixels)
}

interface SwipeResult {
  onTouchStart: (e: TouchEvent) => void;
  onTouchMove: (e: TouchEvent) => void;
  onTouchEnd: () => void;
  isSwiping: boolean;
  swipeDirection: 'left' | 'right' | null;
}

export const useSwipe = (handlers: SwipeHandlers): SwipeResult => {
  const { onSwipeLeft, onSwipeRight, threshold = 50 } = handlers;

  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const touchStart = useRef<{ x: number; y: number; time: number } | null>(null);
  const touchCurrent = useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
    touchCurrent.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.touches[0];
    touchCurrent.current = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const deltaX = touch.clientX - touchStart.current.x;
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);

    // Only consider horizontal swipes (ignore if vertical movement is significant)
    if (Math.abs(deltaX) > threshold && deltaY < 50) {
      setIsSwiping(true);
      setSwipeDirection(deltaX > 0 ? 'right' : 'left');
    }
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchCurrent.current) {
      reset();
      return;
    }

    const deltaX = touchCurrent.current.x - touchStart.current.x;
    const deltaY = Math.abs(touchCurrent.current.y - touchStart.current.y);
    const deltaTime = Date.now() - touchStart.current.time;

    // Check if it's a valid swipe (horizontal, fast enough, and long enough)
    if (Math.abs(deltaX) > threshold && deltaY < 50 && deltaTime < 500) {
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    }

    reset();
  };

  const reset = () => {
    setIsSwiping(false);
    setSwipeDirection(null);
    touchStart.current = null;
    touchCurrent.current = null;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    isSwiping,
    swipeDirection,
  };
};
