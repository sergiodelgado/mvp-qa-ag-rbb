# MVP QA – AG RBB · Buzón de Sugerencias

Aplicación mínima validable (MVP) del módulo **Buzón de Sugerencias** para la Asociación Gremial Resonancias del Biobío (AG RBB).  
Incluye autenticación, CRUD básico, políticas RLS Supabase y una **suite QA completa** (UI + API + CI).

---

## 1. Objetivo del proyecto

Garantizar una base técnica sólida para la plataforma AG RBB mediante:

- Frontend modular (Next.js App Router)
- Backend vía API Routes
- Persistencia en Supabase (Postgres + RLS)
- QA automatizado (Cypress + Postman/Newman)
- Pipeline CI/CD reproducible en GitHub Actions

Este MVP valida la arquitectura base para futuros módulos (gestión interna, participación ciudadana, dashboards, RAG).

---

## 2. Arquitectura

### Stack principal

- **Next.js 16** — frontend + backend /api
- **Supabase Postgres** — datos + autenticación
- **RLS** — aislamiento estricto por usuario
- **Cypress** — pruebas E2E UI
- **Postman/Newman** — pruebas API
- **GitHub Actions** — CI end-to-end

### Diagrama resumido

```
[Next.js App Router]
   |-- UI (/login, /register, /buzon)
   |-- API Routes (/api/sugerencias)
        |
        v
[Supabase: Auth + Postgres + RLS]
```

### Diagrama resumido

| Capa / Módulo                 | Responsabilidad Principal                                   | Herramientas / Scripts                      | Qué valida exactamente                                                                                    | Estado                     |
| ----------------------------- | ----------------------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------------------------------------------------- | -------------------------- |
| **UI (E2E – Cypress)**        | Validar flujos reales de usuario en navegador               | `cypress:open`, `cypress:run`               | Login, sesiones, protección `/buzon`, crear sugerencias, validación de inputs, refresh, manejo de errores | ✔ Completado              |
| **API Routes (Next.js)**      | Validar autenticación, reglas RLS y estructura de respuesta | Colección Postman + `test:api:f3b` (Newman) | GET/POST `/api/sugerencias`, 401 sin sesión, payloads inválidos, códigos HTTP                             | ✔ Completado              |
| **Autenticación Supabase**    | Garantizar que session cookies + Bearer tokens funcionen    | Postman (login password grant) + UI login   | Login correcto, obtención de `access_token`, validación de sesión en API                                  | ✔ Completado              |
| **RLS (Row-Level Security)**  | Aislar datos por usuario                                    | API tests + pruebas manuales                | Usuario A solo ve sus sugerencias; usuario B aislado                                                      | ✔ Validado funcionalmente |
| **Build & Static Analysis**   | Asegurar que el proyecto compila y cumple estándares        | `npm run build`, `npm run lint`             | Lint sin errores, build reproducible                                                                      | ✔ Integrado               |
| **CI/CD (Pipeline QA total)** | Ejecutar QA completo en cada push/PR                        | GitHub Actions + `npm run test:ci`          | Lint → Build → Server → Newman → Cypress                                                                  | ✔ Activo                  |
| **Documentación QA**          | Trazabilidad y reproducibilidad del sistema de pruebas      | `docs/*.md`                                 | QA UI, QA API, Smoke test, Matrix, Changelog                                                              | ✔ Consolidado             |

---

## 3. Comandos principales

### Desarrollo local

```bash
npm install
npm run dev
```

### Build + producción local

```bash
npm run build
npm start
```

### QA local

```bash
npm run cypress:open     # modo interactivo
npm run cypress:run      # headless
npm run test:api:f3b     # Postman/Newman
npm run test:ci          # pipeline local idéntico a GitHub Actions
```

---

## 4. Supabase

Variables requeridas:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=   # opcional (administración)
```

### Clientes implementados

- **supabaseClientPublic** — UI (persistencia por cookies)
- **supabaseServerClient** — SSR y server components
- **supabaseFromRequest** — API Routes; acepta cookies y rechaza sin sesión (401)

Todos alineados a autenticación oficial Supabase + Next.js.

---

## 5. QA

### F3 — Pruebas UI (Cypress) — completado

Cobertura validada:

- Login válido/ inválido
- Página protégida `/buzon`
- Crear sugerencias válidas
- Validación campos vacíos
- Refresh del listado
- Manejo de 401 y errores visibles en UI

Documentos:  
`docs/qa_f3.md`, `docs/qa_matrix.md` (UI)

---

### F3b — Pruebas API (Postman/Newman) — completado

- Colección + environment local
- Scripts de test para:
  - **GET sin sesión → 401**
  - **POST sin sesión → 401**
- Validación del mensaje `"No hay sesión activa."`

Documentos:  
`docs/qa_f3b.md`, `docs/qa_matrix.md` (API), `docs/CHANGELOG.md`

---

### F3c — Consolidación QA — completado

- API `/api/sugerencias` estable
- UI + API alineadas
- `npm run build` estable para CI
- Documentación centralizada (QA UI, QA API, smoke test, matrix)

---

## 6. CI/CD — F4 (completado)

Pipeline unificado en GitHub Actions:

- Lint
- Build
- Arranque del servidor Next.js
- Ejecución consecutiva de Newman + Cypress
- Inyección de secrets vía `SUPABASE_URL`, `SUPABASE_ANON_KEY`

Workflow: `.github/workflows/ci-app.yml`

Command principal:

```bash
npm run test:ci
```

---

## 7. Estructura del proyecto

```
app/
  api/sugerencias/route.ts
  (login, register, buzon)

lib/
  supabaseClientPublic.ts
  supabaseServerClient.ts
  supabaseFromRequest.ts

cypress/
  e2e/*.cy.ts
  support/*.ts
postman/
  mvp-ag-rbb-buzon.postman_collection.json
  mvp-ag-rbb-local.postman_environment.json

docs/
  qa_f3.md
  qa_f3b.md
  qa_smoke_local.md
  qa_matrix.md
  CHANGELOG.md
```

---

## 8. Roadmap siguiente (F5)

- Hardening básico (headers, rate limit)
- Revisión RLS avanzada
- Demo final o video
- Documentación ejecutiva

---

## 9. Licencia

Uso interno AG RBB para fines de QA, formación y despliegues asociados a la transformación digital de la organización.

---

---

## 10. Autor

**Sergio Carlos Delgado Martínez**
AG RBB · 2025

---
