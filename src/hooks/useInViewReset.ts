// src/lib/hooks/useInViewReset.ts
'use client';

import { useEffect, useRef, useState } from 'react';

type Options = {
  /**
   * Qué porcentaje del elemento debe ser visible para considerarse "en viewport".
   * 0.35 = 35% visible
   * Por defecto: 0.35
   */
  threshold?: number;

  /**
   * Permite adelantar o retrasar el área de detección.
   * Ejemplos:
   * - '0px 0px -10% 0px' (se considera fuera un poco antes por abajo)
   * - '10% 0px 0px 0px' (entra antes por arriba)
   */
  rootMargin?: string;
};

type Result<T extends HTMLElement> = {
  /**
   * Ref a colocar en el elemento que quieres observar.
   */
  ref: React.RefObject<T | null>;

  /**
   * true cuando el elemento está dentro del viewport (según threshold/margin),
   * false cuando sale. (Resetea automáticamente al salir).
   */
  isIn: boolean;
};

/**
 * useInViewReset()
 * Hook basado en IntersectionObserver que:
 * - pone `isIn = true` cuando el elemento entra al viewport
 * - pone `isIn = false` cuando sale
 *
 * ✅ Para qué sirve:
 * - Re-disparar animaciones cada vez que el componente vuelve a entrar al viewport.
 * - Efecto “premium”: scroll down/up y el contenido se “revela” de nuevo.
 *
 * ✅ Por qué “Reset”:
 * - Si solo marcaras `true` y nunca regresaras a `false`,
 *   la animación ocurriría una sola vez.
 *
 * ✅ Performance:
 * - IntersectionObserver es más eficiente que escuchar scroll y calcular posiciones.
 *
 * ✅ Nota:
 * - Este hook no fuerza re-render constante; solo cambia estado en entradas/salidas.
 */
export function useInViewReset<T extends HTMLElement>(
  options: Options = {}
): Result<T> {
  const { threshold = 0.35, rootMargin } = options;

  const ref = useRef<T | null>(null);
  const [isIn, setIsIn] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsIn(true);
        else setIsIn(false); // ✅ reset para re-trigger
      },
      { threshold, rootMargin }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [threshold, rootMargin]);

  return { ref, isIn };
}