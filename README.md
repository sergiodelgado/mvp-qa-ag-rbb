# README.md — MVP QA · AG RBB · Buzón de Sugerencias

**Proyecto educativo y técnico del curso Test Automation Engineer**, integrando Web + API + QA + Supabase + CI/CD (planificado).

Este MVP implementa registro/login de socios, un buzón de sugerencias funcional y autenticación real con Supabase (cookies y `Authorization`), con QA automatizado (Cypress + Postman/Newman) y documentación sincronizada.

---

## 1. Descripción general

El proyecto demuestra:

- Autenticación con Supabase (cookies + RLS).
- CRUD mínimo de sugerencias (crear + listar).
- Arquitectura Next.js 16 (App Router) con Route Handlers.
- Integración UI ↔ API ↔ DB con políticas RLS.
- Pruebas UI E2E completas (F3).
- Pruebas API iniciales con Newman (F3b V0).
- CI/CD y Docker planificados para F4.

---

## 2. Stack tecnológico

- **Frontend:** Next.js 16 + TypeScript
- **Backend:** Route Handlers (`app/api/**`)
- **Base de datos:** Supabase (PostgreSQL + Auth + RLS)
- **QA UI:** Cypress (F3)
- **QA API:** Postman + Newman (F3b)
- **CI/CD:** GitHub Actions (F4 planificado)
- **Contenedores:** Docker (F4 planificado)

---

## 3. Estado del MVP por fases

### F1 — Base del proyecto (completado)

- Next.js + Supabase configurados
- Tabla `socios` con RLS
- Flujo: registro, login, buzón (placeholder), logout
- Documentación: rutas + modelo de socios

---

### F2 — Buzón de sugerencias (completado)

- Tabla `sugerencias` con RLS
- API GET y POST operativos
- UI `/buzon`: saludo, validación, listado propio, mensajes de carga y estado vacío
- Documentos: modelos, rutas, API, QA F2

---

### F3 — Pruebas UI (Cypress) (completado)

Cobertura UI validada:

- Login válido e inválido
- `/buzon` protegida
- Creación de sugerencias válidas
- Validación de campos vacíos
- Estados de carga / refresh
- Manejo de 401 en UI
- Manejo contemplado de errores 500 (sin test dedicado)

Documentos asociados:
`docs/qa_f3.md`, `docs/qa_matrix.md` sección UI

---

### F3b — Pruebas API (Postman/Newman) (completado)

- Colección Postman + environment local
- Script Newman `test:api:f3b`
- Cobertura: login A/B, GET/POST con header `Authorization: Bearer`, validaciones 400/500, RLS lectura/escritura y caso sin sesión (401).
- Documentos asociados: `docs/qa_f3b.md`, `docs/qa_matrix.md`, `docs/CHANGELOG.md`

---

### F3c — Cierre MVP QA (completado)

- API `/api/sugerencias` estable con sesión por header y cookies Supabase.
- Colección Postman lista para API real (login password grant y peticiones autenticadas) + Newman.
- Cypress estable (`cypress:run` / `cypress:open`) sobre `npm run dev`.
- `npm run build` listo para CI con red (Google Fonts requiere conexión en build).
- Documentación actualizada: README, `docs/qa_f3.md`, `docs/qa_matrix.md`, `docs/CHANGELOG.md`.

---

### F4 — CI/CD + Docker (planificado)

- Pipeline GitHub Actions
- Imagen Docker + ejecución en contenedor

### F5 — Hardening + Demo final (planificado)

- Revisión seguridad básica
- Demo o video
- Documentación final

---

## 4. Integración Supabase

### Variables de entorno

Requiere URL pública, clave anon y clave service role.
Los nombres están documentados en `.env.example`.
Las claves reales no se versionan.

### Clientes

- **supabaseClientPublic**: cliente browser con persistencia vía cookies.
- **supabaseServerClient**: cliente server SSR/UI.
- **supabaseFromRequest**: cliente para route handlers; acepta **Authorization: Bearer** (Postman/Newman) o cookies de sesión (UI/SSR).

Todos están alineados con el modelo de sesión de Supabase + Next.js y funcionan tanto en Supabase local como en producción.

---

## 5. Cómo levantar el proyecto

### 5.1 Requisitos

- Node.js 20+ / 22+
- Variables en `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

### 5.2 Instalar dependencias

```bash
npm install
```

### 5.3 Desarrollo

```bash
npm run dev
```

### 5.4 Build de producción

```bash
npm run build
```

> Nota: el build descarga Google Fonts (requiere acceso a red). En CI con conectividad pasa en limpio.

---

## 6. Rutas principales

- F1: `/`, `/login`, `/register`, `/buzon` (placeholder), `/logout`
- F2: `/buzon` (UI completa)
- API: `/api/sugerencias` (GET/POST)

Documentación detallada: `docs/rutas.md`, `docs/rutas_f2.md`.

---

## 7. Modelo de datos

Tablas:

- `socios`
- `sugerencias`

Ambas con RLS estricto usando `auth.uid()`.

Migraciones:

- creación de tabla
- políticas RLS
- índices

Documentos: modelos y API de sugerencias.

---

## 8. Pruebas automatizadas

### UI — Cypress (F3)

- Specs: `auth_buzon`, `sugerencias`, `refresh_sugerencias`.
- Requiere app corriendo con `npm run dev`.
- Comandos:
  - Interactivo: `npm run cypress:open`
  - Headless: `npm run cypress:run`

---

### API — Postman / Newman (F3b/F3c)

- Requisitos: app en ejecución, environment `postman/mvp-ag-rbb-local.postman_environment.json` con credenciales A/B y variables Supabase.
- Cobertura: login A/B (password grant), GET/POST con header `Authorization: Bearer`, validaciones 400/500, RLS multiusuario, casos 401 sin sesión.
- Comandos:
  - Interactivo: abrir colección `postman/mvp-ag-rbb-buzon.postman_collection.json` en Postman.
  - Headless: `npm run test:api:f3b`

---

## 9. Carpeta `postman/`

Contiene:

- Colección
- Environment
- Estructura por carpetas: auth, GET, POST, RLS

La colección está sincronizada con `docs/qa_f3b.md` y la matriz QA.

---

## 10. Changelog

Historial técnico localizado en `docs/CHANGELOG.md`.

---

## 11. Licencia

Proyecto educativo para AG RBB.
No usar datos reales en entornos de prueba.

---

## 12. Autor

**Sergio Carlos Delgado Martínez**
AG RBB · 2025

---
