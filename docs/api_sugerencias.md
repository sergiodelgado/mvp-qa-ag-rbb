# API – `/api/sugerencias`

Este documento describe el endpoint `/api/sugerencias` de la Fase 2 del MVP QA – AG RBB. Incluye métodos soportados, payloads, respuestas y errores esperados.

---

## 1. Descripción general

- **Base:** `/api/sugerencias`
- **Autenticación:** requerida (sesión Supabase vía cookies).
- **RLS:** tabla `sugerencias` restringida por `socio_id = auth.uid()`.

La API está pensada para que **cada socio solo pueda crear y ver sus propias sugerencias**.

---

## 2. Modelo de datos relevante

Tabla `sugerencias` en Supabase:

| Campo        | Tipo        | Descripción                                        |
| ------------ | ----------- | -------------------------------------------------- |
| `id`         | uuid        | Identificador principal (PK).                      |
| `socio_id`   | uuid        | FK al socio (coincide con `auth.users.id`).        |
| `titulo`     | text        | Título de la sugerencia.                           |
| `contenido`  | text        | Detalle de la sugerencia.                          |
| `estado`     | text        | Estado actual (`nueva`, `en_revision`, `cerrada`). |
| `created_at` | timestamptz | Fecha de creación.                                 |

---

## 3. Métodos soportados

### 3.1. `GET /api/sugerencias`

**Propósito:** listar las sugerencias del socio autenticado.

- **Requiere sesión:** Sí.
- **Body:** ninguno.
- **RLS:** solo devuelve filas con `socio_id = auth.uid()`.

#### Respuestas esperadas

- `200 OK`

  ```json
  [
    {
      "id": "uuid",
      "titulo": "string",
      "contenido": "string",
      "estado": "nueva",
      "created_at": "2025-11-25T12:34:56.000Z"
    }
  ]
  ```

- `401 Unauthorized`

  ```json
  { "message": "No hay sesión activa." }
  ```

- `500 Internal Server Error`

  ```json
  { "message": "Error al obtener las sugerencias." }
  ```

---

### 3.2. `POST /api/sugerencias`

**Propósito:** crear una nueva sugerencia para el socio autenticado.

- **Requiere sesión:** Sí.
- **Body (JSON):**

  ```json
  {
    "titulo": "string no vacío",
    "contenido": "string no vacío"
  }
  ```

- Campos vacíos o tipos incorrectos se consideran inválidos.

#### Validaciones

1. `titulo` y `contenido` deben existir y ser strings.
2. Se recortan espacios (`trim`).
3. Si tras el `trim` quedan vacíos, se rechaza.
4. `socio_id` se obtiene SIEMPRE de `user.id` (no se acepta desde el cliente).

#### Respuestas esperadas

- `201 Created`

  ```json
  {
    "id": "uuid",
    "titulo": "string",
    "contenido": "string",
    "estado": "nueva",
    "created_at": "2025-11-25T12:34:56.000Z"
  }
  ```

- `400 Bad Request`

  ```json
  { "message": "Payload inválido. Se requiere titulo y contenido." }
  ```

- `401 Unauthorized`

  ```json
  { "message": "No hay sesión activa." }
  ```

- `500 Internal Server Error`

  ```json
  { "message": "Error al crear la sugerencia." }
  ```

---

## 4. Errores típicos para QA

- Intentar `GET` o `POST` sin sesión → `401`.
- Intentar crear sugerencia con `titulo` o `contenido` vacíos → `400`.
- Si RLS en Supabase está mal configurado (ej. sin política de SELECT), el resultado puede ser:
  - `200` con arreglo vacío cuando debería haber datos.
  - `403` o `500` según configuración.

---

## 5. Casos de prueba recomendados

### GET

1. **Con sesión y sin sugerencias**
   - Dado un socio autenticado recién creado.
   - Cuando hace `GET /api/sugerencias`.
   - Entonces recibe `200` con `[]`.

2. **Con sesión y con sugerencias**
   - Dado un socio con N sugerencias creadas.
   - Cuando hace `GET /api/sugerencias`.
   - Entonces recibe `200` con N elementos ordenados por `created_at DESC`.

3. **Sin sesión**
   - Dado un cliente sin cookie válida.
   - Cuando hace `GET /api/sugerencias`.
   - Entonces recibe `401`.

### POST

1. **Creación válida**
   - Dado un socio autenticado.
   - Cuando envía `POST` con `titulo` y `contenido` válidos.
   - Entonces recibe `201` y el registro aparece en la tabla `sugerencias`.

2. **Payload inválido**
   - Dado un socio autenticado.
   - Cuando envía `POST` con strings vacíos o tipos incorrectos.
   - Entonces recibe `400`.

3. **Sin sesión**
   - Dado un cliente sin sesión.
   - Cuando envía `POST`.
   - Entonces recibe `401`.

---

## 6. Notas de implementación

- Frontend usa `fetch('/api/sugerencias')` desde `/buzon`.
- Backend usa `supabaseServerClient()` y `auth.getUser()` para derivar `user.id`.
- No se permite que el cliente envíe `socio_id` en el body.
- Cambios futuros (PUT/DELETE) deberán respetar las mismas políticas de RLS.

---
