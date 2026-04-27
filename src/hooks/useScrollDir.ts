'use client';

import { useEffect, useRef, useState } from 'react';

export type ScrollDir = 'up' | 'down';

type Options = {
  initial?: ScrollDir;
  thresholdPx?: number;
};

export function useScrollDir(options: Options = {}): ScrollDir {
  const { initial = 'down', thresholdPx = 2 } = options;

  const [dir, setDir] = useState<ScrollDir>(initial);

  const lastY = useRef(0);
  const lastDir = useRef<ScrollDir>(initial);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;

      // Ignore micro-deltas to avoid noisy direction changes.
      if (Math.abs(delta) < thresholdPx) return;

      const next: ScrollDir = delta > 0 ? 'down' : 'up';

      // Only update state when the direction actually changes.
      if (next !== lastDir.current) {
        lastDir.current = next;
        setDir(next);
      }

      // Keep the current position for the next delta calculation.
      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [thresholdPx]);

  return dir;
}
