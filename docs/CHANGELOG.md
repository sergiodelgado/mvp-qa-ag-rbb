# CHANGELOG · MVP QA – AG RBB · Buzón de Sugerencias

`docs/CHANGELOG.md`

Registro de cambios por fase y alcance.  
Las fechas son aproximadas y orientadas a trazabilidad técnica, no a marketing.

## [0.4.0] - F3b – Pruebas API `/api/sugerencias` (en progreso)

- Se agrega **carpeta Postman**:
  - `postman/mvp-ag-rbb-buzon.postman_collection.json`
  - `postman/mvp-ag-rbb-local.postman_environment.json`
- Se define script de ejecución con Newman:
  - `npm run test:api:f3b`
- Se documenta F3b en:
  - `docs/qa_f3b.md`
  - `docs/qa_matrix.md` (sección API / RLS)
- Cobertura actual (V0):
  - `GET /api/sugerencias` sin sesión → `401` + mensaje `"No hay sesión activa."`
  - `POST /api/sugerencias` sin sesión → `401` + mensaje `"No hay sesión activa."`
- Cobertura planificada:
  - Escenarios autenticados (usuario A / usuario B)
  - Validaciones `400`
  - Shape de respuestas `200`/`201`
  - Errores `500`
  - RLS lectura/escritura (API-11, API-12)

## [0.3.0] - F3 – Pruebas UI (Cypress) – Completado , preparación F3b

- Se agregan specs E2E:
  - `cypress/e2e/auth_buzon.cy.ts`
  - `cypress/e2e/sugerencias.cy.ts`
  - `cypress/e2e/refresh_sugerencias.cy.ts`
- Se validan:
  - Login y errores de login
  - Protección de `/buzon` sin sesión
  - Creación de sugerencias válidas
  - Validación de campos vacíos
  - Estados de carga y refresh
  - Manejo de `401` y `500` en `/api/sugerencias` (vía UI)
- Se documenta en:
  - `docs/qa_f3.md`
  - `docs/qa_matrix.md` (sección UI)

## [0.2.0] - F2 – Buzón de sugerencias – Completado

- Se implementa tabla `sugerencias` con RLS:
  - Migraciones:
    - `004_create_sugerencias.sql`
    - `005_rls_policies_sugerencias.sql`
    - `006_indexes_sugerencias.sql`
- Se implementa endpoint:
  - `app/api/sugerencias/route.ts` (`GET` + `POST`)
- Se implementa UI:
  - `/buzon` con:
    - saludo del socio
    - formulario de creación
    - listado de sugerencias propias
    - estado vacío
- Documentos:
  - `docs/modelo_sugerencias.md`
  - `docs/rutas_f2.md`
  - `docs/api_sugerencias.md`
  - `docs/fase2_sugerencias.md`
  - `docs/qa_f2.md`

## [0.1.0] - F1 – Base del proyecto – Completado

- Se configura proyecto Next.js (App Router).
- Se integra Supabase Auth + DB.
- Se define tabla `socios` con RLS.
- Rutas base:
  - `/`, `/register`, `/login`, `/buzon` (placeholder), `/logout`.
- Documentos:
  - `docs/rutas.md`
  - `docs/modelo_socios.md`
