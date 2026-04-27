'use client';

import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

import type { MenuItem } from '../../model/menu.types';
import { itemMatchesPath, safeHref } from '../../model/menu.selectors';
import { renderMenuIcon } from '../../utils/menu.icons';
import s from '../Sidebar.module.css';

type SidebarItemProps = {
  item: MenuItem;
  pathname: string;
  collapsed: boolean;
  level?: number;
  isOpen: (code: string) => boolean;
  toggleOpen: (code: string) => void;
};

const itemVariants = {
  initial: {
    opacity: 0,
    x: -10,
    scale: 0.985,
  },
  enter: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function SidebarItem({
  item,
  pathname,
  collapsed,
  level = 0,
  isOpen,
  toggleOpen,
}: SidebarItemProps) {
  const shouldReduceMotion = useReducedMotion();
  const href = safeHref(item.route);
  const hasChildren = (item.children?.length ?? 0) > 0;

  const isExact = href !== '#' && pathname === href;
  const isActive = itemMatchesPath(item, pathname);
  const autoOpen = hasChildren && itemMatchesPath(item, pathname);
  const open = !collapsed && (autoOpen || isOpen(item.code));

  const iconNode = renderMenuIcon(item.icon, {
    size: 18,
    strokeWidth: 2,
  });

  const handleGroupClick = () => {
    if (hasChildren && !collapsed) {
      toggleOpen(item.code);
    }
  };

  const commonLinkContent = (
    <>
      <motion.span
        className={s.icon}
        whileHover={shouldReduceMotion ? undefined : { scale: 1.06, y: -1 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        {iconNode}
      </motion.span>

      <AnimatePresence initial={false}>
        {!collapsed ? (
          <motion.span
            key="label"
            className={s.label}
            initial={shouldReduceMotion ? false : { opacity: 0, x: -8 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
          >
            {item.name}
          </motion.span>
        ) : null}
      </AnimatePresence>

      {isActive ? (
        <motion.span
          layoutId="sidebar-active-pill"
          className={s.activePill}
          transition={{
            type: 'spring',
            stiffness: 420,
            damping: 34,
          }}
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  return (
    <motion.div
      layout
      variants={itemVariants}
      initial="initial"
      animate="enter"
      className={s.item}
      data-level={level}
      data-collapsed={collapsed ? '1' : '0'}
    >
      <div className={s.row}>
        {href !== '#' ? (
          <motion.div
            layout
            className={s.linkWrap}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { x: 2, transition: { duration: 0.16 } }
            }
            whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
          >
            <Link
              href={href}
              className={`${s.link} ${isActive ? s.active : ''}`}
              aria-current={isExact ? 'page' : undefined}
              title={collapsed ? item.name : undefined}
            >
              {commonLinkContent}
            </Link>
          </motion.div>
        ) : (
          <motion.button
            layout
            type="button"
            className={`${s.link} ${isActive ? s.active : ''}`}
            aria-current={isExact ? 'page' : undefined}
            onClick={handleGroupClick}
            title={collapsed ? item.name : undefined}
            whileHover={
              shouldReduceMotion
                ? undefined
                : { x: 2, transition: { duration: 0.16 } }
            }
            whileTap={shouldReduceMotion ? undefined : { scale: 0.992 }}
          >
            {commonLinkContent}
          </motion.button>
        )}

        {!collapsed && hasChildren ? (
          <motion.button
            layout
            type="button"
            className={s.caret}
            aria-label={open ? 'Contraer submenu' : 'Expandir submenu'}
            aria-expanded={open}
            onClick={() => toggleOpen(item.code)}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
          >
            <motion.span
              className={s.chev}
              animate={shouldReduceMotion ? undefined : { rotate: open ? 45 : -45 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ) : null}
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && hasChildren && open ? (
          <motion.div
            key={`children-${item.code}`}
            layout
            className={s.children}
            initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { height: 'auto', opacity: 1 }}
            exit={shouldReduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
              },
              opacity: {
                duration: 0.18,
              },
            }}
          >
            <motion.div
              className={s.childrenInner}
              initial={shouldReduceMotion ? false : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'show'}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.035,
                    delayChildren: 0.02,
                  },
                },
              }}
            >
              {(item.children ?? []).map((child) => (
                <SidebarItem
                  key={child.code}
                  item={child}
                  pathname={pathname}
                  collapsed={collapsed}
                  level={level + 1}
                  isOpen={isOpen}
                  toggleOpen={toggleOpen}
                />
              ))}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
