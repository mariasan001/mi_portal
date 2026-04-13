'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import {
  AnimatePresence,
  LayoutGroup,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react';

import type { MenuItem } from '../types/menu.types';
import { renderIcon } from '../utils/menu.iconos';
import s from './Sidebar.module.css';

type SidebarProps = {
  items: MenuItem[];
  defaultCollapsed?: boolean;
  userLabel?: string;
  userName?: string | null;
  onLogout?: () => void;
  onCollapsedChange?: (collapsed: boolean) => void;
};

function isActiveRoute(pathname: string, route: string): boolean {
  const cleanRoute = route.trim();

  if (!cleanRoute) return false;
  if (cleanRoute === '/') return pathname === '/';

  return pathname === cleanRoute || pathname.startsWith(`${cleanRoute}/`);
}

function itemMatchesPath(item: MenuItem, pathname: string): boolean {
  const selfMatches = item.route ? isActiveRoute(pathname, item.route) : false;
  if (selfMatches) return true;

  for (const child of item.children ?? []) {
    if (itemMatchesPath(child, pathname)) return true;
  }

  return false;
}

function safeHref(route?: string): string {
  const cleanRoute = (route ?? '').trim();
  return cleanRoute || '#';
}

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

export function Sidebar({
  items,
  defaultCollapsed = false,
  userLabel = 'Usuario',
  userName,
  onLogout,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  const finalItems = useMemo(() => {
    const maybeRoot = items[0];

    const isRootWrapper =
      items.length === 1 &&
      Boolean(maybeRoot) &&
      (maybeRoot.route ?? '').trim() === '/' &&
      (maybeRoot.children?.length ?? 0) > 0;

    return isRootWrapper ? (maybeRoot.children ?? []) : items;
  }, [items]);

  const displayName = useMemo(() => {
    return (userName ?? '').trim() || 'Usuario';
  }, [userName]);

  const displayInitial = useMemo(() => {
    return displayName.slice(0, 1).toUpperCase() || 'U';
  }, [displayName]);

  const canLogout = typeof onLogout === 'function';

  const isOpen = useCallback(
    (code: string) => Boolean(openMap[code]),
    [openMap]
  );

  const toggleOpen = useCallback((code: string) => {
    setOpenMap((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  }, []);

  const handleToggleCollapsed = useCallback(() => {
    setCollapsed((prev) => !prev);
  }, []);

  function SidebarItem({
    item,
    level = 0,
  }: {
    item: MenuItem;
    level?: number;
  }) {
    const href = safeHref(item.route);
    const hasChildren = (item.children?.length ?? 0) > 0;

    const isExact = href !== '#' && pathname === href;
    const isActive = itemMatchesPath(item, pathname);

    const autoOpen = hasChildren && itemMatchesPath(item, pathname);
    const open = !collapsed && (autoOpen || isOpen(item.code));

    const iconNode = renderIcon(item.icon, {
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
              aria-label={open ? 'Contraer submenú' : 'Expandir submenú'}
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
              initial={
                shouldReduceMotion
                  ? false
                  : { height: 0, opacity: 0 }
              }
              animate={
                shouldReduceMotion
                  ? undefined
                  : { height: 'auto', opacity: 1 }
              }
              exit={
                shouldReduceMotion
                  ? undefined
                  : { height: 0, opacity: 0 }
              }
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
                    level={level + 1}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <motion.aside
          layout
          className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`}
          aria-label="Menú lateral"
          initial={shouldReduceMotion ? false : { opacity: 0, x: -20 }}
          animate={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
          transition={{
            duration: 0.34,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
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
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, x: -10 }
                    }
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 1, x: 0 }
                    }
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 0, x: -10 }
                    }
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
              onClick={handleToggleCollapsed}
              aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
              title={collapsed ? 'Expandir menú' : 'Contraer menú'}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { scale: 1.03, y: -1 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
            >
              <motion.span
                animate={shouldReduceMotion ? undefined : { rotate: collapsed ? 0 : 0 }}
                transition={{ duration: 0.18 }}
              >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </motion.span>
            </motion.button>
          </motion.div>

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
                <span className={s.sectionLabel}>Navegación</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.nav
            layout
            className={s.nav}
            aria-label="Navegación principal"
            variants={sidebarVariants}
            animate={collapsed ? 'collapsed' : 'expanded'}
          >
            {finalItems.map((item) => (
              <SidebarItem key={item.code} item={item} />
            ))}
          </motion.nav>

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
                  canLogout && !shouldReduceMotion
                    ? { y: -1, scale: 1.01 }
                    : undefined
                }
                whileTap={canLogout && !shouldReduceMotion ? { scale: 0.985 } : undefined}
              >
                <motion.span
                  className={s.utilityIcon}
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { rotate: 6, scale: 1.04 }
                  }
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
                  whileHover={
                    shouldReduceMotion
                      ? undefined
                      : { scale: 1.04, rotate: -3 }
                  }
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
        </motion.aside>
      </LayoutGroup>
    </MotionConfig>
  );
}