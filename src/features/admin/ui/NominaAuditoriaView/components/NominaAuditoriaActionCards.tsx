'use client';

import { Ban, ShieldCheck } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { NominaAuditoriaAction } from '../types/nomina-auditoria-view.types';
import s from './NominaAuditoriaActionCards.module.css';

type Props = {
  activeAction: NominaAuditoriaAction;
  onSelect: (value: NominaAuditoriaAction) => void;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaAuditoriaActionCards({
  activeAction,
  onSelect,
}: Props) {
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
          activeAction === 'liberaciones' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('liberaciones')}
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
            <ShieldCheck size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Liberaciones</h2>

            {activeAction === 'liberaciones' ? (
              <motion.span
                className={s.stateBadge}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>Consulta la bitacora administrativa por version, periodo o etapa.</p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeAction === 'cancelaciones' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('cancelaciones')}
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
            <Ban size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Cancelaciones</h2>

            {activeAction === 'cancelaciones' ? (
              <motion.span
                className={s.stateBadge}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.18 }}
              >
                Activo
              </motion.span>
            ) : null}
          </div>

          <p>Consulta la bitacora por recibo, periodos o llave de negocio.</p>
        </div>
      </motion.button>
    </motion.section>
  );
}
