# Definition of Done (DoD) — MVP QA · AG RBB · Buzón

Una entrega (issue/PR) se considera **Done** solo si cumple:

## Calidad y CI

- [ ] `npm run lint` pasa.
- [ ] `npm run build` pasa.
- [ ] `npm run test:api:f3b` (Newman) pasa.
- [ ] `npm run test:e2e` (Cypress) pasa.
- [ ] Workflow CI en GitHub Actions está verde para el commit del PR.

## Trazabilidad

- [ ] El PR referencia un Issue (link en descripción).
- [ ] La descripción del PR explica **qué** cambia y **por qué**.

## Seguridad

- [ ] No se agregan secretos al repo (solo `.env.example`).
- [ ] Si hay alertas `npm audit`, quedan registradas en Issue `security/tech-debt`.

## Documentación

- [ ] Si cambia comportamiento (API/UI/QA), se actualiza `docs/` y/o `CHANGELOG.md`.
