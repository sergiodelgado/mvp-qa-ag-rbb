# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).

Incluye:

- Registro y login de socios
- Buzón de sugerencias funcional (crear + listar)
- Endpoint placeholder `/api/rag/ask` para futura integración RAG
- QA automatizado sobre UI (Cypress · F3)
- QA API inicial sobre `/api/sugerencias` (Postman/Newman · F3b V0)

El proyecto sirve como entrega final del curso **Test Automation Engineer**, integrando **Web + API + QA + CI/CD**.

---

## 1. Descripción general

Este repositorio implementa un MVP capaz de demostrar:

- Autenticación real con Supabase (cookies + RLS)
- CRUD mínimo de sugerencias (crear + listar)
- Arquitectura frontend con Next.js 16 (App Router)
- API interna mediante Route Handlers
- Integración UI ↔ API ↔ DB con RLS estricto
- Pruebas UI E2E con Cypress (F3)
- Pruebas API iniciales con Postman/Newman (F3b V0)
- Ejecución aislada vía Docker (planificada para F4)
- Pipeline CI/CD con GitHub Actions (planificado para F4)

---

## 2. Stack tecnológico

- **Frontend**: Next.js 16 + TypeScript (App Router)
- **Backend**: Route Handlers (`app/api/**`)
- **Base de datos**: Supabase (PostgreSQL + Auth + RLS)
- **QA UI**: Cypress (F3)
- **QA API**: Postman + Newman (F3b)
- **CI/CD**: GitHub Actions (F4)
- **Infra de empaquetado**: Docker (F4)

---

## 3. Estado del MVP por fases

### 3.1 F1 – Base del proyecto (✔ completado)

- Proyecto Next.js configurado
- Integración con Supabase (Auth + DB)
- Tabla `socios` con RLS activa
- Flujo funcional:
  - `/register` → creación usuario + fila en `socios`
  - `/login` → inicio de sesión
  - `/buzon` (placeholder en F1)
  - `/logout` → cierre de sesión
- Documentación:
  - `docs/rutas.md`
  - `docs/modelo_socios.md`

### 3.2 F2 – Buzón de sugerencias (✔ completado)

- Tabla `sugerencias` con RLS (`socio_id = auth.uid()`)
- API real:
  - `GET /api/sugerencias` → lista sugerencias propias
  - `POST /api/sugerencias` → crea sugerencia propia
- UI `/buzon`:
  - saludo con datos de `socios`
  - validación de formulario
  - creación de sugerencia
  - listado actualizado + estado vacío
- Documentación:
  - `docs/modelo_sugerencias.md`
  - `docs/rutas_f2.md`
  - `docs/api_sugerencias.md`
  - `docs/fase2_sugerencias.md`
  - `docs/qa_f2.md`

### 3.3 F3 – Pruebas UI (Cypress) (✔ completado)

- Specs E2E:
  - `cypress/e2e/auth_buzon.cy.ts`
  - `cypress/e2e/sugerencias.cy.ts`
  - `cypress/e2e/refresh_sugerencias.cy.ts`
- Cobertura:
  - Login y errores de login
  - Protección de `/buzon` sin sesión
  - Crear sugerencias válidas y verlas en el listado
  - Validación de campos vacíos
  - Manejo de refresh:
    - `GET /api/sugerencias` inicial
    - botón “Actualizar lista”
    - estado “Cargando sugerencias…”
    - “Actualizando…” en el botón
    - manejo de `500` y `401` en refresh
- Documentación:
  - `docs/qa_f3.md`
  - Matriz contrato → implementación → pruebas:
    - `docs/qa_matrix.md` (sección UI)

### 3.4 F3b – Pruebas API (Postman/Newman) (◐ en progreso)

- Carpeta `postman/`:
  - `postman/mvp-ag-rbb-buzon.postman_collection.json`
  - `postman/mvp-ag-rbb-local.postman_environment.json`
- Cobertura actual (F3b V0):
  - `GET /api/sugerencias` sin sesión → `401` + mensaje `"No hay sesión activa."`
  - `POST /api/sugerencias` sin sesión → `401` + mensaje `"No hay sesión activa."`
- Cobertura planificada (próximas iteraciones F3b):
  - Escenarios autenticados (usuario A / usuario B)
  - Validaciones de payload (`400`)
  - Shape de respuestas `200`/`201`
  - Escenarios de error `500`
  - RLS lectura/escritura (multiusuario)
- Documentación:
  - `docs/qa_f3b.md`
  - `docs/qa_matrix.md` (sección API / RLS)
  - `docs/CHANGELOG.md` (cambios por fase)

### 3.5 Fases siguientes

- **F4 – CI/CD + Docker**
  - Pipeline en GitHub Actions
  - Imagen Docker y ejecución en contenedor
- **F5 – Hardening + demo final**
  - Revisión de seguridad básica
  - Documentación de demo
  - Guion de presentación y/o video

---

## 4. Integración Supabase

### 4.1 Variables de entorno

Configurar en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- `.env.example` documenta estos nombres.
- Las claves reales **no** se versionan.

### 4.2 Clientes Supabase

- `lib/supabaseClientPublic.ts`  
  Cliente browser usando `createBrowserClient` de @supabase/ssr.  
  Persiste sesión en cookies compatibles con el backend.

- `lib/supabaseServerClient.ts`  
  Cliente server usando createServerClient + cookies() de next/headers.
  Usado en:
  - `app/api/sugerencias/route.ts`
  - futuras integraciones backend (RAG, dashboards, etc.)

---

## 5. Rutas principales

### 5.1 Fase 1 – Base

Documentadas en `docs/rutas.md`:

- `/`
- `/login`
- `/register`
- `/buzon` (placeholder F1)
- `/logout`

### 5.2 Fase 2 – Funcionales

Documentadas en `docs/rutas_f2.md`:

- `/buzon` (UI completa del buzón)
- `/api/sugerencias` (GET/POST)

---

## 6. Modelo de datos

Documentado en:

- `docs/modelo_socios.md`
- `docs/modelo_sugerencias.md`

Ambas tablas implementan **RLS estricto** basado en `auth.uid()`.

Migraciones relevantes:

- `supabase/migrations/004_create_sugerencias.sql`
- `supabase/migrations/005_rls_policies_sugerencias.sql`
- `supabase/migrations/006_indexes_sugerencias.sql`

---

## 7. Pruebas automatizadas

### 7.1 UI · Cypress (F3)

Requisitos:

- App corriendo:

```bash
npm install
npm run dev
# http://localhost:3000
```

- `cypress.config.ts` con:

```ts
baseUrl: 'http://localhost:3000'
```

- Ejecución modo interactivo:

```bash
npx cypress open
```

Seleccionar:

- `cypress/e2e/auth_buzon.cy.ts`
- `cypress/e2e/sugerencias.cy.ts`
- `cypress/e2e/refresh_sugerencias.cy.ts`

- Ejecución headless:

```bash
npx cypress run --spec \
  cypress/e2e/auth_buzon.cy.ts,\
  cypress/e2e/sugerencias.cy.ts,\
  cypress/e2e/refresh_sugerencias.cy.ts
```

- Salida esperada (resumen):
  - Specs: 3
  - Tests: 9
  - `All specs passed!`

Detalles completos en `docs/qa_f3.md`.

### 7.2 API · Postman / Newman (F3b)

Requisitos:

- App corriendo en local:

```bash
npm run dev
# http://localhost:3000
```

- Environment Postman `mvp-ag-rbb-local` con:
  - `BASE_URL = http://localhost:3000`
  - `API_BASE_URL = {{BASE_URL}}/api`
  - `TEST_EMAIL_A`, `TEST_PASSWORD_A`
  - `TEST_EMAIL_B`, `TEST_PASSWORD_B`
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY` (rellenados localmente, no en el repo)

\*Ejecución con Newman:

```bash
npm run test:api:f3b

```

\*Script en `package.json`:

```json
"scripts": {
  "test:api:f3b": "newman run postman/mvp-ag-rbb-buzon.postman_collection.json -e postman/mvp-ag-rbb-local.postman_environment.json"
}
```

Cobertura actual:

- `GET /api/sugerencias` sin sesión → `401`
- `POST /api/sugerencias` sin sesión → `401`

Escenarios adicionales se agregarán sobre la misma colección (F3b V1, V2…).

---

## 8. Carpeta `postman/`

\*Estructura:

postman/
mvp-ag-rbb-buzon.postman_collection.json
mvp-ag-rbb-local.postman_environment.json

- La colección define:
  - Folders por endpoint (`10 – GET`, `20 – POST`, `30 – RLS`, etc.)
  - Tests de status y shape de respuesta.

- El environment:
  - Variables de entorno locales para Supabase y usuarios de prueba.
  - No incluye secrets reales en el repo.

Más detalles: `docs/qa_f3b.md`.

---

## 9. Changelog

**Cambios por fase y versiones:** - `docs/CHANGELOG.md`

---

## 10. Licencia

Proyecto educativo para AG RBB.  
No usar datos reales en entornos de prueba.

---

## 11. Autor

**Sergio Carlos Delgado Martínez**  
AG RBB · 2025

---
