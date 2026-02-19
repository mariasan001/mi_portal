import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import type { CSSProperties } from 'react';
import css from './Hero.module.css';

type CSSVars = CSSProperties & {
  '--d'?: string;
};

export default function Hero() {
  const pillDelay: CSSVars = { '--d': '40ms' };
  const titleDelay: CSSVars = { '--d': '120ms' };
  const textDelay: CSSVars = { '--d': '200ms' };
  const actionsDelay: CSSVars = { '--d': '260ms' };

  return (
    <section className={css.heroWrap}>
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
            Mantente al tanto. Consulta información reciente sobre <b>trámites</b>, procesos y
            recordatorios importantes.
          </p>

          <div className={css.heroActions} style={actionsDelay}>
            <Link className={`${css.actionPill} ${css.actionPrimary}`} href="/login">
              <span className={css.actionText}>Buscar mi proceso</span>
              <span className={css.actionIcon} aria-hidden="true">
                <FiArrowUpRight />
              </span>
            </Link>

            <Link className={css.actionPill} href="/tramites">
              <span className={css.actionText}>Ver trámites</span>
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
