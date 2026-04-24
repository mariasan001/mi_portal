import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

import { cx } from '@/utils/cx';
import s from './NominaOptionCards.module.css';

type NominaOptionCard<T extends string> = {
  value: T;
  title: string;
  description: string;
  icon: LucideIcon;
};

type Props<T extends string> = {
  activeValue: T;
  columns?: 2 | 3;
  onSelect: (value: T) => void;
  options: readonly NominaOptionCard<T>[];
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function NominaOptionCards<T extends string>({
  activeValue,
  columns = 2,
  onSelect,
  options,
}: Props<T>) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={cx(s.grid, columns === 3 && s.gridThree)}
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
      {options.map((option) => {
        const Icon = option.icon;
        const isActive = option.value === activeValue;

        return (
          <motion.button
            key={option.value}
            type="button"
            className={cx(s.card, isActive ? s.active : s.inactive)}
            onClick={() => onSelect(option.value)}
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
                <Icon size={18} />
              </div>
            </div>

            <div className={s.body}>
              <div className={s.headRow}>
                <h2>{option.title}</h2>

                {isActive ? (
                  <motion.span
                    className={s.stateBadge}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }
                    }
                    animate={
                      shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }
                    }
                    transition={{ duration: 0.18 }}
                  >
                    Activo
                  </motion.span>
                ) : null}
              </div>

              <p>{option.description}</p>
            </div>
          </motion.button>
        );
      })}
    </motion.section>
  );
}
