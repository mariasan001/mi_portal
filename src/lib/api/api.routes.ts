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
    periods: '/api/admin/nomina/periods',
    periodDetalle: (periodId: number | string) =>
      `/api/admin/nomina/periods/${encodeURIComponent(String(periodId))}`,

    versiones: '/api/admin/nomina/versiones',
    versionDetalle: (versionId: number | string) =>
      `/api/admin/nomina/versiones/${encodeURIComponent(String(versionId))}`,

    uploadArchivo: '/api/admin/nomina/files/upload',

    ejecutarCatalogo: (fileId: number | string) =>
      `/api/admin/nomina/catalog/jobs/run/${encodeURIComponent(String(fileId))}`,

    ejecutarPayrollStaging: (fileId: number | string) =>
      `/api/admin/nomina/payroll/jobs/run/${encodeURIComponent(String(fileId))}`,

    payrollSummary: (fileId: number | string) =>
      `/api/admin/nomina/payroll/summary/${encodeURIComponent(String(fileId))}`,

    payrollPreview: (fileId: number | string, limit?: number) => {
      const qs =
        typeof limit === 'number' && Number.isFinite(limit)
          ? `?limit=${encodeURIComponent(String(limit))}`
          : '';
      return `/api/admin/nomina/payroll/preview/${encodeURIComponent(String(fileId))}${qs}`;
    },

    payrollErrors: (fileId: number | string, limit?: number) => {
      const qs =
        typeof limit === 'number' && Number.isFinite(limit)
          ? `?limit=${encodeURIComponent(String(limit))}`
          : '';
      return `/api/admin/nomina/payroll/errors/${encodeURIComponent(String(fileId))}${qs}`;
    },

    monitoreoPeriodo: (payPeriodId: number | string) =>
      `/api/admin/nomina/state/period/${encodeURIComponent(String(payPeriodId))}`,

    snapshotsGenerate: (versionId: number | string) =>
      `/api/admin/nomina/snapshots/generate/${encodeURIComponent(String(versionId))}`,

    receiptsGenerate: (versionId: number | string) =>
      `/api/admin/nomina/receipts/generate/${encodeURIComponent(String(versionId))}`,

    releaseVersion: (versionId: number | string) =>
      `/api/admin/nomina/releases/versions/${encodeURIComponent(String(versionId))}`,

    coreSyncVersion: (versionId: number | string) =>
      `/api/admin/nomina/core-sync/versions/${encodeURIComponent(String(versionId))}`,

    auditReleases: '/api/admin/nomina/audit/releases',
    auditCancellations: '/api/admin/nomina/audit/cancellations',
    receiptsBySpPeriod: '/api/admin/nomina/receipts/by-sp-period',
  },

  firmaElectronica: {
    solicitudes: '/api/v1/signature-requests',

    detalleSolicitud: (requestId: string) =>
      `/api/v1/signature-requests/${encodeURIComponent(requestId)}`,

    detalleFirma: (requestId: string) =>
      `/api/v1/signature-requests/${encodeURIComponent(requestId)}/signature-details`,

    signedPdf: (requestId: string) =>
      `/api/v1/signature-requests/${encodeURIComponent(requestId)}/signed-pdf`,
  },
} as const;
