// src/features/site/Components/ConvocatoriasSection/hooks/useConvocatoriasCarousel.ts
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, prefersReducedMotion } from '../utils/convocatoriasUtils';

type PostCard = { id: string };

type Params = {
  posts: PostCard[];
  scrollerRef: React.RefObject<HTMLDivElement | null>;
};

export function useConvocatoriasCarousel({ posts, scrollerRef }: Params) {
  const [active, setActive] = useState(0);
  const stepRef = useRef<number>(320);

  const [paused, setPaused] = useState(false);

  const clampIndex = useCallback(
    (i: number) => clamp(i, 0, Math.max(0, posts.length - 1)),
    [posts.length]
  );

  const computeStep = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const first = el.querySelector<HTMLElement>('[data-post]');
    if (!first) return;

    const gap = 18; // debe coincidir con tu CSS
    stepRef.current = first.offsetWidth + gap;
  }, [scrollerRef]);

  const scrollToIndex = useCallback(
    (idx: number) => {
      const el = scrollerRef.current;
      if (!el) return;

      const next = clampIndex(idx);
      el.scrollTo({ left: stepRef.current * next, behavior: 'smooth' });
      setActive(next);
    },
    [scrollerRef, clampIndex]
  );

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      scrollToIndex(active + dir);
    },
    [active, scrollToIndex]
  );

  // ✅ mantener step actualizado + set índice por scroll real
  useEffect(() => {
    computeStep();
    const el = scrollerRef.current;
    if (!el) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = stepRef.current || 1;
        const idx = Math.round(el.scrollLeft / step);
        const safe = clampIndex(idx);
        setActive((prev) => (prev === safe ? prev : safe));
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => computeStep();
    window.addEventListener('resize', onResize);

    return () => {
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [computeStep, clampIndex, scrollerRef]);

  // ✅ autoplay
  useEffect(() => {
    if (paused) return;
    if (prefersReducedMotion()) return;
    if (posts.length <= 1) return;

    const t = window.setInterval(() => {
      const next = active + 1 >= posts.length ? 0 : active + 1;
      scrollToIndex(next);
    }, 4200);

    return () => window.clearInterval(t);
  }, [paused, active, posts.length, scrollToIndex]);

  const pickById = useCallback(
    (id: string) => {
      const idx = posts.findIndex((p) => p.id === id);
      if (idx < 0) return;

      setPaused(true);
      scrollToIndex(idx);
      window.setTimeout(() => setPaused(false), 900);
    },
    [posts, scrollToIndex]
  );

  return {
    active,
    paused,
    setPaused,
    scrollToIndex,
    scrollByCard,
    pickById,
  };
}