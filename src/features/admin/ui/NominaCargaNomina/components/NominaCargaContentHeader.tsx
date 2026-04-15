'use client';

import { ArrowLeft } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import s from './NominaCargaContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  showBackButton?: boolean;
  onBack?: () => void;
};

export default function NominaCargaContentHeader({
  eyebrow,
  title,
  showBackButton = false,
  onBack,
}: Props) {
  /**
   * Respetamos accesibilidad:
   * si el usuario prefiere menos movimiento,
   * suavizamos o eliminamos animaciones.
   */
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={s.header}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={s.copy}>
        <motion.span
          className={s.eyebrow}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.18, delay: 0.04 }}
        >
          {eyebrow}
        </motion.span>

        <motion.h3
          className={s.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          {title}
        </motion.h3>
      </div>

      {showBackButton && onBack ? (
        <motion.button
          type="button"
          className={s.button}
          onClick={onBack}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          whileHover={
            !shouldReduceMotion
              ? { y: -1, transition: { duration: 0.16 } }
              : undefined
          }
          whileTap={!shouldReduceMotion ? { scale: 0.99 } : undefined}
        >
          <ArrowLeft size={15} />
          Ver resultados
        </motion.button>
      ) : null}
    </motion.div>
  );
}