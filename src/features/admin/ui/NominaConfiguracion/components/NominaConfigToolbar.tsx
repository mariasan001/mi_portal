'use client';

import { Plus, Search } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import s from './NominaConfigToolbar.module.css';

type Props = {
  searchLabel: string;
  searchPlaceholder: string;
  searchButtonLabel: string;
  searchId: string;
  loading: boolean;
  canSearch: boolean;
  onSearchIdChange: (value: string) => void;
  onSearch: () => void;
  onCreate: () => void;
};

export default function NominaConfigToolbar({
  searchLabel,
  searchPlaceholder,
  searchButtonLabel,
  searchId,
  loading,
  canSearch,
  onSearchIdChange,
  onSearch,
  onCreate,
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
        <label className={s.label} htmlFor="nomina-search-id">
          {searchLabel}
        </label>

        <div className={s.searchSurface}>
          <div className={s.inputWrap}>
            <Search size={16} className={s.icon} />

            <input
              id="nomina-search-id"
              type="number"
              min="1"
              value={searchId}
              onChange={(e) => onSearchIdChange(e.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>

          <motion.button
            type="button"
            className={s.searchBtn}
            onClick={onSearch}
            disabled={!canSearch}
            whileHover={
              !shouldReduceMotion && canSearch
                ? { y: -1, transition: { duration: 0.16 } }
                : undefined
            }
            whileTap={
              !shouldReduceMotion && canSearch
                ? { scale: 0.99 }
                : undefined
            }
          >
            {loading ? 'Consultando...' : searchButtonLabel}
          </motion.button>
        </div>
      </div>

      <div className={s.right}>
        <motion.button
          type="button"
          className={s.createBtn}
          onClick={onCreate}
          whileHover={
            !shouldReduceMotion
              ? { y: -1, transition: { duration: 0.16 } }
              : undefined
          }
          whileTap={!shouldReduceMotion ? { scale: 0.99 } : undefined}
        >
          <Plus size={16} />
          <span>Crear nuevo</span>
        </motion.button>
      </div>
    </motion.section>
  );
}