
import { Database, Files } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaCargaEntityCards.module.css';
import { NominaCargaEntity } from '../types/nomina-cargas.types';

type Props = {
  activeEntity: NominaCargaEntity;
  onSelect: (entity: NominaCargaEntity) => void;
};

/**
 * Variantes simples para entrada escalonada.
 * Mantiene consistencia con otros bloques del módulo.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaCargaEntityCards({
  activeEntity,
  onSelect,
}: Props) {
  /**
   * Accesibilidad:
   * si el usuario prefiere reducir movimiento,
   * evitamos animaciones innecesarias.
   */
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.grid}
      initial={shouldReduceMotion ? false : 'hidden'}
      animate={shouldReduceMotion ? undefined : 'show'}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.06,
          },
        },
      }}
    >
      <motion.button
        type="button"
        className={`${s.card} ${
          activeEntity === 'catalogo' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('catalogo')}
        variants={itemVariants}
        transition={{ duration: 0.24 }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { y: -2, transition: { duration: 0.16 } }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
        layout
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Files size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Catálogos</h2>

            {activeEntity === 'catalogo' ? (
              <motion.span
                className={s.stateBadge}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }
                }
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>
            Sube archivos DBF, ejecútalos y consulta el resultado del proceso.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeEntity === 'nomina' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('nomina')}
        variants={itemVariants}
        transition={{ duration: 0.24 }}
        whileHover={
          shouldReduceMotion
            ? undefined
            : { y: -2, transition: { duration: 0.16 } }
        }
        whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
        layout
      >
        <div className={s.iconWrap}>
          <div className={s.icon}>
            <Database size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Nómina</h2>

            {activeEntity === 'nomina' ? (
              <motion.span
                className={s.stateBadge}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }
                }
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>
            Ejecuta el staging por fileId y visualiza el resultado más reciente.
          </p>
        </div>
      </motion.button>
    </motion.section>
  );
}