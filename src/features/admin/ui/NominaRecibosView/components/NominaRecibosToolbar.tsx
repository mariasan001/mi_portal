
import { Play, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { NominaRecibosAction } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosToolbar.module.css';

type Props = {
  activeAction: NominaRecibosAction;
  versionId: string;
  loading: boolean;
  canExecute: boolean;
  onChangeVersionId: (value: string) => void;
  onExecute: () => void;
};

function getButtonLabel(action: NominaRecibosAction, loading: boolean): string {
  if (action === 'snapshots') {
    return loading ? 'Generando...' : 'Generar snapshots';
  }

  if (action === 'recibos') {
    return loading ? 'Generando...' : 'Generar recibos';
  }

  if (action === 'sincronizacion') {
    return loading ? 'Sincronizando...' : 'Ejecutar sincronización';
  }

  return loading ? 'Procesando...' : 'Ejecutar';
}

export default function NominaRecibosToolbar({
  activeAction,
  versionId,
  loading,
  canExecute,
  onChangeVersionId,
  onExecute,
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
        <label className={s.label} htmlFor="nomina-recibos-version-id">
          versionId
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={16} className={s.icon} />

            <input
              id="nomina-recibos-version-id"
              type="number"
              min="1"
              value={versionId}
              onChange={(e) => onChangeVersionId(e.target.value)}
              placeholder="Ej. 125"
            />
          </div>

          <motion.button
            type="button"
            className={s.searchBtn}
            onClick={onExecute}
            disabled={!canExecute || loading}
            whileHover={
              !shouldReduceMotion && canExecute && !loading
                ? { y: -1, transition: { duration: 0.16 } }
                : undefined
            }
            whileTap={
              !shouldReduceMotion && canExecute && !loading
                ? { scale: 0.99 }
                : undefined
            }
          >
            <Play size={16} />
            <span>{getButtonLabel(activeAction, loading)}</span>
          </motion.button>
        </div>
      </div>
    </motion.section>
  );
} 