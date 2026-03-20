export const API_RUTAS = {
  auth: {
    ping: '/api/auth/ping',
    login: '/api/auth/login',
    me: '/api/auth/me',
    register: '/api/auth/register',
  },
  password: {
    forgot: '/api/auth/password/forgot',
    reset: '/api/auth/password/reset',
  },
  otp: {
    verify: '/api/auth/otp/verify',
  },
  apps: {
    menu: (appCode: string) => `/api/apps/${encodeURIComponent(appCode)}/menu`,
  },
  nomina: {
    periodos: '/api/admin/nomina/periodos',
    periodoDetalle: (periodId: number | string) =>
      `/api/admin/nomina/periodos/${encodeURIComponent(String(periodId))}`,

    versiones: '/api/admin/nomina/versiones',
    versionDetalle: (versionId: number | string) =>
      `/api/admin/nomina/versiones/${encodeURIComponent(String(versionId))}`,

    uploadArchivo: '/api/admin/nomina/files/upload',
    ejecutarCatalogo: (fileId: number | string) =>
      `/api/admin/nomina/catalog/jobs/run/${encodeURIComponent(String(fileId))}`,

    ejecutarPayrollStaging: (fileId: number | string) =>
      `/api/admin/nomina/payroll/jobs/run/${encodeURIComponent(String(fileId))}`,
  },
} as const;