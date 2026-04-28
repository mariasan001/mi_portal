# Architecture Guardrails

Este documento traduce decisiones de arquitectura a reglas operativas para que el proyecto conserve su forma mientras crece.

## Objetivo

Evitar que la arquitectura dependa solo de memoria o disciplina del equipo.

## Guardrails activos

### ESLint

El repo ya bloquea dos familias de acoplamientos desde [eslint.config.mjs](/abs/path/c:/PROYECTOS/mi-portal/eslint.config.mjs:1):

1. `src/features/**/*` no debe importar rutas, layouts ni route handlers desde `src/app`.
2. `src/features/admin/**/{model,api,application}` no debe depender de `ui`.

Eso obliga a mantener responsabilidades mas claras:

- `src/app` compone rutas y shells.
- `src/features` contiene la logica del dominio.
- `shared/ui` es el lugar para reutilizacion visual entre slices.

## Reglas humanas que siguen vigentes

- Un componente de `ui/` no deberia hacer fetch directo si puede delegarlo a `application` o `api`.
- Si dos modulos repiten toolbar, empty state o card, primero evaluar moverlo a `shared/ui`.
- Si una regla de formato o derivacion de datos aparece dos veces, moverla a `model` o `shared/lib`.
- Si una pagina de `src/app` empieza a crecer, esa logica debe bajar al feature.

## Checklist de PR o commit grande

- El cambio agrega deuda de acoplamiento o la reduce.
- Hay imports nuevos entre capas que se ven sospechosos.
- La logica nueva vive en el nivel correcto.
- Si el modulo crecio, la documentacion relevante tambien crecio.

## Siguiente nivel recomendado

Cuando convenga endurecer mas el repo, los siguientes pasos utiles serian:

- tests para route handlers criticos de `src/app/api/admin/*`
- mas restricciones lint por capa `ui -> application -> api/model`
- docs locales por modulo critico, empezando por `nomina/configuracion` y `nomina/carga`
