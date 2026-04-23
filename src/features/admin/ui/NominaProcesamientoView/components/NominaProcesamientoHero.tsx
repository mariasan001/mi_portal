

import { AlertTriangle, Eye, FileSpreadsheet } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaProcesamientoHero.module.css';

export default function NominaProcesamientoHero() {
  /**
   * Respetamos accesibilidad:
   * si el usuario prefiere menos movimiento,
   * reducimos o eliminamos las animaciones.
   */
  const shouldReduceMotion = useReducedMotion();

  /**
   * Variantes reutilizables para los badges.
   * Mantienen coherencia con el resto
   * de headers del módulo de nómina.
   */
  const badgeVariants = {
    hidden: { opacity: 0, y: -6 },
    show: { opacity: 1, y: 0 },
  };

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
            variants={badgeVariants}
            transition={{ duration: 0.2 }}
          >
            <FileSpreadsheet size={13} />
            Archivo
          </motion.span>

          <motion.span
            className={s.metaBadge}
            variants={badgeVariants}
            transition={{ duration: 0.2 }}
          >
            <Eye size={13} />
            Preview
          </motion.span>

          <motion.span
            className={s.metaBadge}
            variants={badgeVariants}
            transition={{ duration: 0.2 }}
          >
            <AlertTriangle size={13} />
            Errores
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
          Revisión del procesamiento
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.16 }}
        >
          Consulta el resumen del staging, una muestra de filas procesadas y el
          detalle de filas con error por archivo.
        </motion.p>
      </div>
    </motion.header>
  );
}