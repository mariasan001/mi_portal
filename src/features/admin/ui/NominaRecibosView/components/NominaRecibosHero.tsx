'use client';

import { FileText, RefreshCw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaRecibosHero.module.css';

export default function NominaRecibosHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.header
      className={s.hero}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.24,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={s.headerTop}>
        <motion.span
          className={s.kicker}
          initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{ duration: 0.18, delay: 0.04 }}
        >
          Nómina
        </motion.span>

        <motion.div
          className={s.metaBadges}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <span className={s.metaBadge}>
            <FileText size={14} />
            Recibos
          </span>

          <span className={s.metaBadge}>
            <RefreshCw size={14} />
            Liberación y sincronización
          </span>
        </motion.div>
      </div>

      <div className={s.content}>
        <motion.h1
          className={s.title}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          Liberación de Nómina
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.16 }}
        >
          Gestiona la generación, liberación y sincronización de recibos de nómina.
        </motion.p>
      </div>
    </motion.header>
  );
}