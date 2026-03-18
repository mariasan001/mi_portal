'use client';

import { useEffect, useRef, useState } from 'react';

const TOP_OFFSET = 20;
const SCROLL_THRESHOLD = 10;

export function useCompactNav() {
  const [compact, setCompact] = useState(false);

  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY || 0;
        const delta = currentY - lastY.current;

        if (currentY < TOP_OFFSET) {
          setCompact(false);
        } else if (delta > SCROLL_THRESHOLD) {
          setCompact(true);
        } else if (delta < -SCROLL_THRESHOLD) {
          setCompact(false);
        }

        lastY.current = currentY;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { compact };
}