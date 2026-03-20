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

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

const shellTransition = {
  type: 'spring' as const,
  stiffness: 165,
  damping: 24,
  mass: 1.04,
};

const backButtonMotion = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -4, scale: 0.98 },
  transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const },
};

const ctaMotion = {
  initial: { opacity: 0, y: 4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] as const },
};

const spacerMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.12 },
};

const expandedAreaMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' as const },
  exit: { opacity: 0, height: 0 },
  transition: {
    height: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.04,
    },
    opacity: {
      duration: 0.2,
      delay: 0.08,
    },
  },
};

const dividerMotion = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

const expandedBodyMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 6 },
  transition: {
    duration: 0.24,
    delay: 0.1,
    ease: [0.22, 1, 0.36, 1] as const,
  },
};

export default function ComprobantesAccessCard({
  item,
  isSelected,
  isExpanded,
  onSelect,
  onBack,
}: Props) {
  const {
    icon: Icon,
    title,
    desc,
    cta,
    key: moduleKey,
  } = item;

  const handleSelect = () => {
    onSelect(moduleKey);
  };

  return (
    <motion.article
      layout
      transition={shellTransition}
      className={cx(
        s.card,
        isSelected && s.cardSelected,
        isExpanded && s.cardExpanded
      )}
    >
      <motion.div
        layout
        transition={shellTransition}
        className={cx(
          s.cardShell,
          isSelected && s.cardShellSelected,
          isExpanded && s.cardShellExpanded
        )}
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
                initial={backButtonMotion.initial}
                animate={backButtonMotion.animate}
                exit={backButtonMotion.exit}
                transition={backButtonMotion.transition}
              >
                <ArrowUpLeft size={16} />
                <span>Volver</span>
              </motion.button>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.div layout="position" className={s.copy}>
          <h2 className={s.cardTitle}>{title}</h2>
          <p className={s.cardDesc}>{desc}</p>
        </motion.div>

        <AnimatePresence initial={false} mode="wait">
          {!isSelected ? (
            <motion.button
              key="cta"
              type="button"
              className={s.cardCta}
              onClick={handleSelect}
              initial={ctaMotion.initial}
              animate={ctaMotion.animate}
              exit={ctaMotion.exit}
              transition={ctaMotion.transition}
            >
              <span>{cta}</span>

              <span className={s.ctaArrow} aria-hidden="true">
                <ArrowUpRight size={16} />
              </span>
            </motion.button>
          ) : (
            /**
             * Este espacio mantiene estabilidad visual cuando el CTA desaparece
             * y la tarjeta pasa a estado seleccionado/expandido.
             */
            <motion.div
              key="selectedSpacer"
              className={s.selectedSpacer}
              initial={spacerMotion.initial}
              animate={spacerMotion.animate}
              exit={spacerMotion.exit}
              transition={spacerMotion.transition}
            />
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="expanded-content"
              className={s.expandedArea}
              initial={expandedAreaMotion.initial}
              animate={expandedAreaMotion.animate}
              exit={expandedAreaMotion.exit}
              transition={expandedAreaMotion.transition}
            >
              <motion.div
                className={s.divider}
                initial={dividerMotion.initial}
                animate={dividerMotion.animate}
                exit={dividerMotion.exit}
                transition={dividerMotion.transition}
              />

              <motion.div
                className={s.expandedBody}
                initial={expandedBodyMotion.initial}
                animate={expandedBodyMotion.animate}
                exit={expandedBodyMotion.exit}
                transition={expandedBodyMotion.transition}
              >
                <ComprobanteModuleContent moduleKey={moduleKey} />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}