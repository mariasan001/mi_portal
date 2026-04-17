'use client';

import { FileStack, ReceiptText, RefreshCw } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import type { NominaRecibosAction } from '../types/nomina-recibos-view.types';
import s from './NominaRecibosActionCards.module.css';

type Props = {
  activeAction: NominaRecibosAction;
  onSelect: (action: NominaRecibosAction) => void;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaRecibosActionCards({
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
          activeAction === 'snapshots' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('snapshots')}
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
            <FileStack size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Snapshots</h2>

            {activeAction === 'snapshots' ? (
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
            Genera snapshots consolidados desde staging para la versión
            seleccionada.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeAction === 'recibos' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('recibos')}
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
            <ReceiptText size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Recibos</h2>

            {activeAction === 'recibos' ? (
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
            Construye recibos y su detalle asociado a partir de snapshots
            previamente generados.
          </p>
        </div>
      </motion.button>

      <motion.button
        type="button"
        className={`${s.card} ${
          activeAction === 'sincronizacion' ? s.active : s.inactive
        }`}
        onClick={() => onSelect('sincronizacion')}
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
            <RefreshCw size={18} />
          </div>
        </div>

        <div className={s.body}>
          <div className={s.headRow}>
            <h2>Sincronización</h2>

            {activeAction === 'sincronizacion' ? (
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
            Ejecuta la sincronización complementaria a core para la versión
            vigente.
          </p>
        </div>
      </motion.button>
    </motion.section>
  );
}