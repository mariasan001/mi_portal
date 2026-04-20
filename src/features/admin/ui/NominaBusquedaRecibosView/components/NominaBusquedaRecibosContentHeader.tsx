'use client';

import { motion, useReducedMotion } from 'motion/react';

import type { NominaBusquedaRecibosSummaryItem } from '../types/nomina-busqueda-recibos-view.types';
import s from './NominaBusquedaRecibosContentHeader.module.css';

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  summaryItems?: NominaBusquedaRecibosSummaryItem[];
  showSummary?: boolean;
};

export default function NominaBusquedaRecibosContentHeader({
  eyebrow,
  title,
  description,
  summaryItems = [],
  showSummary = false,
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className={s.wrapper}>
      <motion.div
        className={s.header}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.24,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div className={s.copy}>
          <motion.span
            className={s.eyebrow}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            transition={{ duration: 0.18, delay: 0.04 }}
          >
            {eyebrow}
          </motion.span>

          <motion.h3
            className={s.title}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.08 }}
          >
            {title}
          </motion.h3>

          {description ? (
            <motion.p
              className={s.description}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.12 }}
            >
              {description}
            </motion.p>
          ) : null}
        </div>
      </motion.div>

      {showSummary && summaryItems.length ? (
        <motion.div
          className={s.summaryBlock}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.08 }}
        >
          <div className={s.summaryGrid}>
            {summaryItems.map((item) => (
              <div className={s.summaryItem} key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
