# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).  
Incluye registro y login de socios, un buzón de sugerencias funcional (crear + listar), y un endpoint placeholder `/api/rag/ask` preparado para futura integración RAG.

El proyecto será usado como entrega final del curso **Test Automation Engineer**, integrando web, API, automatización y CI/CD.

---

## 1. Descripción general

Este repositorio contiene un MVP diseñado para demostrar:

- Autenticación real con Supabase.
- CRUD básico de sugerencias (Fase 2).
- Arquitectura frontend con Next.js (App Router).
- API interna con Route Handlers.
- Pruebas UI + API (Fase 3, próximamente).
- Pipeline CI/CD (GitHub Actions) en Fase 4.
- Ejecución aislada con Docker en Fase 4.

---

## 2. Stack Tecnológico

- **Next.js 16 + TypeScript (App Router)**
- **Supabase** (Auth + PostgreSQL + RLS)
- **Cypress** (pruebas UI – Fase 3)
- **Postman/Newman** (pruebas API – Fase 3b)
- **GitHub Actions** (CI/CD – Fase 4)
- **Docker** (build y ejecución – Fase 4)

---

## 3. Estado del MVP (al día)

### ✔ F1 – Base del proyecto (completado)

- Next.js + TypeScript configurado.
- Conexión a Supabase correcta.
- Tabla `socios` con RLS lista.
- Flujo completo:
  - registro → login → buzón → logout.
- Documentos:
  - `docs/rutas.md`
  - `docs/modelo_socios.md`
  - `docs/escenarios_auth.md`

### ✔ F2 – Buzón de sugerencias (completado)

- Tabla `sugerencias` + RLS (`socio_id = auth.uid()`).
- Endpoint API:
  - `GET /api/sugerencias` (listar propias)
  - `POST /api/sugerencias` (crear propia)
- Página `/buzon` protegida:
  - muestra perfil
  - formulario para crear sugerencias
  - listado de sugerencias propias
- Documentos:
  - `docs/rutas_f2.md`
  - `docs/api_sugerencias.md`
  - `docs/modelo_sugerencias.md`
  - `docs/fase2_sugerencias.md`
  - `docs/qa_f2.md`

### ⏳ Próximas fases

- **F3 – Pruebas UI (Cypress)**
- **F3b – Pruebas API (Postman/Newman)**
- **F4 – CI/CD + Docker**
- **F5 – Hardening + documentación + demo**

---

## 4. Supabase – Integración y Arquitectura

### Variables de entorno requeridas

El proyecto usa tres variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo en servidor)

Ejemplo en `.env.example`; valores reales en `.env.local` (no versionado).

### Clientes de Supabase

- `lib/supabaseClientPublic.ts`  
  Cliente **browser** con `createBrowserClient`  
  → Persiste sesión en cookies (necesario para F2 y APIs)

- `lib/supabaseServerClient.ts`  
  Cliente **server** con `createServerClient`  
  → Para `/api/sugerencias` y futuras integraciones.

---

## 5. Rutas principales

### Rutas base (Fase 1)

Documentadas en: `docs/rutas.md`

- `/`
- `/login`
- `/register`
- `/buzon`
- `/logout`

### Rutas Fase 2

Documentadas en: `docs/rutas_f2.md`

- `/api/sugerencias` (GET/POST)
- Extensión funcional de `/buzon`

---

## 6. Modelo de datos

- `docs/modelo_socios.md`
- `docs/modelo_sugerencias.md`

Ambas tablas implementan RLS con políticas estrictas basadas en `auth.uid()`.

---

## 7. Roadmap

| Fase | Foco               | Entregables                 |
| ---- | ------------------ | --------------------------- |
| F1   | Base de app + Auth | Auth, socios, rutas base    |
| F2   | CRUD sugerencias   | API + RLS + UI conectada    |
| F3   | Cypress            | Pruebas E2E                 |
| F3b  | API tests          | Postman/Newman              |
| F4   | CI/CD + Docker     | GitHub Actions + Dockerfile |
| F5   | Demo + docs        | Guía + video demo           |

---

## 8. Licencia

Proyecto educativo para AG RBB.  
No usar datos reales en pruebas.

---

## 9. Autor

Sergio Carlos Delgado Martínez  
AG RBB · 2025
