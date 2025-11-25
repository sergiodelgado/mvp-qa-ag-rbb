# Proyecto: MVP QA – AG RBB · Buzón de Sugerencias
## Archivo: project_context.md
## Última actualización: 2025-11-25  (actualizar manualmente cada vez que cambie el estado)

---

# 1. Resumen del estado actual

Este archivo resume el estado real del proyecto a partir del código, la estructura del repositorio y la documentación existente.

- Proyecto: **MVP QA · AG RBB – Buzón de Sugerencias**
- Objetivo: MVP web con login/registro de socios, buzón de sugerencias y base para QA Automation + CI/CD.
- Estado actual (alto nivel):
  - **Fase 0 (F0)** – Estructura inicial del repo y diseño general: **completada**.
  - **Fase 1 (F1)** – Base App + Supabase + Auth: **en curso**.
  - Fases F2–F5: **diseñadas, pero no implementadas todavía** (CRUD, pruebas, CI/CD, Docker, docs finales).
- Conectores externos:
  - GitHub: repositorio `mvp-qa-ag-rbb` conectado.
  - Vercel: **no configurado**.
  - Linear: **no configurado**.
  - Notion: **no configurado**.
  - Otros conectores ChatGPT: **no utilizados por ahora**.

Este contexto es la “fuente de verdad” para cualquier modelo que trabaje con el proyecto.

---

# 2. Estructura real del repositorio (vista lógica)

> Nota: esta sección debe actualizarse si cambian las carpetas principales o se agregan módulos relevantes.

Estructura lógica actual (confirmada por docs y diseño):

- Carpeta raíz:
  - `README.md`
  - `package.json`
  - `tsconfig.json`
  - `.env.example` (definición de variables esperadas)
  - `.env.local` (variables reales, no versionado, solo referencia)

- Aplicación:
  - `app/`
    - `app/page.tsx`              → Home (`/`)
    - `app/login/page.tsx`        → Ruta `/login`
    - `app/register/page.tsx`     → Ruta `/register`
    - `app/buzon/page.tsx`        → Ruta `/buzon`
    - (otras páginas o layouts podrán agregarse en fases posteriores)

- Integración Supabase:
  - `lib/`
    - `lib/supabaseClientPublic.ts`  → Cliente público (frontend)
    - `lib/supabaseServerClient.ts`  → Cliente de servidor (previsto / en diseño)

- Documentación funcional y de QA:
  - `docs/`
    - `docs/rutas.md`           → Diseño detallado de rutas y reglas de acceso.
    - `docs/modelo_socios.md`   → Diseño del modelo de datos `socios`.
    - `docs/escenarios_auth.md` → Escenarios de autenticación para pruebas.

- Pruebas automatizadas:
  - No se han creado todavía carpetas definitivas como `cypress/` o `tests/`.  
    (Esta sección debe actualizarse cuando se definan estructuras de testing.)

- CI/CD:
  - No existe aún `.github/workflows/ci.yml` ni otros workflows activos.

---

# 3. Estado del frontend (Next.js + TypeScript)

- Framework: **Next.js + TypeScript (App Router)**.
- Rutas principales definidas conceptualmente:
  - `/`        → Home simple, punto de entrada.
  - `/login`   → Formulario de login.
  - `/register`→ Formulario de registro.
  - `/buzon`   → Buzón de sugerencias, requiere autenticación.
  - `/logout`  → Acción de cierre de sesión (ruta/acción prevista).

- Comportamientos clave diseñados:
  - Usuarios autenticados deben ser redirigidos de `/` y `/login` hacia `/buzon`.
  - Acceso a `/buzon` debe estar protegido (redirigir a `/login` si no hay sesión).
  - Flujo lineal esperado: `register → login → buzón`.

- Estado actual (supuesto basado en avances reportados):
  - Rutas base implementadas a nivel de páginas (`app/.../page.tsx`).
  - Lógica de redirecciones y protección aún en desarrollo.
  - UI mínima enfocada en funcionalidad, no en diseño visual complejo.

---

# 4. Estado de la base de datos (Supabase)

- Proveedor: **Supabase** (PostgreSQL + Auth).
- Variables de entorno definidas (documentadas en `.env.example`):
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Claves:
  - Claves públicas: utilizadas en el cliente de frontend (`supabaseClientPublic.ts`).
  - Clave de service role: reservada para uso en servidor (`supabaseServerClient.ts` / endpoints `/api`).

- Modelo `socios`:
  - Definido conceptualmente en `docs/modelo_socios.md`.
  - Campos clave previstos:
    - `id` (uuid, igual a `auth.users.id`)
    - `email` (text)
    - `nombre` (text)
    - `created_at` (timestampz, default `now()`)
    - `rol` (text, opcional)
    - `estado` (text, opcional)
  - Rol:
    - Complementar a `auth.users` con datos propios del contexto AG RBB.
    - Relación 1:1 conceptual con `auth.users`.

- Estado actual:
  - Proyecto Supabase creado y conectado al frontend.
  - Variables URL + ANON_KEY configuradas en entorno local.
  - **Tabla `socios` aún no creada en la base de datos** (pendiente explícito).
  - No se han definido aún políticas RLS ni triggers para sincronizar `auth.users` con `socios`.

---

# 5. Estado de autenticación

- Sistema: **Supabase Auth**.
- Flujo general diseñado:
  1. Registro: el usuario crea cuenta con email + password.
  2. Creación (diseñada) del registro en `socios` asociado a `auth.users.id`.
  3. Login: usuario autenticado accede a la app.
  4. Redirección a `/buzon` tras login exitoso.
  5. Logout: cierre de sesión y redirección a `/login`.

- Escenarios de autenticación documentados:
  - Registro exitoso.
  - Registro inválido.
  - Registro con email ya registrado.
  - Login exitoso.
  - Login fallido.
  - Protección de `/buzon` para usuario no autenticado.
  - Logout.
  - Persistencia de sesión tras recargar.

- Estado actual:
  - Flujo de integración con Supabase Auth en desarrollo.
  - Registro y login básicos implementados a nivel de frontend (formulario + llamada a Supabase).
  - Creación automática de fila en `socios`: **diseñada pero no implementada aún**.
  - Protección estricta de `/buzon` mediante middleware o guard: en diseño / pendiente.

---

# 6. Dependencias principales (package.json)

> Esta sección debe sincronizarse con `package.json` cada vez que se agregue o quite una librería relevante.

Dependencias previstas / utilizadas:

- `next` – Framework principal.
- `react` / `react-dom` – Librerías de UI.
- `typescript` – Tipado estático.
- `@supabase/supabase-js` – Cliente oficial Supabase.
- Herramientas de desarrollo:
  - Scripts básicos de `dev`, `build`, `start`, etc.

Pendientes:
- Instalar y configurar:
  - `cypress` (o `@cypress/*`) para pruebas E2E.
  - Dependencias de Postman/Newman si se integran vía CLI/Newman en CI.
  - Cualquier librería específica para testing, mocking o herramientas de QA.

---

# 7. Estado de pruebas (QA)

Diseño actual:

- Escenarios funcionales de autenticación definidos en `docs/escenarios_auth.md`.
- Rutas y flujos base documentados en `docs/rutas.md`.
- El MVP está pensado para incluir:
  - Pruebas E2E (Cypress).
  - Pruebas de API (Postman/Newman).
  - Casos manuales como base.

Estado actual:

- Carpeta de pruebas automatizadas: **no creada**.
- No hay aún specs E2E (`.cy.ts`) ni colecciones Postman integradas al repo.
- QA se encuentra en etapa de **diseño conceptual**, pendiente la implementación técnica.

---

# 8. Estado de CI/CD y Docker

Diseño (según roadmap y README):

- CI/CD planeado con **GitHub Actions**:
  - Jobs previstos:
    - Lint + typecheck.
    - Tests (Cypress / Newman).
    - Build de la app.
  - Integración futura con variables de entorno como secrets:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY`.

- Docker:
  - Se contempla un `Dockerfile` básico para empaquetar la app en contenedor.

Estado actual:

- `.github/workflows/` aún no existe o no contiene pipelines activos.
- No hay `Dockerfile` operativo en el repo (aún).
- No se ha configurado despliegue automático (ni a Vercel ni a otro proveedor).

---

# 9. Pendientes críticos por fase

### F1 – Base app + Supabase + Auth (EN CURSO)
- Completar flujo funcional de:
  - `/register` creando usuario en Auth.
  - Futuro: crear registro en `socios` (pendiente).
  - `/login` autenticando y redirigiendo a `/buzon`.
- Implementar redirecciones básicas según estado de sesión.
- Verificar que variables de entorno Supabase funcionan tanto en local como en build.

### F2 – Buzón de sugerencias + `/api/rag/ask`
- Implementar modelo de datos para sugerencias.
- Implementar CRUD de sugerencias:
  - Crear, listar, actualizar, eliminar sugerencias del socio autenticado.
- Implementar endpoint placeholder `/api/rag/ask` (sin RAG real todavía).

### F3 – Automatización de pruebas (UI + API)
- Crear estructura de pruebas E2E (Cypress).
- Implementar escenarios de autenticación como tests.
- Crear colección Postman y script Newman.
- Añadir scripts npm: `test:e2e`, `test:api`, etc.

### F4 – CI/CD + Docker
- Crear workflow de GitHub Actions:
  - Install → Lint → Tests → Build.
- Integrar secretos Supabase.
- Añadir `Dockerfile` funcional y (opcional) pipeline para build de imagen.

### F5 – Hardening + Docs + Demo
- Documentación final del proyecto (README “pro”).
- Guía de uso + setup local.
- Guión de demo en video.

---

# 10. Riesgos técnicos identificados

- **Sin tabla `socios` creada**:
  - La lógica de vincular usuarios Auth con socios está solo en diseño.
- **Sin políticas RLS definidas**:
  - Riesgo de exposición de datos si se avanza sin restricciones.
- **Sin test automatizados**:
  - Cambios futuros pueden romper flujos sin ser detectados.
- **Sin CI/CD**:
  - No hay validación automatizada en cada push.
- **Sin deploy configurado**:
  - No hay entorno “real” donde ver el comportamiento del MVP.

---

# 11. Próximos pasos sugeridos (técnicos)

1. **Crear la tabla `socios` en Supabase** según `docs/modelo_socios.md`.
2. Implementar en `/register` la creación sincronizada:
   - Usuario en `auth.users`.
   - Fila correspondiente en `socios`.
3. Asegurar redirecciones:
   - Usuario autenticado: `/` y `/login` → `/buzon`.
   - Usuario no autenticado: `/buzon` → `/login`.
4. Crear estructura base de pruebas:
   - Carpeta para Cypress.
   - Primer test: “Registro exitoso” + “Login exitoso”.
5. Definir primer pipeline sencillo en GitHub Actions (aunque sea solo `build`).

---

# 12. Historial de revisiones

- 2025-11-25 – Versión inicial de `project_context.md` creada a partir de la documentación del proyecto y el diseño actual.
