

import { CalendarRange, Layers3 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import s from './NominaConfigHero.module.css';

export default function NominaConfigHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      className={s.hero}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.32,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={s.headerTop}>
        <motion.span
          className={s.kicker}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.22, delay: 0.04 }}
        >
          Nómina
        </motion.span>

        <motion.div
          className={s.metaBadges}
          initial={shouldReduceMotion ? false : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'show'}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.08,
              },
            },
          }}
        >
          <motion.span
            className={s.metaBadge}
            variants={{
              hidden: { opacity: 0, y: -6 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            <CalendarRange size={13} />
            Periodo
          </motion.span>

          <motion.span
            className={s.metaBadge}
            variants={{
              hidden: { opacity: 0, y: -6 },
              show: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.2 }}
          >
            <Layers3 size={13} />
            Versión
          </motion.span>
        </motion.div>
      </div>

      <div className={s.content}>
        <motion.h1
          className={s.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.12 }}
        >
          Gestión de periodo y versión
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.16 }}
        >
          Consulta, crea y organiza la configuración base del procesamiento de
          nómina.
        </motion.p>
      </div>
    </motion.header>
  );
}