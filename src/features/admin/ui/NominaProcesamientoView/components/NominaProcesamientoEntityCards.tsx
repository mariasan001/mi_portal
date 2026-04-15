'use client';

import { AlertTriangle, BarChart3, Eye } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaProcesamientoEntityCards.module.css';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  onSelect: (view: ProcesamientoView) => void;
};

/**
 * Variantes simples para entrada escalonada.
 * Mantienen consistencia con otros bloques del módulo.
 */
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaProcesamientoEntityCards({
  activeView,
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
          activeView === 'summary' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('summary')}
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
            <BarChart3 size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Resumen</h2>

            {activeView === 'summary' ? (
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
            Consulta métricas generales del archivo procesado, estatus y conteos
            principales.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeView === 'preview' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('preview')}
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
            <Eye size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Preview</h2>

            {activeView === 'preview' ? (
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
            Revisa una muestra de filas procesadas para validar la información
            operativa del archivo.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeView === 'errors' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('errors')}
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
            <AlertTriangle size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Errores</h2>

            {activeView === 'errors' ? (
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
            Consulta filas con incidencias detectadas durante el procesamiento
            para revisar el motivo del error.
          </p>
        </div>
      </motion.button>
    </motion.section>
  );
}