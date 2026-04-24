
import { FileSignature, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './FirmaElectronicaHero.module.css';

export default function FirmaElectronicaHero() {
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
          Firma electronica
        </motion.span>

        <motion.div
          className={s.metaBadges}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          <span className={s.metaBadge}>
            <FileSignature size={14} />
            Solicitudes
          </span>

          <span className={s.metaBadge}>
            <ShieldCheck size={14} />
            Estatus y detalle
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
          Firma electronica
        </motion.h1>
         
        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.16 }}
        >
          Gestiona solicitudes de firma, consulta su estatus
        </motion.p>
      </div>
    </motion.header>
  );
}
