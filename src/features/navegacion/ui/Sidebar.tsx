'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import type { MenuItem } from '../types/menu.types';
import { renderIcon } from '../utils/menu.iconos';

import { ChevronLeft, ChevronRight, Settings, HelpCircle, LogOut } from 'lucide-react';
import s from './Sidebar.module.css';

type SidebarProps = {
  items: MenuItem[];
  defaultCollapsed?: boolean;

  userLabel?: string;
  userName?: string | null;

  onLogout?: () => void;

  /** ✅ Notifica al layout (AdminShell) */
  onCollapsedChange?: (collapsed: boolean) => void;
};

function isActiveRoute(pathname: string, route: string) {
  const r = route.trim();
  if (!r) return false;
  if (r === '/') return pathname === '/';
  return pathname === r || pathname.startsWith(`${r}/`);
}

function itemMatchesPath(item: MenuItem, pathname: string): boolean {
  const self = item.route ? isActiveRoute(pathname, item.route) : false;
  if (self) return true;

  for (const c of item.children ?? []) {
    if (itemMatchesPath(c, pathname)) return true;
  }
  return false;
}

function normalizeIconName(icon: string) {
  return (icon ?? '').trim().toLowerCase();
}

function safeHref(route: string | undefined) {
  const r = (route ?? '').trim();
  return r || '#';
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

  // ✅ 1) Sidebar controla su estado
  const [collapsed, setCollapsed] = useState<boolean>(defaultCollapsed);

  // ✅ 2) Notifica al padre DESPUÉS del render (evita el error)
  useEffect(() => {
    onCollapsedChange?.(collapsed);
  }, [collapsed, onCollapsedChange]);

  // ✅ IAM típico: items = [ROOT] con children reales
  const finalItems = useMemo(() => {
    const maybeRoot = items[0];
    const isRootWrapper =
      items.length === 1 &&
      Boolean(maybeRoot) &&
      (maybeRoot.route ?? '').trim() === '/' &&
      (maybeRoot.children?.length ?? 0) > 0;

    return isRootWrapper ? (maybeRoot.children ?? []) : items;
  }, [items]);

  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  function isOpen(code: string) {
    return Boolean(openMap[code]);
  }

  function toggleOpen(code: string) {
    setOpenMap((prev) => ({ ...prev, [code]: !prev[code] }));
  }

  const displayName = (userName ?? '').trim() || 'Usuario';
  const canLogout = typeof onLogout === 'function';

  function SidebarItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
    const href = safeHref(item.route);
    const isExact = href !== '#' && pathname === href;
    const isActive = href !== '#' && itemMatchesPath(item, pathname);

    const hasChildren = (item.children?.length ?? 0) > 0;
    const autoOpen = hasChildren && itemMatchesPath(item, pathname);
    const open = !collapsed && (autoOpen || isOpen(item.code));

    const iconName = normalizeIconName(item.icon);
    const iconNode = renderIcon(iconName, { size: 18, strokeWidth: 2 });

    return (
      <div className={s.item} data-level={level} data-collapsed={collapsed ? '1' : '0'}>
        <div className={s.row}>
          {href !== '#' ? (
            <Link
              className={`${s.link} ${isActive ? s.active : ''}`}
              href={href}
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
              onClick={() => (hasChildren && !collapsed ? toggleOpen(item.code) : undefined)}
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
              aria-label={open ? 'Contraer' : 'Expandir'}
              aria-expanded={open}
              onClick={() => toggleOpen(item.code)}
            >
              <span className={`${s.chev} ${open ? s.chevOpen : ''}`} />
            </button>
          ) : null}
        </div>

        {!collapsed && hasChildren && open ? (
          <div className={s.children}>
            {(item.children ?? []).map((c) => (
              <SidebarItem key={c.code} item={c} level={level + 1} />
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <aside className={`${s.sidebar} ${collapsed ? s.collapsed : ''}`} aria-label="Menú lateral">
      <div className={s.header}>
        <div className={s.brand}>
          <div className={s.logo} aria-hidden="true" />
        </div>

        <button
          type="button"
          className={s.collapseBtn}
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Expandir menú' : 'Contraer menú'}
          title={collapsed ? 'Expandir' : 'Contraer'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className={s.nav} aria-label="Navegación">
        {finalItems.map((it) => (
          <SidebarItem key={it.code} item={it} />
        ))}
      </nav>

      <div className={s.divider} />

      <div className={s.utility} aria-label="Acciones">
        <Link href="/admin/configuracion" className={s.utilityBtn} title={collapsed ? 'Configuración' : undefined}>
          <span className={s.utilityIcon}><Settings size={18} /></span>
          {!collapsed ? <span className={s.utilityLabel}>Configuración</span> : null}
        </Link>

        <Link href="/admin/soporte" className={s.utilityBtn} title={collapsed ? 'Soporte' : undefined}>
          <span className={s.utilityIcon}><HelpCircle size={18} /></span>
          {!collapsed ? <span className={s.utilityLabel}>Soporte</span> : null}
        </Link>

        <button
          type="button"
          className={`${s.utilityBtn} ${s.utilityDanger}`}
          onClick={() => onLogout?.()}
          disabled={!canLogout}
          title={collapsed ? 'Salir' : undefined}
        >
          <span className={s.utilityIcon}><LogOut size={18} /></span>
          {!collapsed ? <span className={s.utilityLabel}>Salir</span> : null}
        </button>
      </div>

      <div className={s.footer}>
        <div className={s.user}>
          <div className={s.avatar} aria-hidden="true" />
          {!collapsed ? (
            <div className={s.userText}>
              <div className={s.userName}>{displayName}</div>
              <div className={s.userMeta}>{userLabel}</div>
            </div>
          ) : null}
        </div>
      </div>
    </aside>
  );
}