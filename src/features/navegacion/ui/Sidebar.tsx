'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import type { MenuItem } from '../types/menu.types';
import {  renderIcon } from '../utils/menu.iconos';

import s from './Sidebar.module.css';

function SidebarItem({ item, level = 0 }: { item: MenuItem; level?: number }) {
  const pathname = usePathname();
  const active = pathname === item.route;

  return (
    <div className={s.item} style={{ paddingLeft: 12 + level * 10 }}>
      <Link className={`${s.link} ${active ? s.active : ''}`} href={item.route}>
     <span className={s.icon}>
  {renderIcon(item.icon, { size: 18, strokeWidth: 2 })}
</span>
        <span className={s.label}>{item.name}</span>
      </Link>

      {item.children?.length ? (
        <div className={s.children}>
          {item.children.map((c) => (
            <SidebarItem key={c.code} item={c} level={level + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function Sidebar({ title, items }: { title: string; items: MenuItem[] }) {
  return (
    <aside className={s.sidebar}>
      <div className={s.header}>
        <div className={s.dot} />
        <div>
          <div className={s.title}>{title}</div>
          <div className={s.subtitle}>Menú dinámico</div>
        </div>
      </div>

      <nav className={s.nav}>
        {items.map((it) => (
          <SidebarItem key={it.code} item={it} />
        ))}
      </nav>
    </aside>
  );
}
