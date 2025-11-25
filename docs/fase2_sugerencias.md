# Fase 2 – Diseño funcional de sugerencias

Este documento define el alcance funcional, flujos, rutas, APIs, validaciones y checklist de implementación para la Fase 2 del MVP QA – AG RBB. Se apoya en el modelo de datos de `sugerencias` (`docs/modelo_sugerencias.md`) y en la arquitectura de rutas y APIs.

---

## 1) Resumen funcional de Fase 2

### Qué entregará Fase 2

- CRUD inicial centrado en **crear** y **listar** sugerencias propias del socio autenticado.
- UI de buzón con formulario de alta y listado por fecha descendente.
- Endpoints API REST (`/api/sugerencias`) para crear y consultar sugerencias del socio autenticado.
- RLS que asegura que cada socio solo puede ver/crear sus propias sugerencias.
- Base para pruebas manuales y automatizadas (UI, API y RLS).

### Qué NO incluye

- Edición o eliminación de sugerencias.
- Moderación o flujos avanzados de estados.
- Integración con `/api/rag/ask` o IA.
- Funcionalidades administrativas (ver sugerencias de otros socios).

---

## 2) Flujos funcionales

### Crear sugerencia (UI)

1. Socio autenticado navega a `/buzon`.
2. Ve formulario con campos **Título** y **Contenido**.
3. Completa ambos campos y envía.
4. La UI valida requeridos; si faltan, muestra error inline y no envía.
5. Si pasa validación, llama a `POST /api/sugerencias` con el payload.
6. Tras respuesta `201`, limpia formulario y actualiza listado.
7. Si hay error, muestra mensaje sin perder los datos escritos.

### Crear sugerencia (API)

1. Cliente autenticado envía `POST /api/sugerencias` con `{ titulo, contenido }`.
2. El endpoint valida payload y sesión.
3. Inserta en `public.sugerencias` con `socio_id = user.id`.
4. Responde `201 Created` con la sugerencia creada.
5. Si no hay sesión o fallan validaciones/RLS, responde `400/401/403`.

### Listar sugerencias del socio (UI)

1. Socio autenticado accede a `/buzon`.
2. La página ejecuta `GET /api/sugerencias` al cargar.
3. Muestra listado de sugerencias propias, ordenadas desc por `created_at`.
4. Si no hay sugerencias, muestra estado vacío con llamada a crear la primera.
5. Errores muestran mensaje y opción de reintentar.

### Listar sugerencias del socio (API)

1. Cliente autenticado hace `GET /api/sugerencias`.
2. El endpoint valida sesión y ejecuta selección filtrada por `user.id`.
3. Devuelve `200 OK` con arreglo de sugerencias.
4. Sin sesión o fallo RLS ⇒ `401/403`.

---

## 3) Mapa de rutas y APIs

### Rutas UI

| Ruta    | Propósito                                              | Requiere sesión | Datos usados                          |
|--------|---------------------------------------------------------|-----------------|---------------------------------------|
| `/buzon` | Página principal del buzón (formulario + listado).      | Sí              | Perfil básico (`socios`) + API `GET`. |

### Endpoints API

| Método y endpoint         | Propósito                            | Payload esperado                            | Respuesta exitosa                     | Errores esperados          |
|---------------------------|--------------------------------------|---------------------------------------------|---------------------------------------|----------------------------|
| `POST /api/sugerencias`  | Crear sugerencia del socio actual.   | `{ titulo: string; contenido: string; }`    | `201` con sugerencia creada.          | `400`, `401`, `403`, `500` |
| `GET /api/sugerencias`   | Listar sugerencias del socio actual. | Ninguno                                      | `200` con lista de sugerencias.       | `401`, `403`, `500`        |

---

## 4) Validaciones mínimas

### UI

- Título requerido.
- Contenido requerido.
- Mensajes claros en campos cuando falten.

### API

- `titulo` y `contenido` no vacíos.
- Sesión obligatoria (`user.id` presente).
- Operaciones siempre asociadas al `auth.uid()` vía RLS.

---

## 5) Escenarios de QA Automation (sin código)

### UI (Cypress/Playwright)

- Crear sugerencia exitosa.
- Validación de campos requeridos.
- Redirección a `/login` si se entra a `/buzon` sin sesión.
- Estado vacío para socio sin sugerencias.

### API (Postman/Supertest)

- `POST` válido con sesión.
- `POST` sin sesión (`401`).
- `POST` con payload inválido (`400`).
- `GET` propio.
- `GET` sin sesión (`401`).

### RLS (SQL)

- `select` devuelve solo sugerencias del propio `auth.uid()`.
- `insert` con `socio_id != auth.uid()` bloqueado.

---

## 6) Checklist de implementación

- [ ] Verificar migraciones de `sugerencias` en Supabase.
- [ ] Implementar `POST` y `GET` en `/app/api/sugerencias/route.ts`.
- [ ] Conectar `/buzon` a la API: formulario + listado.
- [ ] Probar manualmente crear/listar.
- [ ] Añadir pruebas UI, API y RLS a la pipeline de QA.
