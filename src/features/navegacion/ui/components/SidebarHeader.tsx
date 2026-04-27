'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import s from '../Sidebar.module.css';

type SidebarHeaderProps = {
  collapsed: boolean;
  shouldReduceMotion: boolean;
  onToggleCollapsed: () => void;
};

export function SidebarHeader({
  collapsed,
  shouldReduceMotion,
  onToggleCollapsed,
}: SidebarHeaderProps) {
  return (
    <motion.div layout className={s.header}>
      <motion.div
        layout
        className={s.brand}
        initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.26, delay: 0.04 }}
      >
        <motion.div
          className={s.logo}
          aria-hidden="true"
          whileHover={
            shouldReduceMotion
              ? undefined
              : {
                  scale: 1.03,
                  rotate: -1.5,
                  transition: { duration: 0.18 },
                }
          }
        />

        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="brandText"
              layout
              className={s.brandText}
              initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            >
              <span className={s.brandEyebrow}>Panel administrativo</span>
              <strong className={s.brandTitle}>Portal de servicios</strong>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      <motion.button
        layout
        type="button"
        className={s.collapseBtn}
        onClick={onToggleCollapsed}
        aria-label={collapsed ? 'Expandir menu' : 'Contraer menu'}
        title={collapsed ? 'Expandir menu' : 'Contraer menu'}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.03, y: -1 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </motion.button>
    </motion.div>
  );
}
