# Admin Architecture

## Objetivo

Mantener `src/features/admin` escalable, legible y coherente conforme crecen los modulos administrativos, sobre todo el dominio de nomina.

La idea central es evitar pantallas monoliticas y mover la complejidad a slices verticales por modulo.

## Principios

- `ui` presenta, no orquesta negocio pesado.
- `application` concentra flujo, coordinacion, validaciones de accion y estado de pantalla.
- `api` encapsula queries y commands hacia el BFF interno.
- `model` guarda tipos, selectores, helpers de formato y reglas locales de dominio.
- `shared/ui` absorbe patrones repetidos antes de copiar componentes.
- `use client` solo aparece cuando la interaccion realmente lo exige.

## Estructura recomendada

```txt
src/features/admin/
  shared/
    ui/

  nomina/
    shared/
      api/
      lib/
      model/
      ui/

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

    recibos/
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

## Flujo recomendado por modulo

1. `src/app/admin/.../page.tsx` monta una pagina del feature.
2. La pantalla principal en `ui/` consume un controlador de `application/`.
3. El controlador coordina recursos, estado local y toasts.
4. Los recursos llaman funciones de `api/`.
5. Las funciones de `api/` consumen `src/lib/api/api.cliente.ts` y rutas de `src/lib/api/api.routes.ts`.

## Shared actual disponible

Hoy ya existe una base reusable que vale la pena priorizar:

- `shared/ui/AdminPageShell`
- `shared/ui/AdminSurface`
- `shared/ui/AdminInlineMessage`
- `nomina/shared/ui/NominaHero`
- `nomina/shared/ui/NominaToolbar`
- `nomina/shared/ui/NominaSectionHeader`
- `nomina/shared/ui/NominaEmptyState`
- `nomina/shared/ui/NominaOptionCards`

Tambien hay utilidades comunes en:

- `nomina/shared/api/buildQueryString`
- `nomina/shared/lib/request-state`
- `nomina/shared/model/*`

## Estado actual del dominio nomina

Modulos presentes en el repo:

- `configuracion`
- `carga`
- `procesamiento`
- `monitoreo`
- `auditoria`
- `recibos`
- `busqueda-recibos`
- `firma-electronica`

### Slices con forma madura

Estos modulos ya siguen bastante bien el corte `model/api/application/ui`:

- `nomina/configuracion`
- `nomina/procesamiento`
- `nomina/auditoria`
- `nomina/recibos`
- `nomina/monitoreo`
- `nomina/firma-electronica`

### Slices que aun conviene endurecer

- `nomina/carga`
- `nomina/busqueda-recibos`

El objetivo ahi no es rehacer todo, sino empujar mas logica a `application/`, bajar duplicacion visual y aumentar piezas shared.

## Reglas practicas al editar

1. No meter fetches directos dentro de componentes visuales.
2. No colocar toasts, parseos y reglas de negocio mezclados por toda la UI.
3. Si aparece un estado async repetido, moverlo a `shared/lib` o a un recurso reusable.
4. Si una vista admin repite shell, header, toolbar o empty state, extraer a `shared/ui`.
5. Cuando un modulo crezca, separar lecturas y mutaciones en `api/`.
6. Si el archivo `page.tsx` empieza a acumular logica, esa logica va al feature.

## DTOs y modelos

Regla ideal:

- `ui` deberia depender de view models o datos ya preparados cuando la transformacion sea no trivial.

Estado real:

- algunos modulos ya presentan datos preparados via selectores;
- otros todavia usan DTOs casi directos del backend.

Cuando se toque codigo existente, conviene mejorar esto de forma incremental, sin reescrituras grandes.

## Seguridad y limites de responsabilidad

Los features de admin no deben resolver por su cuenta autenticacion o privilegios.

Eso ya vive en:

- `middleware.ts`
- `src/app/admin/layout.tsx`
- `src/lib/auth/server.ts`
- `src/app/api/_lib/proxy.ts`

Desde `features/admin`, la expectativa es consumir solamente APIs internas `/api/admin/...`.

## Testing esperado

No todos los modulos estan igual de cubiertos, pero la expectativa minima para cambios nuevos es:

- test de selector/helper si agregas logica derivada
- test de hook o recurso si agregas coordinacion importante
- validacion manual del flujo UI cuando no haya harness de integracion

Prioridades de testing que siguen pendientes a nivel arquitectura:

- route handlers de `src/app/api/admin/*`
- flujos criticos de nomina entre recursos y pantallas
- permisos y comportamientos por rol

## Checklist rapido antes de crear o mover codigo

- Existe ya un componente shared que resuelva esto.
- La logica puede vivir en `application` en lugar de `ui`.
- El acceso a datos puede entrar por `api`.
- Hay una utilidad o selector que deba tener test.
- El modulo sigue el mismo lenguaje visual del resto de admin.

## Estado de esta documentacion

Este documento describe el estado real del area admin a abril de 2026. Si se crea un modulo nuevo, si se migra otro slice o si cambia la estrategia de capas, hay que actualizar este archivo junto con el `README.md` raiz.
