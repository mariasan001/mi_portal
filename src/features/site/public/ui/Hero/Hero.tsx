'use client';

import type { CSSProperties } from 'react';
import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';

import { useInViewReset } from '@/hooks/useInViewReset';
import { useScrollDir } from '@/hooks/useScrollDir';
import { cx } from '@/utils/cx';

import css from './Hero.module.css';

type CSSVars = CSSProperties & {
  '--d'?: string;
};

export default function Hero() {
  const pillDelay: CSSVars = { '--d': '40ms' };
  const titleDelay: CSSVars = { '--d': '120ms' };
  const textDelay: CSSVars = { '--d': '200ms' };
  const actionsDelay: CSSVars = { '--d': '260ms' };

  const dir = useScrollDir({ thresholdPx: 2 });
  const { ref, isIn } = useInViewReset<HTMLElement>({ threshold: 0.35 });

  const className = cx(
    css.heroWrap,
    isIn && css.isIn,
    dir === 'down' ? css.dirDown : css.dirUp
  );

  return (
    <section ref={ref} className={className} aria-label="Hero">
      <div className={css.heroInner}>
        <div className={css.heroCard}>
          <div className={css.heroPill} style={pillDelay}>
            <span className={css.pillDot} />
            Portal institucional
          </div>

          <h1 className={css.heroTitle} style={titleDelay}>
            PORTAL DE COMUNICACIONES
          </h1>

          <p className={css.heroText} style={textDelay}>
            Mantente al tanto. Consulta informacion reciente sobre <b>tramites</b>,
            procesos y recordatorios importantes.
          </p>

          <div className={css.heroActions} style={actionsDelay}>
            <Link className={`${css.actionPill} ${css.actionPrimary}`} href="/login">
              <span className={css.actionText}>Buscar mi proceso</span>
              <span className={css.actionIcon} aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </Link>

            <Link className={css.actionPill} href="/tramites">
              <span className={css.actionText}>Ver tramites</span>
              <span className={css.actionIcon} aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
