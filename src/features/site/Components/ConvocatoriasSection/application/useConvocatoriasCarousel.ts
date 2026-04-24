'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { clamp, prefersReducedMotion } from '../model/convocatorias.utils';

type PostCard = {
  id: string;
};

type Params = {
  posts: PostCard[];
  scrollerRef: React.RefObject<HTMLDivElement | null>;
};

export function useConvocatoriasCarousel({ posts, scrollerRef }: Params) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stepRef = useRef<number>(320);

  const clampIndex = useCallback(
    (index: number) => clamp(index, 0, Math.max(0, posts.length - 1)),
    [posts.length]
  );

  const computeStep = useCallback(() => {
    const element = scrollerRef.current;
    if (!element) return;

    const firstCard = element.querySelector<HTMLElement>('[data-post]');
    if (!firstCard) return;

    const gap = 18;
    stepRef.current = firstCard.offsetWidth + gap;
  }, [scrollerRef]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const element = scrollerRef.current;
      if (!element) return;

      const nextIndex = clampIndex(index);
      element.scrollTo({ left: stepRef.current * nextIndex, behavior: 'smooth' });
      setActive(nextIndex);
    },
    [scrollerRef, clampIndex]
  );

  const scrollByCard = useCallback(
    (direction: 1 | -1) => {
      scrollToIndex(active + direction);
    },
    [active, scrollToIndex]
  );

  useEffect(() => {
    computeStep();
    const element = scrollerRef.current;
    if (!element) return;

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const step = stepRef.current || 1;
        const index = Math.round(element.scrollLeft / step);
        const safeIndex = clampIndex(index);
        setActive((previous) => (previous === safeIndex ? previous : safeIndex));
      });
    };

    element.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => computeStep();
    window.addEventListener('resize', onResize);

    return () => {
      element.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, [computeStep, clampIndex, scrollerRef]);

  useEffect(() => {
    if (paused) return;
    if (prefersReducedMotion()) return;
    if (posts.length <= 1) return;

    const timer = window.setInterval(() => {
      const nextIndex = active + 1 >= posts.length ? 0 : active + 1;
      scrollToIndex(nextIndex);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [paused, active, posts.length, scrollToIndex]);

  const pickById = useCallback(
    (id: string) => {
      const index = posts.findIndex((post) => post.id === id);
      if (index < 0) return;

      setPaused(true);
      scrollToIndex(index);
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
