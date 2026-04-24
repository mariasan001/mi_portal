'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react';

import type { MenuItem } from '../model/menu.types';
import { unwrapRootMenuItems } from '../model/menu.selectors';
import { SidebarFooter } from './components/SidebarFooter';
import { SidebarHeader } from './components/SidebarHeader';
import { SidebarItem } from './components/SidebarItem';
import s from './Sidebar.module.css';

type SidebarProps = {
  items: MenuItem[];
  defaultCollapsed?: boolean;
  userLabel?: string;
  userName?: string | null;
  onLogout?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
};

const sidebarVariants = {
  expanded: {
    transition: {
      staggerChildren: 0.035,
      delayChildren: 0.04,
    },
  },
  collapsed: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1 as const,
    },
  },
};

export function Sidebar({
  items,
  defaultCollapsed = false,
  userLabel = 'Usuario',
  userName,
  onLogout,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceMotion = prefersReducedMotion ?? false;

  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const finalItems = useMemo(() => unwrapRootMenuItems(items), [items]);

  const displayName = useMemo(() => {
    return (userName ?? '').trim() || 'Usuario';
  }, [userName]);

  const displayInitial = useMemo(() => {
    return displayName.slice(0, 1).toUpperCase() || 'U';
  }, [displayName]);

  const canLogout = typeof onLogout === 'function';

  const isOpen = useCallback(
    (code: string) => Boolean(expandedGroups[code]),
    [expandedGroups]
  );

  const toggleOpen = useCallback((code: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  }, []);

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <motion.aside
          layout
          className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`}
          aria-label="Menu lateral"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <SidebarHeader
            collapsed={collapsed}
            shouldReduceMotion={shouldReduceMotion}
            onToggleCollapsed={handleToggleCollapsed}
          />

          <AnimatePresence initial={false}>
            {!collapsed ? (
              <motion.div
                key="nav-header"
                layout
                className={s.sectionHeader}
                initial={shouldReduceMotion ? false : { opacity: 0, y: -6 }}
                animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.16 }}
              >
                <span className={s.sectionLabel}>Navegacion</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.nav
            layout
            className={s.nav}
            aria-label="Navegacion principal"
            variants={sidebarVariants}
            animate={collapsed ? 'collapsed' : 'expanded'}
          >
            {finalItems.map((item) => (
              <SidebarItem
                key={item.code}
                item={item}
                pathname={pathname}
                collapsed={collapsed}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
              />
            ))}
          </motion.nav>

          <SidebarFooter
            collapsed={collapsed}
            canLogout={canLogout}
            displayInitial={displayInitial}
            displayName={displayName}
            userLabel={userLabel}
            shouldReduceMotion={shouldReduceMotion}
            onLogout={onLogout}
          />
        </motion.aside>
      </LayoutGroup>
    </MotionConfig>
  );
}
