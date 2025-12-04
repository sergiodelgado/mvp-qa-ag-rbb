# Pruebas API · Fase 3b – `/api/sugerencias`

**MVP QA – AG RBB · Buzón de Sugerencias**

Esta fase valida a nivel **API** que el endpoint `/api/sugerencias` cumple el contrato funcional definido en:

- F2 (implementación UI + API + RLS)
- F3 (pruebas UI E2E con Cypress)
- `docs/qa_matrix.md` (matriz contrato–implementación–pruebas)

El foco de F3b es **probar directamente la API**, sin navegador, usando **Postman/Newman**, asegurando:

- Autenticación correcta (401 cuando corresponde)
- Datos correctos (solo sugerencias propias)
- Validaciones de payload (400)
- Manejo de errores (500 controlados)
- RLS efectiva (lectura/escritura)

---

## 1. Alcance de F3b

### 1.1 Endpoints bajo prueba

- `GET /api/sugerencias`
- `POST /api/sugerencias`

Ambos implementados en:

- `app/api/sugerencias/route.ts`

### 1.2 Lo que se valida en F3b

- Códigos HTTP (`200`, `201`, `400`, `401`, `500`)
- Estructura mínima del payload de respuesta (shape)
- Validaciones de payload de entrada (tipos, requeridos, vacíos)
- Comportamiento ante errores de BD / RLS
- Efectividad de RLS (multiusuario: lectura/escritura aislada por `auth.uid()`)

### 1.3 Fuera de alcance en F3b

- Otros endpoints (`/api/rag/ask`, etc.)
- Métricas de performance (latencias, p95, p99)
- Pruebas de carga / estrés
- Integración CI/CD (se aborda formalmente en F4)
- Validación UI (cubierta en F3 con Cypress)

---

## 2. Dependencias y precondiciones

### 2.1 Entorno

- App corriendo en local:

```bash

npm install
npm run dev
# http://localhost:3000

```

- Variables de entorno configuradas:

```text

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

```

(Ver `.env.example`.)

- Supabase con migraciones ejecutadas:
  - `004_create_sugerencias.sql`
  - `005_rls_policies_sugerencias.sql`
  - `006_indexes_sugerencias.sql`

### 2.2 Usuarios de prueba

Se requieren al menos 2 usuarios en Supabase Auth y en la tabla `socios`:

- **Usuario A (principal para tests):**
  - `email = test@example.com`
  - `password = Test1234!`
  - fila correspondiente en `socios` (`id = auth.uid()`)

- **Usuario B (para pruebas de RLS):**
  - `email = test.b@example.com` (ejemplo)
  - `password = TestB1234!`
  - fila correspondiente en `socios`

### 2.3 Datos mínimos en `sugerencias`

Para ejecutar F3b con sentido:

- Usuario A:
  - Escenario 1: sin sugerencias (lista vacía)
  - Escenario 2: con 1+ sugerencias propias en `public.sugerencias` (`socio_id = A.id`)

- Usuario B:
  - 1+ sugerencias (`socio_id = B.id`), para validar que A no las ve.

La forma de preparar estos datos (scripts de seed / carga manual en Supabase) debe quedar documentada en el proyecto, pero no es responsabilidad directa de F3b.

---

## 3. Estrategia de autenticación en F3b

El backend usa:

- `lib/supabaseServerClient.ts`
- `createServerClient` de `@supabase/ssr`
- cookies de Supabase (`cookies()` de `next/headers`)

F3b no modifica esta estrategia.
Los tests API se autentican simulando las mismas cookies que usa la app.

### 3.1 Tokens desde Supabase Auth

La colección Postman:

1. Llama a la API de Supabase Auth (`/auth/v1/token?grant_type=password`) usando:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `TEST_EMAIL_*`
   - `TEST_PASSWORD_*`

2. Guarda en variables de environment:
   - `ACCESS_TOKEN_A`, `REFRESH_TOKEN_A`
   - `ACCESS_TOKEN_B`, `REFRESH_TOKEN_B`

3. Utiliza estos tokens para construir las cookies necesarias que `supabaseServerClient` espera, de manera que el handler:

const supabase = await supabaseServerClient()
const { data: { user } } = await supabase.auth.getUser()

vea a A o B como usuarios autenticados.

> Nota: la implementación exacta de nombres de cookies y mapeo tokens→cookies se documenta en el README de `postman/` y en comentarios de la colección.

---

## 4. Estructura técnica de F3b

### 4.1 Archivos y carpetas

Se define la siguiente estructura:

postman/
mvp-ag-rbb-buzon.postman_collection.json
mvp-ag-rbb-local.postman_environment.json
README.md # (opcional pero recomendado)

### 4.2 Environment Postman: `mvp-ag-rbb-local`

Variables mínimas:

- `BASE_URL` → `http://localhost:3000`
- `API_BASE_URL` → `{{BASE_URL}}/api`

Usuarios:

- `TEST_EMAIL_A` → `test@example.com`
- `TEST_PASSWORD_A` → `Test1234!`
- `TEST_EMAIL_B` → `test.b@example.com`
- `TEST_PASSWORD_B` → `TestB1234!`

Supabase:

- `SUPABASE_URL` → valor real de `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_ANON_KEY` → valor real de `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Tokens (rellenados por pre-request scripts):

- `ACCESS_TOKEN_A`
- `REFRESH_TOKEN_A`
- `ACCESS_TOKEN_B`
- `REFRESH_TOKEN_B`

---

## 5. Diseño de la colección Postman

Colección: **MVP QA · AG RBB – Buzón · API F3b**

### 5.1 Folders

1. `00 – Auth / Tokens`
   - Login usuario A → setea `ACCESS_TOKEN_A` / `REFRESH_TOKEN_A`
   - Login usuario B → idem para B

2. `10 – GET /api/sugerencias`
   - `GET sin sesión → 401` (API-01)
   - `GET usuario A sin sugerencias → []` (API-09)
   - `GET usuario A con sugerencias → solo propias` (API-03 + API-09)

3. `20 – POST /api/sugerencias`
   - `POST válido → 201 + shape` (API-04 + API-10)
   - `POST payload inválido (sin campos / tipos erróneos) → 400` (API-05)
   - `POST strings vacíos (solo espacios) → 400` (API-06)
   - `POST sin sesión → 401` (API-02)
   - `POST con error de BD / RLS → 500` (API-08) [escenario avanzado]

4. `30 – RLS`
   - `GET usuario A no ve sugerencias de B` (API-11)
   - Prueba de inserción con `socio_id` distinto (si se hace vía Supabase directo) (API-12)

### 5.2 Asserts por tipo de request

En cada request de Postman se deben definir tests que validen:

- Status code esperado (`pm.response.code`).
- Shape básico del body:
  - `Array.isArray(...)` para GET 200.
  - Presencia de campos `id`, `titulo`, `contenido`, `estado`, `created_at` en 201.

- Mensajes de error esperados:
  - `"No hay sesión activa."` para 401.
  - `"Payload inválido. Se requiere titulo y contenido."` para body inválido.
  - `"Titulo y contenido son obligatorios."` para strings vacíos.
  - `"Error al obtener las sugerencias."` / `"Error al crear las sugerencias."` para errores 500.

---

## 6. Ejecución de F3b con Newman

En `package.json` se agregan:

- DevDependency:

npm install --save-dev newman

- Scripts:

```json
"scripts": {
  "test:api:f3b": "newman run postman/mvp-ag-rbb-buzon.postman_collection.json -e postman/mvp-ag-rbb-local.postman_environment.json"
}
```

- Ejecución local:

npm run test:api:f3b

- Requisitos:
  - App corriendo (npm run dev)

  - Environment mvp-ag-rbb-local con:
    - URLs correctas

    - credenciales de test

    - tokens generados (via folder 00 – Auth)

## 7. Trazabilidad con docs/qa_matrix.md

Los escenarios de F3b están alineados con los IDs de contrato definidos en docs/qa_matrix.md.

Tabla resumen:

| ID     | Endpoint              | Escenario básico                                            | Cubierto en F3b por…                                 |
| ------ | --------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| API-01 | GET /api/sugerencias  | 401 sin sesión                                              | Folder `10 – GET` · request "GET sin sesión"         |
| API-02 | POST /api/sugerencias | 401 sin sesión                                              | Folder `20 – POST` · "POST sin sesión"               |
| API-03 | GET /api/sugerencias  | Solo sugerencias propias (RLS lectura)                      | Folder `10 – GET` · "GET A con sugerencias"          |
| API-04 | POST /api/sugerencias | Crea sugerencia asociada a `auth.uid()`                     | Folder `20 – POST` · "POST válido → 201"             |
| API-05 | POST /api/sugerencias | Payload inválido (sin campos / tipos erróneos)              | Folder `20 – POST` · "POST payload inválido"         |
| API-06 | POST /api/sugerencias | Campos vacíos tras `trim()` → 400                           | Folder `20 – POST` · "POST strings vacíos"           |
| API-07 | GET /api/sugerencias  | Error BD → 500 + mensaje genérico                           | Folder `10 – GET` · escenario avanzado               |
| API-08 | POST /api/sugerencias | Error BD → 500 + mensaje genérico                           | Folder `20 – POST` · escenario avanzado              |
| API-09 | GET /api/sugerencias  | Respuesta siempre array (`[]` o con datos)                  | Folder `10 – GET` · casos vacío y con datos          |
| API-10 | POST /api/sugerencias | Respuesta 201 con shape estable (sin `socio_id`)            | Folder `20 – POST` · tests de shape                  |
| API-11 | RLS lectura           | Usuario A no ve sugerencias de B                            | Folder `30 – RLS` · GET con A y datos de B           |
| API-12 | RLS escritura         | No se puede insertar con `socio_id` distinto a `auth.uid()` | Folder `30 – RLS` · prueba específica (Supabase/SQL) |

- Cualquier cambio de contrato en:
  - app/api/sugerencias/route.ts,

  - migraciones 004, 005, 006,

debe reflejarse tanto en docs/qa_matrix.md como en esta tabla y en la colección Postman.

## 8. Checklist F3b

| Ítem                                                                  | Estado esperado al cerrar F3b |
| --------------------------------------------------------------------- | ----------------------------- |
| Colección Postman creada (`mvp-ag-rbb-buzon.postman_collection.json`) | ◐                             |
| Environment local creado (`mvp-ag-rbb-local`)                         | ◐                             |
| Estrategia de auth funcionando (tokens Supabase → cookies)            | ◐                             |
| Scripts `npm run test:api:f3b` configurados                           | ◐                             |
| Escenarios GET 401/200/array vacía/array con datos                    | ◐                             |
| Escenarios POST 201/400/401/500                                       | ◐                             |
| RLS lectura (A no ve datos de B)                                      | ◐                             |
| RLS escritura (insert inválido rechazado)                             | ◐                             |
| Trazabilidad actualizada en `docs/qa_matrix.md`                       | ◐                             |
| Integración con CI (F4) planificada pero no implementada              | ○                             |

Al finalizar F3b, todos los ítems anteriores deben estar marcados como ✔ en la versión actualizada de este documento.

---
