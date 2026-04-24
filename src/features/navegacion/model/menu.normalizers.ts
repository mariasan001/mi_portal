import type { MenuItem, MenuResponse } from './menu.types';

function toSafeString(value: unknown, fallback = ''): string {
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }

  return fallback;
}

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (typeof value === 'boolean') return value;
  return undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getArrayFromRecord(
  input: Record<string, unknown>,
  keys: string[]
): unknown[] {
  for (const key of keys) {
    const value = input[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

function normalizarItem(raw: unknown, index = 0): MenuItem | null {
  if (!isRecord(raw)) return null;

  const code =
    toSafeString(raw.code) ||
    toSafeString(raw.key) ||
    toSafeString(raw.id) ||
    `item-${index}`;

  const name =
    toSafeString(raw.name) ||
    toSafeString(raw.label) ||
    toSafeString(raw.title) ||
    'Sin nombre';

  const route =
    toSafeString(raw.route) ||
    toSafeString(raw.path) ||
    toSafeString(raw.href) ||
    '#';

  const icon =
    toSafeString(raw.icon) ||
    toSafeString(raw.iconName) ||
    'CircleHelp';

  const description =
    toSafeString(raw.description) ||
    toSafeString(raw.desc) ||
    undefined;

  const orderIndex =
    toOptionalNumber(raw.orderIndex) ??
    toOptionalNumber(raw.order_index) ??
    toOptionalNumber(raw.order);

  const active =
    toOptionalBoolean(raw.active) ??
    toOptionalBoolean(raw.enabled) ??
    true;

  const rawChildren = getArrayFromRecord(raw, [
    'children',
    'items',
    'subItems',
    'sub_items',
  ]);

  const children = rawChildren
    .map((child, childIndex) => normalizarItem(child, childIndex))
    .filter((item): item is MenuItem => item !== null)
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999));

  return {
    code,
    name,
    route,
    icon,
    description,
    orderIndex,
    active,
    children: children.length ? children : undefined,
  };
}

export function normalizarMenu(raw: unknown): MenuResponse {
  if (!isRecord(raw)) {
    throw new Error('La respuesta del menu no tiene un formato valido.');
  }

  const appCode =
    toSafeString(raw.appCode) ||
    toSafeString(raw.app_code) ||
    toSafeString(raw.code) ||
    '';

  const rawItems = getArrayFromRecord(raw, ['items', 'menu', 'data', 'modules']);

  const items = rawItems
    .map((item, index) => normalizarItem(item, index))
    .filter((item): item is MenuItem => item !== null)
    .filter((item) => item.active !== false)
    .sort((a, b) => (a.orderIndex ?? 9999) - (b.orderIndex ?? 9999));

  return {
    appCode,
    items,
  };
}
