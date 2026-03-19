'use client';

import { useRevealMotion } from '@/hooks/useRevealMotion';
import s from './ComprobantesHero.module.css';

type Props = {
  title: string;
  accent: string;
  subtitleStrong: string;
  subtitle: string;
};

/**
 * Hero principal del módulo.
 */
export default function ComprobantesHero({
  title,
  accent,
  subtitleStrong,
  subtitle,
}: Props) {
  const { ref, className } = useRevealMotion<HTMLElement>({
    threshold: 0.2,
    thresholdPx: 8,
  });

  return (
    <header
      ref={ref}
      className={className(s.head, s.isIn, s.dirDown, s.dirUp)}
    >
      <h1 className={s.title}>
        {title} <span className={s.titleAccent}>{accent}</span>
      </h1>

      <p className={s.subtitleStrong}>{subtitleStrong}</p>
      <p className={s.subtitle}>{subtitle}</p>
    </header>
  );
}