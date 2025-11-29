# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).  
Incluye registro y login de socios, un buzón de sugerencias funcional (crear + listar) y un endpoint placeholder `/api/rag/ask` para futura integración RAG.

El proyecto sirve como entrega final del curso **Test Automation Engineer**, integrando Web + API + QA + CI/CD.

---

## 1. Descripción general

Este repositorio implementa un MVP capaz de demostrar:

- Autenticación real con Supabase (cookies + RLS).
- CRUD mínimo de sugerencias (crear + listar).
- Arquitectura frontend con Next.js 16 (App Router).
- API interna mediante Route Handlers.
- Integración UI ↔ API ↔ DB con RLS estricto.
- Pruebas UI y API (Fase 3).
- Pipeline CI/CD con GitHub Actions (Fase 4).
- Ejecución aislada vía Docker (Fase 4).

---

## 2. Stack Tecnológico

- **Next.js 16 + TypeScript (App Router)**
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
  - `docs/escenarios_auth.md`

---

### ✔ F2 – Buzón de sugerencias (completado)

- Tabla `sugerencias` con RLS (`socio_id = auth.uid()`).
- API real:
  - `GET /api/sugerencias` – lista propias
  - `POST /api/sugerencias` – crea propia
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

### ⏳ Próximas fases

- **F3 – Pruebas UI (Cypress)**
- **F3b – Pruebas API (Postman/Newman)**
- **F4 – CI/CD + Docker**
- **F5 – Hardening + documentación + demo final**

---

## 4. Integración Supabase

### Variables de entorno

Configurar en `.env.local`:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

`.env.example` documenta estos nombres.  
Las claves reales **no** se versionan.

### Clientes Supabase

- `lib/supabaseClientPublic.ts`  
  Cliente **browser** usando `createBrowserClient`.  
  Persiste sesión en cookies compatibles con los handlers de servidor.

- `lib/supabaseServerClient.ts`  
  Cliente **server** usando `createServerClient`.  
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

- `/buzon` (UI completa)
- `/api/sugerencias` (GET/POST)

---

## 6. Modelo de datos

- `docs/modelo_socios.md`
- `docs/modelo_sugerencias.md`

Ambas tablas implementan RLS estricto basado en `auth.uid()`.

---

## 7. Roadmap

| Fase | Foco             | Entregables            |
| ---- | ---------------- | ---------------------- |
| F1   | Base + Auth      | Socios + rutas + login |
| F2   | CRUD sugerencias | UI + API + RLS + docs  |
| F3   | Cypress          | Pruebas UI E2E         |
| F3b  | API tests        | Postman/Newman         |
| F4   | CI/CD + Docker   | Actions + Dockerfile   |
| F5   | Demo final       | Docs, guion y video    |

---

## 8. Licencia

Proyecto educativo para AG RBB.  
No usar datos reales en entornos de prueba.

---

## 9. Autor

Sergio Carlos Delgado Martínez  
AG RBB · 2025

---
