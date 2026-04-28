# Mi Portal

Portal web construido con `Next.js` para concentrar experiencias publicas, autenticacion, navegacion por aplicaciones y modulos administrativos de nomina.

## Stack

- `Next.js 16` con App Router
- `React 19`
- `TypeScript` en modo estricto
- `Vitest` + `Testing Library`
- `ESLint` con `eslint-config-next`
- `CSS Modules` + capas globales en `src/styles`
- `sonner` para notificaciones

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run test
npm run test:watch
npm run test:coverage
```

## Variables de entorno

El proyecto actua como BFF y necesita acceso a servicios externos. Las variables se leen en [src/lib/config/entorno.ts](/abs/path/c:/PROYECTOS/mi-portal/src/lib/config/entorno.ts:1).

```env
IAM_BASE_URL=http://localhost:8081/iam
BATCH_BASE_URL=http://localhost:8091/batch
SIGNATURE_BASE_URL=http://localhost:8092/signature
```

## Arquitectura general

La app esta dividida en cuatro dominios principales dentro de `src/features`:

- `site`: experiencia publica del portal.
- `auth`: autenticacion, sesion, redirecciones y formularios de acceso.
- `navegacion`: menu lateral y resolucion de accesos por aplicacion.
- `admin`: modulos administrativos, hoy enfocados en nomina.

La composicion de rutas vive en `src/app`, pero la logica real se empuja a `src/features`.

## Estructura

```txt
src/
  app/                  # Rutas, layouts, route handlers y shells
  features/             # Dominio funcional por modulo
  lib/                  # Infraestructura transversal
  styles/               # Tokens, temas, tipografia y base global
  test/                 # Setup de pruebas
  utils/                # Utilidades generales
```

### `src/app`

- `layout.tsx`: layout raiz + providers globales.
- `(public)/`: shell publico con navegacion y footer.
- `admin/`: shell protegido de administracion.
- `usuario/`: rutas protegidas para usuarios autenticados.
- `api/`: route handlers que funcionan como proxy/BFF.

### `src/features`

- `auth`: contexto de sesion, login, registro, OTP, password reset.
- `site`: homepage, secciones publicas y flujo de comprobantes.
- `navegacion`: menu lateral consumido por admin.
- `admin`: slices verticales de nomina y piezas compartidas de administracion.

### `src/lib`

- `api/`: cliente HTTP, errores y rutas cliente.
- `auth/`: parseo de cookies, validacion server-side y roles.
- `config/`: acceso a variables de entorno.

## Flujo de autenticacion

La seguridad funciona en capas:

1. `middleware.ts` protege `/admin/*` y `/usuario/*`.
2. Los layouts server-side vuelven a validar la sesion antes de renderizar.
3. Los route handlers internos en `src/app/api` exigen sesion o rol admin segun el caso.
4. La validacion real de privilegios ocurre contra `/auth/me` del backend IAM.

Piezas clave:

- [middleware.ts](/abs/path/c:/PROYECTOS/mi-portal/middleware.ts:1)
- [src/lib/auth/session.ts](/abs/path/c:/PROYECTOS/mi-portal/src/lib/auth/session.ts:1)
- [src/lib/auth/server.ts](/abs/path/c:/PROYECTOS/mi-portal/src/lib/auth/server.ts:1)
- [src/app/api/_lib/proxy.ts](/abs/path/c:/PROYECTOS/mi-portal/src/app/api/_lib/proxy.ts:1)

## BFF y consumo de APIs

El cliente React no consume directamente IAM, Batch o Signature. En su lugar:

1. Usa rutas internas definidas en [src/lib/api/api.routes.ts](/abs/path/c:/PROYECTOS/mi-portal/src/lib/api/api.routes.ts:1).
2. Esas rutas pegan a `src/app/api/...`.
3. Los route handlers validan acceso, normalizan errores y proxifican al servicio externo.

Eso permite centralizar:

- cookies y `credentials: include`
- validacion de payloads
- `no-store`
- headers de seguridad
- traduccion uniforme de errores

## Admin de nomina

La parte mas estructurada del repo hoy esta en `src/features/admin/nomina`.

Modulos activos:

- `configuracion`
- `carga`
- `procesamiento`
- `monitoreo`
- `auditoria`
- `recibos`
- `busqueda-recibos`
- `firma-electronica`

Cada modulo tiende a organizarse asi:

```txt
modulo/
  model/
  api/
  application/
  ui/
```

La documentacion especifica de admin vive en [src/features/admin/ARCHITECTURE.md](/abs/path/c:/PROYECTOS/mi-portal/src/features/admin/ARCHITECTURE.md:1).

## Estilos y UI

- Los estilos globales arrancan en [src/app/globals.css](/abs/path/c:/PROYECTOS/mi-portal/src/app/globals.css:1).
- La base visual se reparte entre `src/styles/tokens.css`, `base.css` y `themes.css`.
- La mayoria de componentes usa `CSS Modules`.
- Hay componentes shared para admin como shells, surfaces, mensajes inline y empty states.

## Testing

Las pruebas se ejecutan con `Vitest` en entorno `jsdom`, configurado en [vitest.config.mjs](/abs/path/c:/PROYECTOS/mi-portal/vitest.config.mjs:1).

Cobertura actual:

- utilidades y selectores
- algunos hooks y recursos
- piezas puntuales de auth, navegacion y nomina

Limitaciones actuales:

- poca cobertura de route handlers
- pocas pruebas de integracion UI + API
- casi sin flujos end-to-end de seguridad o roles

## Convenciones utiles para trabajar aqui

- Preferir `src/features/...` para la logica y dejar `src/app/...` lo mas delgado posible.
- Si un modulo admin crece, separar en `model`, `api`, `application` y `ui`.
- Reutilizar `shared/ui` antes de duplicar shells, estados vacios o paneles.
- Mantener los route handlers como proxies pequenos, con validacion temprana y respuestas uniformes.
- Agregar pruebas al menos para selectores, hooks o helpers cuando se introduzca logica nueva.

## Estado actual de la documentacion

Este README resume la estructura real del proyecto a abril de 2026. Si cambian los modulos, rutas protegidas o integraciones externas, hay que actualizar tambien:

- `README.md`
- `src/features/admin/ARCHITECTURE.md`
- cualquier doc local del modulo afectado
