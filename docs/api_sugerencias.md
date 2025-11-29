# API – `/api/sugerencias`

Este documento describe el endpoint implementado en la Fase 2 del MVP QA · AG RBB.  
Incluye métodos soportados, validaciones, payloads, respuestas esperadas, errores comunes y casos recomendados para pruebas automatizadas.

---

## 1. Descripción general

- **Base:** `/api/sugerencias`
- **Autenticación:** obligatoria (sesión Supabase gestionada vía cookies).
- **Seguridad:** RLS en tabla `sugerencias` con `socio_id = auth.uid()`.
- **Objetivo:** permitir que cada socio cree y consulte solo **sus propias** sugerencias.

---

## 2. Modelo de datos relacionado (Supabase)

Tabla: `sugerencias`

| Campo        | Tipo        | Descripción                                          |
| ------------ | ----------- | ---------------------------------------------------- |
| `id`         | uuid        | Identificador (PK), generado con `gen_random_uuid()` |
| `socio_id`   | uuid        | FK al socio (1:1 con `auth.users.id`)                |
| `titulo`     | text        | Título corto de la sugerencia                        |
| `contenido`  | text        | Detalle o justificación                              |
| `estado`     | text        | `nueva` (default), `en_revision`, `cerrada`          |
| `created_at` | timestamptz | Fecha de creación (`now()`)                          |

---

## 3. Métodos soportados

## 3.1 GET `/api/sugerencias`

**Propósito:** listar todas las sugerencias del socio autenticado.

- **Requiere sesión:** Sí
- **Body:** no aplica
- **Orden:** `created_at DESC`
- **RLS:** garantiza que solo se leen filas donde `socio_id = auth.uid()`

### Respuestas esperadas

#### 200 OK

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

#### 401 Unauthorized

```json
{ "message": "No hay sesión activa." }
```

#### 500 Internal Server Error

```json
{ "message": "Error al obtener las sugerencias." }
```

---

## 3.2 POST `/api/sugerencias`

**Propósito:** crear una nueva sugerencia para el socio autenticado.

### Payload (JSON)

```json
{
  "titulo": "string no vacío",
  "contenido": "string no vacío"
}
```

### Validaciones

1. `titulo` y `contenido` deben existir.
2. Ambos deben ser strings.
3. Se aplica `trim()`.
4. Si quedan vacíos, se rechaza con `400`.
5. `socio_id` se obtiene siempre de `user.id` → **no se acepta desde el cliente**.

### Respuestas esperadas

#### 201 Created

```json
{
  "id": "uuid",
  "titulo": "string",
  "contenido": "string",
  "estado": "nueva",
  "created_at": "2025-11-25T12:34:56.000Z"
}
```

#### 400 Bad Request

```json
{ "message": "Payload inválido. Se requiere titulo y contenido." }
```

#### 401 Unauthorized

```json
{ "message": "No hay sesión activa." }
```

#### 500 Internal Server Error

```json
{ "message": "Error al crear la sugerencia." }
```

---

## 4. Errores típicos para QA

| Error                            | Causa                              | Resultado                              |
| -------------------------------- | ---------------------------------- | -------------------------------------- |
| Sin sesión                       | No hay token en cookies            | `401`                                  |
| Payload vacío o inválido         | Strings vacíos o tipos incorrectos | `400`                                  |
| RLS mal configurado              | SELECT/INSERT sin política propia  | `403`, `500` o `200` con arreglo vacío |
| `socio_id` enviado desde cliente | Forzar manipulación del body       | Ignorado; API usa siempre `user.id`    |

---

## 5. Casos de prueba recomendados (Fase 3)

### GET

#### 1. GET con sesión y sin sugerencias

- Socio recién creado.
- Respuesta: `200` + `[]`.

#### 2. GET con sesión y con sugerencias

- Crear N sugerencias.
- GET devuelve N elementos ordenados por fecha desc.

#### 3. GET sin sesión

- Respuesta: `401`.

---

### POST

#### 1. POST válido

- Payload correcto.
- Respuesta: `201`.
- GET posterior debe incluir la nueva sugerencia.

#### 2. POST con payload inválido

- `titulo` o `contenido` vacíos.
- Tipos diferentes a string.
- Respuesta: `400`.

#### 3. POST sin sesión

- Respuesta: `401`.

---

## 6. Notas de implementación

- `/buzon` consume este endpoint mediante `fetch('/api/sugerencias')`.
- La API usa `supabaseServerClient()` y `auth.getUser()` para derivar el `user.id`.
- `socio_id` **no** viaja en el body para evitar manipulación del cliente.
- Cambios futuros (PUT/DELETE) deberán seguir el mismo diseño y políticas RLS.

---

## 7. Relación con Fase 3 (QA Automation)

Este endpoint será cubierto por:

- **Cypress:** pruebas UI (crear sugerencia, validación, render del listado).
- **Postman/Newman:** colección de API para CI/CD.
- **Supertest (opcional):** tests aislados de API.
- **RLS tests SQL:** validación de políticas en Supabase.

Este documento queda como referencia base para la suite QA de Fase 3.

---
