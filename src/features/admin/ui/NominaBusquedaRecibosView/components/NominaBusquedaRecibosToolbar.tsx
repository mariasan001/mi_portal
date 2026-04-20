'use client';

import { Play, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaBusquedaRecibosToolbar.module.css';

type Props = {
  claveSp: string;
  periodCode: string;
  loading: boolean;
  canSearch: boolean;
  onChangeClaveSp: (value: string) => void;
  onChangePeriodCode: (value: string) => void;
  onSearch: () => void;
};

export default function NominaBusquedaRecibosToolbar({
  claveSp,
  periodCode,
  loading,
  canSearch,
  onChangeClaveSp,
  onChangePeriodCode,
  onSearch,
}: Props) {
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
        <div className={s.searchSurface}>
          <label className={s.fieldBlock} htmlFor="nomina-busqueda-clave-sp">
            <span className={s.fieldLabel}>Clave SP</span>

            <div className={s.inputWrap}>
              <Search size={16} className={s.icon} />
              <input
                id="nomina-busqueda-clave-sp"
                value={claveSp}
                onChange={(e) => onChangeClaveSp(e.target.value)}
                placeholder="Ej. ABC12345"
              />
            </div>
          </label>

          <label className={s.fieldBlock} htmlFor="nomina-busqueda-period-code">
            <span className={s.fieldLabel}>Periodo</span>

            <div className={s.inputWrap}>
              <Search size={16} className={s.icon} />
              <input
                id="nomina-busqueda-period-code"
                value={periodCode}
                onChange={(e) => onChangePeriodCode(e.target.value)}
                placeholder="Ej. 2025-06"
              />
            </div>
          </label>

          <motion.button
            type="button"
            className={s.searchBtn}
            onClick={onSearch}
            disabled={!canSearch || loading}
            whileHover={
              !shouldReduceMotion && canSearch && !loading
                ? { y: -1, transition: { duration: 0.16 } }
                : undefined
            }
            whileTap={
              !shouldReduceMotion && canSearch && !loading
                ? { scale: 0.99 }
                : undefined
            }
          >
            <Play size={16} />
            <span>{loading ? 'Consultando...' : 'Buscar recibos'}</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
}
