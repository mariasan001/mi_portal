'use client';

import { useEffect, useRef, useState } from 'react';

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
        const y = window.scrollY || 0;
        const delta = y - lastY.current;

        const THRESH = 10;



        if (y < 20) setCompact(false);
        else if (delta > THRESH) setCompact(true);
        else if (delta < -THRESH) setCompact(false);

        lastY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { compact,  };
}