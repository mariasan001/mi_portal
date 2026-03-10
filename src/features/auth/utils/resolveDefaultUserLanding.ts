// src/features/auth/utils/resolveDefaultUserLanding.ts
import type { SesionMe } from '../types/me.types';

function safeTrim(v: string | null | undefined) {
  return (v ?? '').trim();
}

export function resolveDefaultUserLanding(args: {
  sesion: SesionMe | null;
  appCode: string | null;
}): string {
  // seguridad
  if (!args.sesion?.userId) return '/login';

  const code = safeTrim(args.appCode).toUpperCase();

  // 👇 aquí decides el "primer módulo" del usuario
  if (code === 'PLAT_SERV') return '/usuario/comprobantes-g2g';
  if (code === 'VENTANILLA') return '/usuario/tramite';

  // fallback
  return '/usuario';
}