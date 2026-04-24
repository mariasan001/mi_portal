'use client';

import { LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import s from '../Sidebar.module.css';

type SidebarFooterProps = {
  collapsed: boolean;
  canLogout: boolean;
  displayInitial: string;
  displayName: string;
  userLabel: string;
  shouldReduceMotion: boolean;
  onLogout?: () => void;
};

export function SidebarFooter({
  collapsed,
  canLogout,
  displayInitial,
  displayName,
  userLabel,
  shouldReduceMotion,
  onLogout,
}: SidebarFooterProps) {
  return (
    <>
      <motion.div layout className={s.divider} />

      <motion.div layout className={s.utilityWrap}>
        <AnimatePresence initial={false}>
          {!collapsed ? (
            <motion.div
              key="actions-header"
              layout
              className={s.sectionHeaderAlt}
              initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
              animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              <span className={s.sectionLabel}>Acciones</span>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={s.utility} aria-label="Acciones secundarias">
          <motion.button
            layout
            type="button"
            className={`${s.utilityBtn} ${s.logoutBtn}`}
            onClick={() => onLogout?.()}
            disabled={!canLogout}
            title={collapsed ? 'Salir' : undefined}
            whileHover={
              canLogout && !shouldReduceMotion ? { y: -1, scale: 1.01 } : undefined
            }
            whileTap={canLogout && !shouldReduceMotion ? { scale: 0.985 } : undefined}
          >
            <motion.span
              className={s.utilityIcon}
              whileHover={shouldReduceMotion ? undefined : { rotate: 6, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            >
              <LogOut size={18} />
            </motion.span>

            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.span
                  key="logout-label"
                  className={s.utilityLabel}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  Salir
                </motion.span>
              ) : null}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      <motion.div layout className={s.footer}>
        <motion.div layout className={s.userCard}>
          <motion.div
            layout
            className={s.user}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.24, delay: 0.06 }}
          >
            <motion.div
              className={s.avatar}
              aria-hidden="true"
              whileHover={shouldReduceMotion ? undefined : { scale: 1.04, rotate: -3 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              <span>{displayInitial}</span>
            </motion.div>

            <AnimatePresence initial={false}>
              {!collapsed ? (
                <motion.div
                  key="userText"
                  layout
                  className={s.userText}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
                  transition={{ duration: 0.16 }}
                >
                  <div className={s.userName}>{displayName}</div>
                  <div className={s.userMeta}>{userLabel}</div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
