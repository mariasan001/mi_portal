'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { MenuItem } from '../types/menu.types';
import { renderIcon } from '../utils/menu.iconos';

import s from './Sidebar.module.css';

type SidebarProps = {
  title?: string;
  items: MenuItem[];
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

  const children = item.children ?? [];
  for (const c of children) {
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

function SidebarItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const pathname = usePathname();

  const href = safeHref(item.route);
  const isExact = href !== '#' && pathname === href;
  const isActive = href !== '#' && itemMatchesPath(item, pathname);

  const hasChildren = (item.children?.length ?? 0) > 0;

  return (
    <div className={s.item} style={{ paddingLeft: 12 + level * 10 }}>
      {href !== '#' ? (
        <Link
          className={`${s.link} ${isActive ? s.active : ''}`}
          href={href}
          aria-current={isExact ? 'page' : undefined}
        >
          <span className={s.icon}>
            {renderIcon(normalizeIconName(item.icon), { size: 18, strokeWidth: 2 })}
          </span>
          <span className={s.label}>{item.name}</span>
        </Link>
      ) : (
        <div className={`${s.link} ${isActive ? s.active : ''}`} aria-current={isExact ? 'page' : undefined}>
          <span className={s.icon}>
            {renderIcon(normalizeIconName(item.icon), { size: 18, strokeWidth: 2 })}
          </span>
          <span className={s.label}>{item.name}</span>
        </div>
      )}

      {hasChildren ? (
        <div className={s.children}>
          {(item.children ?? []).map((c) => (
            <SidebarItem key={c.code} item={c} level={level + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({ title, items }: SidebarProps) {
  // ✅ Caso IAM típico: items = [ROOT] y el menú real está en ROOT.children
  const maybeRoot = items[0];
  const isRootWrapper =
    items.length === 1 &&
    Boolean(maybeRoot) &&
    (maybeRoot.route ?? '').trim() === '/' &&
    (maybeRoot.children?.length ?? 0) > 0;

  const finalTitle =
    (title ?? '').trim() ||
    (isRootWrapper ? (maybeRoot.name ?? '').trim() : '') ||
    'Menú';

  const finalItems = isRootWrapper ? (maybeRoot.children ?? []) : items;

  return (
    <aside className={s.sidebar}>
      <div className={s.header}>
        <div className={s.dot} />
        <div>
          <div className={s.title}>{finalTitle}</div>
          <div className={s.subtitle}>Menú dinámico</div>
        </div>
      </div>

      <nav className={s.nav} aria-label="Menú lateral">
        {finalItems.map((it) => (
          <SidebarItem key={it.code} item={it} />
        ))}
      </nav>
    </aside>
  );
}
