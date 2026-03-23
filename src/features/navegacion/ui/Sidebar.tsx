'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  LogOut,
  Settings,
} from 'lucide-react';

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

export function Sidebar({
  items,
  defaultCollapsed = false,
  userLabel = 'Usuario',
  userName,
  onLogout,
  onCollapsedChange,
}: SidebarProps) {
  const pathname = usePathname();

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

    return (
      <div
        className={s.item}
        data-level={level}
        data-collapsed={collapsed ? '1' : '0'}
      >
        <div className={s.row}>
          {href !== '#' ? (
            <Link
              href={href}
              className={`${s.link} ${isActive ? s.active : ''}`}
              aria-current={isExact ? 'page' : undefined}
              title={collapsed ? item.name : undefined}
            >
              <span className={s.icon}>{iconNode}</span>
              {!collapsed ? <span className={s.label}>{item.name}</span> : null}
            </Link>
          ) : (
            <button
              type="button"
              className={`${s.link} ${isActive ? s.active : ''}`}
              aria-current={isExact ? 'page' : undefined}
              onClick={handleGroupClick}
              title={collapsed ? item.name : undefined}
            >
              <span className={s.icon}>{iconNode}</span>
              {!collapsed ? <span className={s.label}>{item.name}</span> : null}
            </button>
          )}

          {!collapsed && hasChildren ? (
            <button
              type="button"
              className={s.caret}
              aria-label={open ? 'Contraer submenú' : 'Expandir submenú'}
              aria-expanded={open}
              onClick={() => toggleOpen(item.code)}
            >
              <span className={`${s.chev} ${open ? s.chevOpen : ''}`} />
            </button>
          ) : null}
        </div>

        {!collapsed && hasChildren && open ? (
          <div className={s.children}>
            {(item.children ?? []).map((child) => (
              <SidebarItem
                key={child.code}
                item={child}
                level={level + 1}
              />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside
      className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`}
      aria-label="Menú lateral"
    >
      <div className={s.header}>
        <div className={s.brand}>
          <div className={s.logo} aria-hidden="true" />

          {!collapsed ? (
            <div className={s.brandText}>
              <span className={s.brandEyebrow}>Panel administrativo</span>
              <strong className={s.brandTitle}>Portal de servicios</strong>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={s.collapseBtn}
          onClick={handleToggleCollapsed}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          title={collapsed ? 'Expandir menú' : 'Contraer menú'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {!collapsed ? (
        <div className={s.sectionHeader}>
          <span className={s.sectionLabel}>Navegación</span>
        </div>
      ) : null}

      <nav className={s.nav} aria-label="Navegación principal">
        {finalItems.map((item) => (
          <SidebarItem key={item.code} item={item} />
        ))}
      </nav>

      <div className={s.divider} />

      <div className={s.utilityWrap}>
        {!collapsed ? (
          <div className={s.sectionHeaderAlt}>
            <span className={s.sectionLabel}>Acciones</span>
          </div>
        ) : null}

        <div className={s.utility} aria-label="Acciones secundarias">
        

          <Link
            href="/admin/soporte"
            className={s.utilityBtn}
            title={collapsed ? 'Soporte' : undefined}
          >
            <span className={s.utilityIcon}>
              <HelpCircle size={18} />
            </span>
            {!collapsed ? <span className={s.utilityLabel}>Soporte</span> : null}
          </Link>
          <button
            type="button"
            className={`${s.utilityBtn} ${s.logoutBtn}`}
            onClick={() => onLogout?.()}
            disabled={!canLogout}
            title={collapsed ? 'Salir' : undefined}
          >
            <span className={s.utilityIcon}>
              <LogOut size={18} />
            </span>
            {!collapsed ? <span className={s.utilityLabel}>Salir</span> : null}
          </button>    
        </div>
      </div>

      <div className={s.footer}>
        <div className={s.userCard}>
          <div className={s.user}>
            <div className={s.avatar} aria-hidden="true">
              <span>{displayInitial}</span>
            </div>

            {!collapsed ? (
              <div className={s.userText}>
                <div className={s.userName}>{displayName}</div>
                <div className={s.userMeta}>{userLabel}</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </aside>
  );
}