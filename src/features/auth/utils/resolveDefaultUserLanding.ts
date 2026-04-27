import type { SesionMe } from '../model/session.types';

import { safeTrim } from './authInput';

export function resolveDefaultUserLanding(args: {
  sesion: SesionMe | null;
  appCode: string | null;
}): string {
  if (!args.sesion?.userId) return '/login';

  const code = safeTrim(args.appCode).toUpperCase();

  // Aqui decides el primer modulo del usuario.
  if (code === 'PLAT_SERV') return '/usuario/comprobantes-g2g';
  if (code === 'VENTANILLA') return '/usuario/tramite';

  return '/usuario';
}
