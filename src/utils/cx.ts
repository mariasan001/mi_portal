// src/lib/utils/cx.ts

/**
 * cx()
 * Utilidad mínima para componer className sin librerías.
 *
 * ✅ Por qué existe:
 * - Evita ternarios/joins feos en JSX.
 * - Reemplaza `clsx`/`classnames` si no quieres sumar dependencias.
 *
 * ✅ Cómo se usa:
 * cx('base', isActive && 'active', isDark ? 'dark' : 'light')
 * -> devuelve un string con las clases "truthy" separadas por espacio.
 *
 * ✅ Tipos:
 * - Acepta strings y falsy (false/null/undefined).
 * - Filtra lo falsy automáticamente.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}