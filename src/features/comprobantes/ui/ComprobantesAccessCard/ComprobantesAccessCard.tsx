'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpLeft, ArrowUpRight } from 'lucide-react';

import type { ComprobanteAccessItem } from '../../constants/comprobantesConstants';
import type { ComprobanteAccessKey } from '../../types/comprobantes.types';

import s from './ComprobantesAccessCard.module.css';
import ComprobanteModuleContent from '../ComprobanteModuleContent.tsx/ComprobanteModuleContent';

type Props = {
  item: ComprobanteAccessItem;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (key: ComprobanteAccessKey) => void;
  onBack: () => void;
};

const shellTransition = {
  type: 'spring' as const,
  stiffness: 165,
  damping: 24,
  mass: 1.04,
};

export default function ComprobantesAccessCard({
  item,
  isSelected,
  isExpanded,
  onSelect,
  onBack,
}: Props) {
  const Icon = item.icon;

  return (
    <motion.article
      layout
      transition={shellTransition}
      className={[
        s.card,
        isSelected ? s.cardSelected : '',
        isExpanded ? s.cardExpanded : '',
      ].join(' ')}
    >
      <motion.div
        layout
        transition={shellTransition}
        className={[
          s.cardShell,
          isSelected ? s.cardShellSelected : '',
          isExpanded ? s.cardShellExpanded : '',
        ].join(' ')}
      >
        <div className={s.cardTop}>
          <div className={s.iconWrap} aria-hidden="true">
            <span className={s.icon}>
              <Icon />
            </span>
          </div>

          <AnimatePresence initial={false}>
            {isExpanded ? (
              <motion.button
                key="back"
                type="button"
                className={s.backBtn}
                onClick={onBack}
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <ArrowUpLeft size={16} />
                <span>Volver</span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div layout="position" className={s.copy}>
          <h2 className={s.cardTitle}>{item.title}</h2>
          <p className={s.cardDesc}>{item.desc}</p>
        </motion.div>

        <AnimatePresence initial={false} mode="wait">
          {!isSelected ? (
            <motion.button
              key="cta"
              type="button"
              className={s.cardCta}
              onClick={() => onSelect(item.key)}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <span>{item.cta}</span>

              <span className={s.ctaArrow} aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="selectedSpacer"
              className={s.selectedSpacer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-content"
              className={s.expandedArea}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{
                height: {
                  duration: 0.28,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.04,
                },
                opacity: {
                  duration: 0.2,
                  delay: 0.08,
                },
              }}
            >
              <motion.div
                className={s.divider}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />

              <motion.div
                className={s.expandedBody}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{
                  duration: 0.24,
                  delay: 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ComprobanteModuleContent moduleKey={item.key} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}