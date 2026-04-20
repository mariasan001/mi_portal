'use client';

import { CalendarRange, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaBusquedaRecibosHero.module.css';

export default function NominaBusquedaRecibosHero() {
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
          Nomina
        </motion.span>

        <motion.div
          className={s.metaBadges}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <span className={s.metaBadge}>
            <Search size={14} />
            Busqueda
          </span>

          <span className={s.metaBadge}>
            <CalendarRange size={14} />
            Servidor y periodo
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
          Busqueda por servidor publico y periodo
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.16 }}
        >
          Consulta recibos completos por clave SP y periodo, considerando
          reexpediciones y mostrando encabezado, plazas, detalle fiscal y
          conceptos.
        </motion.p>
      </div>
    </motion.header>
  );
}
