'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { COMPROBANTES_ACCESS_ITEMS } from '../../constants/comprobantesConstants';
import type { ComprobanteAccessKey } from '../../types/comprobantes.types';

import ComprobantesAccessCard from '../ComprobantesAccessCard/ComprobantesAccessCard';
import s from './ComprobantesAccessGrid.module.css';

type TransitionPhase = 'idle' | 'collapsing' | 'expanded';

type Props = {
  selectedKey: ComprobanteAccessKey | null;
  phase: TransitionPhase;
  onSelect: (key: ComprobanteAccessKey) => void;
  onBack: () => void;
};

const cardPresence = {
  hidden: { opacity: 0, y: 14, scale: 0.992 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      delay: index * 0.05,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.985,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export default function ComprobantesAccessGrid({
  selectedKey,
  phase,
  onSelect,
  onBack,
}: Props) {
  const isExpanded = phase === 'expanded';

  return (
    <motion.div
      layout
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={s.grid}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {COMPROBANTES_ACCESS_ITEMS.map((item, index) => {
          const isSelected = selectedKey === item.key;
          const shouldRender = selectedKey === null || isSelected;
          if (!shouldRender) {
            return null;
          }
          
          return (
            <motion.div
              key={item.key}
              layout
              custom={index}
              variants={cardPresence}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{
                layout: {
                  duration: isExpanded ? 0.34 : 0.22,
                  ease: [0.22, 1, 0.36, 1],
                },
              }}
              className={[
                s.item,
                isSelected ? s.itemSelected : '',
                isSelected && isExpanded ? s.itemExpanded : '',
              ].join(' ')}
            >
              <ComprobantesAccessCard
                item={item}
                isSelected={isSelected}
                isExpanded={isSelected && isExpanded}
                onSelect={onSelect}
                onBack={onBack}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}