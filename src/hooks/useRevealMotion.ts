// src/hooks/useRevealMotion.ts
import { useInViewReset } from '@/hooks/useInViewReset';
import { useScrollDir } from '@/hooks/useScrollDir';
import { cx } from '@/utils/cx';

/**
 * Dir
 * Dirección del scroll detectada por el usuario.
 * - 'down': viene bajando
 * - 'up'  : viene subiendo
 */
type Dir = 'up' | 'down';

/**
 * Options
 * Configuración para controlar cuándo “revela” (animación) y qué tan sensible
 * es el detector de dirección.
 */
type Options = {
  /**
   * threshold
   * Umbral del IntersectionObserver.
   * - 0.25 = cuando ~25% del elemento entra al viewport, lo consideramos “visible”
   * y disparamos la animación.
   */
  threshold?: number;

  /**
   * thresholdPx
   * Umbral (px) para ignorar micro-movimientos de scroll (trackpad / elastic scroll).
   * Evita que la dirección brinque entre up/down por deltas mínimos.
   */
  thresholdPx?: number;
};

/**
 * useRevealMotion<T>()
 *
 * OBJETIVO:
 * Unificar en un solo hook el patrón que repetimos en varias secciones (Hero, Services, etc.)
 * para lograr animaciones “re-trigger” (se vuelven a disparar al volver a entrar al viewport)
 * y además variar la animación según la dirección de scroll (up vs down).
 *
 * ¿Qué resuelve?
 * 1) Detecta dirección de scroll (useScrollDir) → para aplicar clases .dirDown / .dirUp.
 * 2) Detecta entrada/salida del viewport (useInViewReset) → para aplicar .isIn y permitir re-trigger.
 * 3) Construye un className final de forma consistente (cx) → TSX más limpio y repetible.
 *
 * Retorna:
 * - ref:      asignar al <section ref={...}> para que IntersectionObserver lo observe.
 * - isIn:     true cuando el elemento está dentro del viewport (según threshold).
 * - dir:      'up' | 'down' según el scroll actual.
 * - className helper: arma el string final con las clases base + estado + dirección.
 */
export function useRevealMotion<T extends HTMLElement>(opts: Options = {}) {
  // 1) Dirección de scroll (up/down) con umbral para evitar micro-deltas
  const dir = useScrollDir({ thresholdPx: opts.thresholdPx ?? 2 });

  // 2) Detecta si el elemento entra/sale del viewport (y resetea para re-animar)
  const { ref, isIn } = useInViewReset<T>({ threshold: opts.threshold ?? 0.25 });

  /**
   * className()
   * Helper para evitar repetir `cx(...)` en cada sección.
   *
   * Parámetros:
   * - base:        clase base del wrapper (ej. css.wrap)
   * - isInClass:   clase que activa animaciones cuando isIn = true (ej. css.isIn)
   * - dirDownClass clase para animación cuando vienes bajando (ej. css.dirDown)
   * - dirUpClass   clase para animación cuando vienes subiendo (ej. css.dirUp)
   */
  function className(base: string, isInClass: string, dirDownClass: string, dirUpClass: string) {
    return cx(
      base,
      isIn && isInClass,
      dir === 'down' ? dirDownClass : dirUpClass
    );
  }

  // Exportamos el paquete completo para que el TSX quede “UI pura”
  return { ref, isIn, dir: dir as Dir, className };
}