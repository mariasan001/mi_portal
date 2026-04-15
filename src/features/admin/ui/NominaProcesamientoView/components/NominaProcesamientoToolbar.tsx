'use client';

import { RotateCcw, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaProcesamientoToolbar.module.css';

type ProcesamientoView = 'summary' | 'preview' | 'errors';

type Props = {
  activeView: ProcesamientoView;
  fileId: string;
  limit: string;
  loading: boolean;
  canSubmit: boolean;
  onFileIdChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onConsult: () => void;
  onReset: () => void;
};

function getLabel(view: ProcesamientoView) {
  if (view === 'summary') return 'Consultar resumen';
  if (view === 'preview') return 'Consultar preview';
  return 'Consultar errores';
}

function getLimitLabel(view: ProcesamientoView) {
  return view === 'errors' ? 'Límite de errores' : 'Límite de preview';
}

export default function NominaProcesamientoToolbar({
  activeView,
  fileId,
  limit,
  loading,
  canSubmit,
  onFileIdChange,
  onLimitChange,
  onConsult,
  onReset,
}: Props) {
  /**
   * Accesibilidad:
   * si el usuario prefiere reducir movimiento,
   * suavizamos o eliminamos animaciones.
   */
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={s.toolbar}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className={s.left}>
        <label className={s.label} htmlFor="nomina-procesamiento-file-id">
          fileId
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={16} className={s.icon} />

            <input
              id="nomina-procesamiento-file-id"
              type="number"
              min="1"
              value={fileId}
              onChange={(e) => onFileIdChange(e.target.value)}
              placeholder="Ej. 40"
            />
          </div>

          {activeView !== 'summary' ? (
            <div className={s.limitWrap}>
              <div className={s.limitInner}>
                <span className={s.limitLabel}>{getLimitLabel(activeView)}</span>

                <input
                  type="number"
                  min="1"
                  value={limit}
                  onChange={(e) => onLimitChange(e.target.value)}
                  placeholder={activeView === 'errors' ? '50' : '20'}
                />
              </div>
            </div>
          ) : null}

          <motion.button
            type="button"
            className={s.searchBtn}
            onClick={onConsult}
            disabled={!canSubmit || loading}
            whileHover={
              !shouldReduceMotion && canSubmit && !loading
                ? { y: -1, transition: { duration: 0.16 } }
                : undefined
            }
            whileTap={
              !shouldReduceMotion && canSubmit && !loading
                ? { scale: 0.99 }
                : undefined
            }
          >
            <Search size={16} />
            <span>{loading ? 'Consultando...' : getLabel(activeView)}</span>
          </motion.button>
        </div>
      </div>

      <div className={s.right}>
        <motion.button
          type="button"
          className={s.resetBtn}
          onClick={onReset}
          disabled={loading}
          whileHover={
            !shouldReduceMotion && !loading
              ? { y: -1, transition: { duration: 0.16 } }
              : undefined
          }
          whileTap={
            !shouldReduceMotion && !loading ? { scale: 0.99 } : undefined
          }
        >
          <RotateCcw size={16} />
          <span>Limpiar</span>
        </motion.button>
      </div>
    </motion.section>
  );
}