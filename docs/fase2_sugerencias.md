# Fase 2 – Diseño funcional de sugerencias

Este documento define el alcance funcional, flujos, rutas, APIs, validaciones y checklist de implementación para la Fase 2 del MVP QA – AG RBB.  
Se apoya en el modelo de datos de `sugerencias` (`docs/modelo_sugerencias.md`), en la arquitectura de rutas (`docs/rutas_f2.md`) y en la API (`docs/api_sugerencias.md`).

---

## 1) Resumen funcional de Fase 2

### Entregables de Fase 2

- CRUD inicial centrado en **crear** y **listar** sugerencias propias del socio autenticado.
- UI del buzón con:
  - formulario de creación,
  - listado ordenado por `created_at DESC`,
  - manejo de estado vacío.
- Endpoints API REST:
  - `GET /api/sugerencias`
  - `POST /api/sugerencias`
- RLS en la tabla `sugerencias` que garantiza aislamiento por usuario.
- Base para pruebas manuales y automatizadas (UI, API y RLS).

### Exclusiones

- Edición y eliminación de sugerencias.
- Cambios de estado avanzados.
- Integración con `/api/rag/ask`.
- Roles administrativos y vistas globales.

---

## 2) Flujos funcionales

### Crear sugerencia (UI)

1. Socio autenticado abre `/buzon`.
2. Completa los campos **Título** y **Contenido**.
3. La UI valida que ambos campos tengan contenido.
4. Envía `POST /api/sugerencias`.
5. Si la API responde `201`:
   - se limpia el formulario,
   - se actualiza inmediatamente la lista.
6. Si hay error:
   - se muestra mensaje sin borrar lo ya escrito.

### Crear sugerencia (API)

1. Cliente envía:

```json
{ "titulo": "...", "contenido": "..." }
```

2. El handler:
   - valida payload,
   - obtiene `user.id` desde la cookie de Supabase,
   - inserta en `sugerencias` (RLS lo permite solo si `socio_id = auth.uid()`),
   - devuelve `201` con la fila creada.

3. Errores gestionados:
   - `400` payload inválido,
   - `401` si no hay sesión,
   - `403` si RLS bloquea,
   - `500` para errores inesperados.

### Listar sugerencias (UI)

1. `/buzon` solicita `GET /api/sugerencias` al montar.
2. La API devuelve lista propia del socio autenticado.
3. La UI:
   - ordena desc por `created_at`,
   - muestra tarjetas,
   - o estado vacío si no hay sugerencias.

### Listar sugerencias (API)

- Devuelve solo filas donde `socio_id = auth.uid()`.
- Errores:
  - `401` sin sesión,
  - `403` si RLS bloquea.

---

## 3) Mapa de rutas y APIs

### Rutas UI (App Router)

| Ruta     | Propósito                                  | Requiere sesión | Datos usados                    |
| -------- | ------------------------------------------ | --------------- | ------------------------------- |
| `/buzon` | Página principal del buzón (form + lista). | Sí              | Perfil básico y API GET propio. |

### Endpoints API

| Método y ruta           | Propósito                                      | Payload                                 | Respuesta exitosa                  | Errores                    |
| ----------------------- | ---------------------------------------------- | --------------------------------------- | ---------------------------------- | -------------------------- |
| `POST /api/sugerencias` | Crear sugerencia propia del socio autenticado. | `{ titulo: string, contenido: string }` | `201 Created` con registro creado. | `400`, `401`, `403`, `500` |
| `GET /api/sugerencias`  | Listar sugerencias propias.                    | –                                       | `200 OK` con arreglo JSON.         | `401`, `403`, `500`        |

---

## 4) Validaciones mínimas

### UI

- Título obligatorio.
- Contenido obligatorio.
- Mostrar errores en la misma vista.
- Evitar enviar requests con campos vacíos.

### API

- `titulo` y `contenido` deben ser strings no vacíos tras `trim()`.
- `socio_id` se deriva del usuario autenticado.
- Sesión obligatoria.
- RLS exige coincidencia entre `socio_id` y `auth.uid()`.

---

## 5) Escenarios de QA Automation (sin código)

### UI (Cypress/Playwright)

- Login y redirección correcta a `/buzon`.
- Crear sugerencia válida.
- Validación de campos vacíos (no enviar request).
- Acceso bloqueado a `/buzon` sin sesión.
- Estado vacío para usuarios nuevos.

### API (Postman/Supertest)

- `GET` con sesión devuelve solo sugerencias propias.
- `POST` válido devuelve `201`.
- `POST` inválido devuelve `400`.
- Acceso sin sesión devuelve `401`.

### SQL (RLS)

- `SELECT` solo muestra filas donde `socio_id = auth.uid()`.
- `INSERT` bloqueado si `new.socio_id != auth.uid()`.

---

## 6) Checklist de implementación

- [x] Migraciones de `sugerencias` creadas y aplicadas en Supabase.
- [x] RLS activado y políticas configuradas.
- [x] Implementación de `GET` y `POST` en `/app/api/sugerencias/route.ts`.
- [x] Conexión UI ↔ API en `/buzon`.
- [x] Pruebas manuales:
  - Crear sugerencia
  - Listar sugerencias
  - Validación de campos
  - Acceso sin sesión

- [ ] Suite UI F3 (Cypress) — por implementar.
- [ ] Suite API F3b (Postman/Newman) — por implementar.
- [ ] Pruebas RLS — por implementar en SQL o CI.

---
