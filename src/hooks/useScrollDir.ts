// src/lib/hooks/useScrollDir.ts
'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Dirección detectada de scroll.
 * - 'down' cuando el usuario se desplaza hacia abajo.
 * - 'up' cuando el usuario se desplaza hacia arriba.
 */
export type ScrollDir = 'up' | 'down';

type Options = {
  /**
   * Dirección inicial (útil para SSR/hidratación y estados iniciales previsibles).
   * Por defecto: 'down'
   */
  initial?: ScrollDir;

  /**
   * Umbral en píxeles para ignorar micro-movimientos (trackpads/scroll elástico).
   * Evita "parpadeo" entre up/down por pequeños deltas.
   * Por defecto: 2px
   */
  thresholdPx?: number;
};

/**
 * useScrollDir()
 * Hook para detectar si el usuario está scrolleando hacia arriba o hacia abajo.
 *
 * ✅ Caso de uso:
 * - Animaciones diferentes según dirección (up vs down).
 * - UI “premium”: nav/hero que responde a cómo navega el usuario.
 *
 * ✅ Performance:
 * - Listener de scroll con `{ passive: true }`.
 * - Ignora micro-deltas (thresholdPx).
 * - Solo actualiza estado si cambia la dirección real.
 *
 * ✅ Importante:
 * - Este hook solo funciona en cliente ("use client").
 */
export function useScrollDir(options: Options = {}): ScrollDir {
  const { initial = 'down', thresholdPx = 2 } = options;

  const [dir, setDir] = useState<ScrollDir>(initial);

  // Última posición Y registrada
  const lastY = useRef<number>(0);

  // Última dirección registrada, para evitar setState redundantes
  const lastDir = useRef<ScrollDir>(initial);

  useEffect(() => {
    lastY.current = window.scrollY || 0;

    const onScroll = () => {
      const y = window.scrollY || 0;
      const delta = y - lastY.current;

      // ✅ Ignora movimientos mínimos (trackpad / scroll elástico)
      if (Math.abs(delta) < thresholdPx) return;

      const next: ScrollDir = delta > 0 ? 'down' : 'up';

      // ✅ Solo actualiza cuando cambia la dirección
      if (next !== lastDir.current) {
        lastDir.current = next;
        setDir(next);
      }

      lastY.current = y;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [thresholdPx]);

  return dir;
}