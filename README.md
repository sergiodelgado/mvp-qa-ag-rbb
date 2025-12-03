# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).

Incluye registro y login de socios, un buzón de sugerencias funcional (crear + listar) y un endpoint placeholder `/api/rag/ask`
para futura integración RAG.

El proyecto sirve como entrega final del curso **Test Automation Engineer**, integrando **Web + API + QA + CI/CD**.

---

## 1. Descripción general

Este repositorio implementa un MVP capaz de demostrar:

- Autenticación real con Supabase (cookies + RLS).
- CRUD mínimo de sugerencias (crear + listar).
- Arquitectura frontend con Next.js 16 (App Router).
- API interna mediante Route Handlers (`/api/sugerencias`, `/api/rag/ask` placeholder).
- Integración UI ↔ API ↔ DB con RLS estricto.
- **Pruebas UI E2E con Cypress (Fase 3).**
- Pruebas API planificadas con Postman/Newman (Fase 3b).
- Pipeline CI/CD con GitHub Actions (Fase 4).
- Ejecución aislada vía Docker (Fase 4).

---

## 2. Stack Tecnológico

- **Next.js 16 + TypeScript** (App Router)
- **Supabase** (Auth + PostgreSQL + RLS)
- **Cypress** (UI E2E – F3)
- **Postman/Newman** (API E2E – F3b)
- **GitHub Actions** (CI/CD – F4)
- **Docker** (imagen + ejecución – F4)

---

## 3. Estado del MVP

### ✔ F1 – Base del proyecto (completado)

- Proyecto Next.js configurado.
- Integración completa con Supabase (Auth + DB).
- Tabla `socios` con RLS.
- Flujo funcional:
  - `/register` → creación usuario + fila en `socios`
  - `/login` → inicio sesión
  - `/buzon` (placeholder F1)
  - `/logout` → cierre sesión

- Documentación:
  - `docs/rutas.md`
  - `docs/modelo_socios.md`

---

### ✔ F2 – Buzón de sugerencias (completado)

- Tabla `sugerencias` con RLS (`socio_id = auth.uid()`).
- API real:
  - `GET /api/sugerencias` – lista sugerencias propias
  - `POST /api/sugerencias` – crea sugerencias propias

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

---

### ✔ F3 – Pruebas UI (Cypress)

Pruebas end-to-end sobre la aplicación real (Next.js + Supabase), validando:

- **Auth y rutas protegidas:**
  - login válido redirige de `/login` a `/buzon`
  - login inválido mantiene en `/login` y muestra error
  - intento de acceder a `/buzon` sin sesión ⇒ `/login`

- **Formulario de sugerencias:**
  - creación de sugerencia válida y presencia en el listado
  - validación de campos vacíos (mensaje “Título y contenido son obligatorios.”)

- **Lista y refresh:**
  - carga inicial desde `GET /api/sugerencias`
  - botón “Actualizar lista” hace un nuevo GET
  - estados de carga: “Cargando sugerencias…”, “Actualizando…”
  - manejo de errores:
    - `500` en refresh ⇒ mensaje y lista previa preservada
    - `401` en refresh ⇒ redirección a `/login`

Specs principales:

- `cypress/e2e/auth_buzon.cy.ts`
- `cypress/e2e/sugerencias.cy.ts`
- `cypress/e2e/refresh_sugerencias.cy.ts`

Documentación QA:

- `docs/qa_f3.md` – alcance y evidencias de F3 (UI).
- `docs/qa_matrix.md` – matriz contrato–implementación–pruebas (UI + API + RLS).

---

### ⏳ Próximas fases

- **F3b – Pruebas API (Postman/Newman)**
  - Colección de pruebas para `/api/sugerencias` (GET/POST).
  - Validación directa de:
    - códigos 200/400/401/500,
    - estructura de payload,
    - efectos de RLS (multiusuario).
  - Documentación prevista en: `docs/qa_f3b.md`.

- **F4 – CI/CD + Docker**
  - Pipeline GitHub Actions:
    - lint + tests UI (Cypress),
    - tests API (Newman),
    - build y deploy.
  - Imagen Docker y ejecución local / demo.

- **F5 – Hardening + documentación + demo final**
  - limpieza de código
  - documentación extendida
  - guion y video de demo final

---

## 4. Integración Supabase

### Variables de entorno

Configurar en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

- `.env.example` documenta estos nombres.
- Las claves reales **no** se versionan.

### Clientes Supabase

- `lib/supabaseClientPublic.ts`  
  Cliente browser usando `createBrowserClient`.  
  Persiste sesión en cookies compatibles con los handlers de servidor.

- `lib/supabaseServerClient.ts`  
  Cliente server usando `createServerClient`.  
  Utilizado en:
  - `/api/sugerencias`
  - futuras integraciones backend (RAG, dashboards, etc.)

---

## 5. Rutas principales

### Fase 1 – Base

Documentadas en `docs/rutas.md`:

- `/`
- `/login`
- `/register`
- `/buzon` (placeholder)
- `/logout`

### Fase 2 – Funcionales

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

## 7. QA y documentación

- **F2 – QA inicial:**
  - `docs/qa_f2.md`

- **F3 – QA UI (Cypress):**
  - `docs/qa_f3.md` – alcance, requisitos y evidencias UI.
  - `docs/qa_matrix.md` – matriz contrato–implementación–pruebas (UI + API + RLS).

- **F3b – QA API (Postman/Newman) [planificado]:**
  - `docs/qa_f3b.md` – se agregará con los escenarios y colecciones de API Tests.

---

## 8. Roadmap

| Fase | Foco             | Entregables                            |
| ---- | ---------------- | -------------------------------------- |
| F1   | Base + Auth      | Socios + rutas + login                 |
| F2   | CRUD sugerencias | UI + API + RLS + docs                  |
| F3   | Cypress          | Pruebas UI E2E + docs QA (F3 + matriz) |
| F3b  | API tests        | Postman/Newman + docs QA API           |
| F4   | CI/CD + Docker   | Actions + Dockerfile                   |
| F5   | Demo final       | Docs, guion y video                    |

---

## 9. Licencia

Proyecto educativo para AG RBB.  
No usar datos reales en entornos de prueba.

---

## 10. Autor

**Sergio Carlos Delgado Martínez**  
AG RBB · 2025

---
