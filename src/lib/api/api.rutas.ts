// src/lib/api/api.rutas.ts
export const API_RUTAS = {
  auth: {
    ping: '/api/auth/ping',
    login: '/api/auth/login',
    me: '/api/auth/me',
    register: '/api/auth/register', 
  },
  apps: {
    menu: (appCode: string) => `/api/apps/${encodeURIComponent(appCode)}/menu`,
  },
} as const;