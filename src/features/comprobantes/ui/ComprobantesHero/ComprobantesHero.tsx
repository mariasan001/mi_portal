'use client';

import s from './ComprobantesHero.module.css';
import { useRevealMotion } from '@/hooks/useRevealMotion';

type Props = {
  displayName: string;
};

export default function ComprobantesHero({  }: Props) {
  const { ref, className } = useRevealMotion<HTMLElement>({
    threshold: 0.2,
    thresholdPx: 8,
  });

  return (
   <header
        ref={ref}
        className={className(
          s.head,
          s.isIn,
          s.dirDown,
          s.dirUp
        )}
      >
      <h1 className={s.title}>
        Hola, <span className={s.titleAccent}>Maria Sandoval.</span>
      </h1>

      <p className={s.subtitleStrong}>Nos da mucho gusto tenerte aquí.</p>

      <p className={s.subtitle}>
        Desde este <strong>portal podrás consultar tus comprobantes, constancias, movimientos</strong>{' '}
        de personal y demás servicios digitales disponibles para ti.
      </p>
    </header>
  );
}

/**
 *  export default function ComprobantesHero({ displayName }: Props) {
 *    Hola, <span className={s.titleAccent}>{displayName}.</span>
 * 
 */