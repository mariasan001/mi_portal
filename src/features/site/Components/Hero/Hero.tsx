// src/features/site/Components/Hero/Hero.tsx
'use client';

import Link from 'next/link';
import { FiArrowUpRight } from 'react-icons/fi';
import type { CSSProperties } from 'react';
import css from './Hero.module.css';
import { cx } from '@/utils/cx';
// ✅ util para componer className sin librerías
import { useScrollDir } from '@/hooks/useScrollDir';
import { useInViewReset } from '@/hooks/useInViewReset';


// ✅ hooks reutilizables (scroll direction + re-trigger al volver al viewport)

type CSSVars = CSSProperties & {
  /**
   * --d = delay para animación escalonada (stagger) desde CSS.
   * Ej: 40ms, 120ms, etc.
   */
  '--d'?: string;
};

export default function Hero() {
  /**
   * ✅ Stagger / delays
   * Usamos variables CSS en inline-style para no meter lógica de animación al CSS:
   * - CSS hace el trabajo visual
   * - TSX solo provee “timings”
   */
  const pillDelay: CSSVars = { '--d': '40ms' };
  const titleDelay: CSSVars = { '--d': '120ms' };
  const textDelay: CSSVars = { '--d': '200ms' };
  const actionsDelay: CSSVars = { '--d': '260ms' };

  /**
   * ✅ Dirección de scroll (up/down)
   * Se usa para aplicar una clase y tener una animación distinta
   * cuando el usuario vuelve al Hero subiendo o bajando.
   */
  const dir = useScrollDir({ thresholdPx: 2 });

  /**
   * ✅ InView con reset
   * - isIn = true cuando el Hero entra al viewport
   * - isIn = false cuando sale
   * Esto permite re-animar cada vez que el Hero vuelve a entrar.
   */
  const { ref, isIn } = useInViewReset<HTMLElement>({ threshold: 0.35 });

  /**
   * ✅ className final
   * - heroWrap: estilos base + fondos (normal/veda via CSS)
   * - isIn: habilita animaciones (solo cuando está en viewport)
   * - dirUp/dirDown: define variante de animación según dirección
   */
  const className = cx(
    css.heroWrap,
    isIn && css.isIn,
    dir === 'down' ? css.dirDown : css.dirUp
  );

  return (
    /**
     * ✅ ref va en el elemento que queremos observar con IntersectionObserver
     * No hay casts: useInViewReset ya devuelve un ref tipado.
     */
    <section ref={ref} className={className} aria-label="Hero">
      <div className={css.heroInner}>
        <div className={css.heroCard}>
          {/* ✅ Badge/pill institucional */}
          <div className={css.heroPill} style={pillDelay}>
            <span className={css.pillDot} />
            Portal institucional
          </div>

          {/* ✅ Headline */}
          <h1 className={css.heroTitle} style={titleDelay}>
            PORTAL DE COMUNICACIONES
          </h1>

          {/* ✅ Descripción corta (usa tokens; <b> toma var(--accent) en CSS) */}
          <p className={css.heroText} style={textDelay}>
            Mantente al tanto. Consulta información reciente sobre <b>trámites</b>, procesos y
            recordatorios importantes.
          </p>

          {/* ✅ Acciones (CTAs). El stagger de los botones se controla desde CSS con nth-child */}
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