
import { RotateCcw, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaMonitoreoToolbar.module.css';

type Props = {
  payPeriodId: string;
  loading: boolean;
  canSubmit: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
};

export default function NominaMonitoreoToolbar({
  payPeriodId,
  loading,
  canSubmit,
  onChange,
  onSubmit,
  onReset,
}: Props) {
  /**
   * Accesibilidad:
   * si el usuario prefiere menos movimiento,
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
        <label className={s.label} htmlFor="nomina-monitoreo-period-id">
          payPeriodId
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={16} className={s.icon} />

            <input
              id="nomina-monitoreo-period-id"
              type="number"
              min="1"
              value={payPeriodId}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Ej. 202601"
            />
          </div>

          <motion.button
            type="button"
            className={s.searchBtn}
            onClick={onSubmit}
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
            {loading ? 'Consultando...' : 'Consultar estado'}
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
          whileTap={!shouldReduceMotion && !loading ? { scale: 0.99 } : undefined}
        >
          <RotateCcw size={16} />
          <span>Limpiar</span>
        </motion.button>
      </div>
    </motion.section>
  );
}