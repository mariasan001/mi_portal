
import { Database, FileArchive, PlayCircle } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import s from './NominaCargasHero.module.css';

export default function NominaCargasHero() {
  /**
   * Respetamos accesibilidad:
   * si el usuario prefiere menos movimiento,
   * las animaciones se suavizan o se eliminan.
   */
  const shouldReduceMotion = useReducedMotion();

  /**
   * Variantes reutilizables para los badges superiores.
   * Así evitamos repetir tanto código y mantenemos
   * una entrada visual consistente.
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
            <FileArchive size={13} />
            Catálogo
          </motion.span>

          <motion.span
            className={s.metaBadge}
            variants={badgeVariants}
            transition={{ duration: 0.2 }}
          >
            <Database size={13} />
            Nómina
          </motion.span>

          <motion.span
            className={s.metaBadge}
            variants={badgeVariants}
            transition={{ duration: 0.2 }}
          >
            <PlayCircle size={13} />
            Procesamiento
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
          Carga de catálogo y nómina
        </motion.h1>

        <motion.p
          className={s.subtitle}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.16 }}
        >
          Sube, ejecuta y da seguimiento a archivos operativos del flujo de
          catálogo y staging de nómina desde una sola sesión.
        </motion.p>
      </div>
    </motion.header>
  );
}