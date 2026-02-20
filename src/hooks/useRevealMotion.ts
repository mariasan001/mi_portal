// src/lib/hooks/useRevealMotion.ts
'use client';

import { cx } from "@/utils/cx";
import { useInViewReset } from "./useInViewReset";
import { useScrollDir } from "./useScrollDir";

type Dir = 'up' | 'down';

type Options = {
  threshold?: number;
  thresholdPx?: number;
  rootMargin?: string; // opcional por si luego lo necesitas
};

export function useRevealMotion<T extends HTMLElement>(opts: Options = {}) {
  const dir = useScrollDir({ thresholdPx: opts.thresholdPx ?? 2 });

  const { ref, isIn } = useInViewReset<T>({
    threshold: opts.threshold ?? 0.25,
    rootMargin: opts.rootMargin,
  });

  function className(base: string, isInClass: string, dirDownClass: string, dirUpClass: string) {
    return cx(base, isIn && isInClass, dir === 'down' ? dirDownClass : dirUpClass);
  }

  return { ref, isIn, dir: dir as Dir, className };
}