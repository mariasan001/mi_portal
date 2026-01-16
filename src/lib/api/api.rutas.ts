/**
 * Rutas internas (Next).
 * La UI SOLO usa esto.
 */
export const API_RUTAS = {
  auth: {
    ping: '/api/auth/ping',
    login: '/api/auth/login',
    me: '/api/auth/me',
  },
  apps: {
    menu: (appCode: string) => `/api/apps/${encodeURIComponent(appCode)}/menu`,
  },
} as const;
