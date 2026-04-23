
import { CheckCircle2, Inbox, SearchX } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import s from './EmptyState.module.css';

type EmptyStateVariant = 'default' | 'success' | 'search';

type Props = {
  title: string;
  description: string;
  variant?: EmptyStateVariant;
};

export default function EmptyState({
  title,
  description,
  variant = 'default',
}: Props) {
  const shouldReduceMotion = useReducedMotion();

  const iconMap = {
    default: <Inbox size={20} />,
    success: <CheckCircle2 size={20} />,
    search: <SearchX size={20} />,
  };

  return (
    <motion.div
      className={`${s.empty} ${s[variant]}`}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.26,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.div
        className={s.iconWrap}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, delay: 0.05 }}
      >
        {iconMap[variant]}
      </motion.div>

      <div className={s.copy}>
        <motion.h3
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.08 }}
        >
          {title}
        </motion.h3>

        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.12 }}
        >
          {description}
        </motion.p>
      </div>
    </motion.div>
  );
}