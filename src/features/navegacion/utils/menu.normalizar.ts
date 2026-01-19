import type { MenuItem, MenuResponse } from '../types/menu.types';

type MenuItemRaw = {
  id?: number;
  code?: unknown;
  name?: unknown;
  route?: unknown;
  icon?: unknown;
  children?: unknown;
};

type MenuResponseRaw = {
  appCode?: unknown;
  items?: unknown;
};

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : v == null ? fallback : String(v);
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

function normalizarItem(raw: MenuItemRaw): MenuItem {
  const childrenRaw = asArray<MenuItemRaw>(raw.children);

  return {
    code: asString(raw.code),
    name: asString(raw.name),
    route: asString(raw.route),
    icon: asString(raw.icon).toLowerCase(),
    children: childrenRaw.length ? childrenRaw.map(normalizarItem) : [],
  };
}

export function normalizarMenu(raw: unknown): MenuResponse {
  const r: MenuResponseRaw = isObject(raw) ? (raw as MenuResponseRaw) : {};

  const items = asArray<MenuItemRaw>(r.items).map(normalizarItem);

  // 👇 Si IAM manda un wrapper root, pintamos sus children
  const root = items[0];
  const finalItems = root?.children?.length ? root.children : items;

  return {
    appCode: asString(r.appCode),
    items: finalItems,
  };
}
