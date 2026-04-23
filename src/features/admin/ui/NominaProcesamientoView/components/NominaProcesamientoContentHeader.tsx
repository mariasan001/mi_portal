
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaProcesamientoContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

export default function NominaProcesamientoContentHeader({
  eyebrow,
  title,
  description,
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

        {description ? (
          <motion.p
            className={s.description}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.12 }}
          >
            {description}
          </motion.p>
        ) : null}
      </div>
    </motion.div>
  );
}