

import { FileSearch, Shield } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaAuditoriaHero.module.css';

export default function NominaAuditoriaHero() {
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
            <FileSearch size={14} />
            Auditoria
          </span>

          <span className={s.metaBadge}>
            <Shield size={14} />
            Trazabilidad y consulta
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
          Auditoria de Nomina
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.16 }}
        >
          Consulta eventos de liberacion y cancelacion con filtros por version,
          periodo, etapa, recibo o llave de negocio.
        </motion.p>
      </div>
    </motion.header>
  );
}
