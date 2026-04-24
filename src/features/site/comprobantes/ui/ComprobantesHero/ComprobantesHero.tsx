'use client';

import { AnimatePresence, motion } from 'framer-motion';

import { useRevealMotion } from '@/hooks/useRevealMotion';
import s from './ComprobantesHero.module.css';

type Props = {
  title: string;
  accent: string;
  subtitleStrong: string;
  subtitle: string;
  contentKey?: string;
};

const heroContentVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.34,
      ease: [0.22, 1, 0.36, 1] as const,
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.995,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

const heroTextItemVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1] as const,
    },
  },
};

export default function ComprobantesHero({
  title,
  accent,
  subtitleStrong,
  subtitle,
  contentKey,
}: Props) {
  const { ref, className } = useRevealMotion<HTMLElement>({
    threshold: 0.2,
    thresholdPx: 8,
  });

  const resolvedContentKey =
    contentKey ?? `${title}-${accent}-${subtitleStrong}-${subtitle}`;

  return (
    <header ref={ref} className={className(s.head, s.isIn, s.dirDown, s.dirUp)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={resolvedContentKey}
          className={s.copy}
          variants={heroContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h1 className={s.title} variants={heroTextItemVariants}>
            {title} <span className={s.titleAccent}>{accent}</span>
          </motion.h1>

          <motion.p className={s.subtitleStrong} variants={heroTextItemVariants}>
            {subtitleStrong}
          </motion.p>

          <motion.p className={s.subtitle} variants={heroTextItemVariants}>
            {subtitle}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </header>
  );
}
