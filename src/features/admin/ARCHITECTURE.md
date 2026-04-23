# Admin Architecture

## Objetivo

Escalar `src/features/admin` sin seguir creciendo por copia y pega.

La arquitectura objetivo separa:

- `shared`: piezas reutilizables entre modulos de admin.
- `model`: tipos, mappers y reglas del dominio.
- `application`: hooks/controladores de flujo y orquestacion.
- `ui`: componentes de presentacion y pantallas.
- `api`: acceso a datos, queries y commands.

## Estructura objetivo

```txt
src/features/admin/
  shared/
    ui/
    hooks/
    lib/
    types/

  nomina/
    shared/
      ui/
      lib/
      types/
      api/

    configuracion/
      model/
      api/
      application/
      ui/

    carga/
      model/
      api/
      application/
      ui/

    procesamiento/
      model/
      api/
      application/
      ui/

    recibos/
      model/
      api/
      application/
      ui/

    monitoreo/
      model/
      api/
      application/
      ui/

    auditoria/
      model/
      api/
      application/
      ui/

    busqueda-recibos/
      model/
      api/
      application/
      ui/

  firma-electronica/
    model/
    api/
    application/
    ui/
```

## Reglas

1. `ui` no conoce DTOs crudos del backend si puede evitarse.
2. `application` concentra flujos, validacion de acciones y coordinacion.
3. `api` separa lecturas y mutaciones cuando el modulo crece.
4. `shared/ui` absorbe patrones repetidos:
   - page shells
   - surfaces
   - banners
   - empty states
   - section headers
5. `use client` solo se usa cuando existe interaccion real.
6. Los hooks devuelven estados consistentes y reutilizan utilidades compartidas.

## Estrategia de migracion

1. Crear base compartida en `shared`.
2. Migrar vistas existentes para que compongan con esa base.
3. Mover modulos uno por uno a slices verticales.
4. Vaciar progresivamente `hooks`, `services` y `types` planos.

## Estado actual

Base compartida ya disponible:

- `shared/ui/AdminPageShell`
- `shared/ui/AdminSurface`
- `shared/ui/AdminInlineMessage`
- `nomina/shared/ui/NominaEmptyState`
- `nomina/shared/ui/NominaSectionHeader`

Slices ya migrados:

- `nomina/configuracion`
- `nomina/auditoria`
- `nomina/recibos`
- `nomina/procesamiento`

Compatibilidades temporales conectadas:

- `features/admin/hooks/*`
- `features/admin/services/*`
- `features/admin/types/*`
- `features/admin/ui/NominaRecibosView/*`
- `features/admin/ui/NominaProcesamientoView/*`
- `features/admin/ui/NominaConfiguracion/*`
- `features/admin/ui/NominaAuditoriaView/*`

Siguiente prioridad recomendada:

- `nomina/carga`
- `nomina/busqueda-recibos`
- `firma-electronica`
