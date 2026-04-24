export const APP_ROUTES = {
  home: '/',
  admin: {
    root: '/admin',
    nomina: {
      configuracion: '/admin/nomina/configuracion-periodo-version',
      carga: '/admin/nomina/carga',
      monitoreo: '/admin/nomina/monitoreo',
      auditoria: '/admin/nomina/auditoria',
      procesamiento: '/admin/nomina/revision',
      recibos: '/admin/nomina/liberacion',
      busquedaRecibos: '/admin/nomina/buscar-servidor',
      firmaElectronica: '/admin/nomina/firma-electronica',
    },
  },
  usuario: {
    root: '/usuario',
    comprobantes: '/usuario/comprobantes',
  },
} as const;
