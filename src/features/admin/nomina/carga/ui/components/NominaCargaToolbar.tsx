

import { Plus, Play, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './NominaCargaToolbar.module.css';
import {
  getToolbarPrimaryLabel,
  getToolbarSearchLabel,
  getToolbarSearchPlaceholder,
} from '../utils/nomina-cargas.utils';
import { NominaCargaEntity } from '../types/nomina-cargas.types';

type Props = {
  activeEntity: NominaCargaEntity;
  searchFileId: string;
  loading: boolean;
  canExecute: boolean;
  onSearchFileIdChange: (value: string) => void;
  onExecute: () => void;
  onPrimaryAction: () => void;
};

export default function NominaCargaToolbar({
  activeEntity,
  searchFileId,
  loading,
  canExecute,
  onSearchFileIdChange,
  onExecute,
  onPrimaryAction,
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
        <label className={s.label} htmlFor="nomina-carga-search-id">
          {getToolbarSearchLabel(activeEntity)}
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={16} className={s.icon} />

            <input
              id="nomina-carga-search-id"
              type="number"
              min="1"
              value={searchFileId}
              onChange={(e) => onSearchFileIdChange(e.target.value)}
              placeholder={getToolbarSearchPlaceholder(activeEntity)}
            />
          </div>

          <motion.button
            type="button"
            className={s.executeBtn}
            disabled={!canExecute || loading}
            onClick={onExecute}
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
            <span>{loading ? 'Ejecutando...' : 'Ejecutar'}</span>
          </motion.button>
        </div>
      </div>

      <div className={s.right}>
        <motion.button
          type="button"
          className={s.createBtn}
          onClick={onPrimaryAction}
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
          <Plus size={16} />
          <span>{getToolbarPrimaryLabel(activeEntity)}</span>
        </motion.button>
      </div>
    </motion.section>
  );
}