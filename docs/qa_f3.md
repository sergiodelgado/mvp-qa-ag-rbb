# `docs/qa_f3.md`

## Pruebas UI · Cypress · Fase 3

**MVP QA – AG RBB · Buzón de Sugerencias**

Este documento describe el alcance, configuración y evidencia de la **Fase 3 (QA UI con Cypress)** para el MVP del **Buzón de Sugerencias**.

Las pruebas son **end-to-end de interfaz** sobre la aplicación real (**Next.js + Supabase**), usando:

- UI real (`/login`, `/buzon`)
- Backend real (`/api/sugerencias`)
- RLS activas en Supabase sobre `socios` y `sugerencias`

---

## 1. Alcance de la Fase 3 (UI)

Cobertura UI E2E sobre:

- Registro y login (flujo básico de acceso)
- Acceso protegido a rutas
- Flujo principal del buzón de sugerencias:
  - carga inicial de sugerencias propias
  - creación de nuevas sugerencias
  - validaciones de campos en el formulario
  - refresco manual de la lista
  - manejo de errores de backend en carga/refresh (500)
  - manejo de sesión expirada (401) en la UI
  - estados de carga (“Cargando sugerencias…”) y botón (“Actualizando…”)

Fuera de alcance en F3 (se dejan explícitos para F3b+):

- Actualización/edición de sugerencias
- Eliminación de sugerencias
- Pruebas de API puras (sin navegador)
- Validación directa de políticas RLS en la base de datos (multiusuario / manipulación de `socio_id`)

---

## 2. Estructura Cypress

Estructura relevante:

cypress/
e2e/
auth_buzon.cy.ts
sugerencias.cy.ts
refresh_sugerencias.cy.ts
fixtures/
support/
credentials.ts
cypress.config.ts

Rol de cada spec:

cypress/e2e/auth_buzon.cy.ts → login y protección de /buzon

cypress/e2e/sugerencias.cy.ts → flujo del formulario de sugerencias (crear + validaciones)

cypress/e2e/refresh_sugerencias.cy.ts → carga inicial, refresh, estados de carga y manejo de errores/401

---

## 3. Specs implementados

### 3.1 auth_buzon.cy.ts

Prueba login y protección de rutas del buzón.

| Test                                                           | Descripción                                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `login exitoso redirige a /buzon`                              | Con `EMAIL_VALID` / `PASSWORD_VALID` desde `support/credentials`, el usuario pasa de `/login` a `/buzon` y ve “Buzón de sugerencias”. |
| `login inválido mantiene al usuario en /login y muestra error` | Con contraseña incorrecta, el usuario permanece en `/login` y se muestra un mensaje de error que contiene la palabra “credenciales”.  |
| `no permite acceder a /buzon sin sesión (redirige a /login)`   | Acceder directo a `/buzon` sin sesión redirige a `/login`.                                                                            |

Contratos cubiertos (Auth + acceso protegido):

Solo usuarios con credenciales válidas acceden a /buzon.

Los errores de autenticación son visibles en la UI.

Intentar acceder a /buzon sin sesión redirige a /login.

### 3.2 sugerencias.cy.ts

Prueba el flujo principal del formulario del buzón.

| Test                                                            | Descripción                                                                                                                      |
| --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `permite crear una sugerencia válida y verla en el listado`     | Tras login, se completa `#titulo` y `#contenido`, se envía el formulario y el título único aparece en el listado de sugerencias. |
| `no permite enviar sugerencia vacía y muestra mensaje de error` | Con `#titulo` y `#contenido` vacíos, se hace submit y aparece el mensaje “Título y contenido son obligatorios.” en la UI.        |

Contratos cubiertos (Formulario):

Una sugerencia válida se refleja en el listado del buzón.

Sugerencias vacías no se envían y muestran el mensaje de error esperado.

La validación de campos vacíos se hace en UI (antes de llamar a la API).

### 3.3 refresh_sugerencias.cy.ts

Pruebas específicas de carga y refresco de la lista, y manejo de errores.

| Test                                                                             | Descripción                                                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vuelve a llamar a /api/sugerencias al presionar "Actualizar lista"`             | Intercepta `GET /api/sugerencias`, verifica llamada inicial al entrar a `/buzon`, luego hace click en “Actualizar lista” y se observa una segunda llamada. Además verifica que el botón muestre “Actualizando…” durante el fetch y vuelva a “Actualizar lista” al finalizar. |
| `muestra mensaje de error cuando /api/sugerencias responde 500 al refrescar`     | Tras una carga inicial exitosa, el refresco se intercepta con `500`. La UI muestra “No se pudieron cargar las sugerencias.” y mantiene la cantidad de items en el listado.                                                                                                   |
| `redirige a /login si /api/sugerencias responde 401 al refrescar`                | En el refresco se simula respuesta `401` con body `{ message: 'No hay sesión activa.' }` y la UI redirige a `/login`.                                                                                                                                                        |
| `muestra "Cargando sugerencias..." mientras se cargan las sugerencias iniciales` | El primer `GET /api/sugerencias` se intercepta con latencia. Durante la espera aparece el texto “Cargando sugerencias...” y desaparece cuando la respuesta llega.                                                                                                            |

Contratos cubiertos (Lista + refresh):

La lista inicial se carga desde /api/sugerencias.

El botón “Actualizar lista” vuelve a llamar a /api/sugerencias.

Durante el refresco se muestra “Actualizando…” en el botón.

Los errores 500 en refresh muestran mensaje de error y no vacían la lista.

Los 401 en refresh redirigen a /login.

Durante la carga inicial con latencia se muestra “Cargando sugerencias…”.

---

````markdown
## 4. Comandos para ejecutar las pruebas

Desde la raíz del repositorio:

### 4.1 Modo interactivo

```bash
npx cypress open
```
````

Seleccionar:

- `cypress/e2e/auth_buzon.cy.ts`
- `cypress/e2e/sugerencias.cy.ts`
- `cypress/e2e/refresh_sugerencias.cy.ts`

### 4.2 Modo headless

```bash
npx cypress run --spec \
 cypress/e2e/auth_buzon.cy.ts,\
 cypress/e2e/sugerencias.cy.ts,\
 cypress/e2e/refresh_sugerencias.cy.ts
```

Salida esperada (resumen):

- Specs: 3
- Tests: 9
- **All specs passed!**

Este comando es la base para integrar Cypress en CI (Fase 4 · CI/CD).

---

## 5. Requisitos de ejecución

### 5.1 Entorno local

- Node.js 20+ / 22+
- Dependencias instaladas:

```bash
npm install
```

Variables en `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
  (usada por el backend; las pruebas UI no la llaman directamente, pero la API sí).

Supabase configurado con:

- tabla `socios`
- tabla `sugerencias`
- RLS activas en ambas tablas

Migraciones necesarias:

- `004_create_sugerencias.sql`
- `005_rls_policies_sugerencias.sql`
- `006_indexes_sugerencias.sql`

### 5.2 Usuario para pruebas

Debe existir un usuario válido en Auth y socios, utilizado en los specs vía `EMAIL_VALID` y `PASSWORD_VALID`:

- **email:** `test@example.com`
- **password:** `Test1234!`

En `cypress/support/credentials.ts` se definen:

```ts
EMAIL_VALID
PASSWORD_VALID
```

### 5.3 Servidor local

La app debe estar corriendo en:

```
http://localhost:3000
```

Comando:

```bash
npm run dev
```

En `cypress.config.ts` debe estar definido:

```ts
baseUrl: 'http://localhost:3000'
```

---

## 6. Contrato funcional validado en F3 (UI)

### 6.1 Login y rutas protegidas

#### `/login`

- Con credenciales válidas (`EMAIL_VALID`, `PASSWORD_VALID`):
  - redirige a `/buzon`.

- Con contraseña inválida:
  - mantiene `/login`,
  - muestra mensaje que contiene “credenciales”.

#### `/buzon`

- Acceso directo sin sesión:
  - redirige a `/login`.

- Acceso tras login válido:
  - muestra “Buzón de sugerencias”.

### 6.2 Buzón de sugerencias (UI)

**Carga inicial:**

- La página llama a `GET /api/sugerencias`.
- Mientras no llega respuesta:
  - muestra “Cargando sugerencias...”.

- Al recibir datos:
  - desaparece el mensaje,
  - renderiza lista o estado vacío.

**Estado vacío:**

> “Aún no has registrado sugerencias. Parte creando la primera arriba.”

**Botón “Actualizar lista”:**

- Estado normal: “Actualizar lista”.
- Al hacer click:
  - dispara nuevo `GET /api/sugerencias`,
  - botón muestra “Actualizando…”.

- Al terminar:
  - vuelve a “Actualizar lista”.

**Errores al refrescar:**

- `500`:
  - muestra “No se pudieron cargar las sugerencias.”
  - lista anterior se mantiene.

- `401` (sesión expirada):
  - redirige a `/login`.

### 6.3 Formulario de sugerencias (UI)

Campos:

- `#titulo`
- `#contenido`

**Validación:**

- Si ambos están vacíos:
  - no envía,
  - muestra: “Título y contenido son obligatorios.”

**Flujo feliz:**

- Con título y contenido:
  - hace `POST /api/sugerencias`,
  - agrega nueva sugerencia al inicio de la lista,
  - aparece el título único usado en test
    (“Sugerencia Cypress {timestamp}”).

_(En F3 solo se valida aparición en lista, no vaciado de inputs.)_

### 6.4 API + RLS (desde la UI)

Endpoint: `app/api/sugerencias/route.ts`

#### `GET /api/sugerencias`

- Requiere sesión.
- Sin sesión: `401 { message: "No hay sesión activa." }`
- Con sesión:
  `200` con array:

```json
[
  {
    "id": "...",
    "titulo": "...",
    "contenido": "...",
    "estado": "...",
    "created_at": "..."
  }
]
```

RLS garantiza que solo se leen filas del `socio_id = auth.uid()`.

#### `POST /api/sugerencias`

Requiere sesión.

Body esperado:

```json
{
  "titulo": "string",
  "contenido": "string"
}
```

Errores:

- Body inválido → `400 "Payload inválido. Se requiere titulo y contenido."`
- Campos vacíos → `400 "Titulo y contenido son obligatorios."`

En éxito:

- Inserta fila con `socio_id = user.id`
- Devuelve `201` con:

```json
{ "id": "...", "titulo": "...", "contenido": "...", "estado": "...", "created_at": "..." }
```

Errores de BD → `500`.

#### RLS activo en `public.sugerencias`

Política de lectura:

```sql
create policy "sugerencias_select_own"
on public.sugerencias
for select
using ( auth.uid() = socio_id );
```

Política de inserción:

```sql
create policy "sugerencias_insert_own"
on public.sugerencias
for insert
with check ( auth.uid() = socio_id );
```

En F3 estas reglas se validan indirectamente (UI + E2E).
La validación estricta ocurre en F3b (API tests).

---

## 7. Matriz Contrato → Implementación → Pruebas

La siguiente matriz conecta el contrato funcional del buzón de sugerencias
con su implementación real en código, las pruebas UI de F3 (Cypress)
y los escenarios previstos para F3b (API · Postman/Newman).

| ID      | Tipo        | Contrato funcional                                                                                   | Implementación (archivo / zona)                                                                                                        | Prueba UI F3 (Cypress)                                                                 | Prueba API F3b (Postman/Newman)                                                                            | Estado                                                                         |
| ------- | ----------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ------- |
| C-01    | UI / Auth   | Login válido lleva de `/login` a `/buzon`.                                                           | Página `/login` + lógica de submit (Supabase Auth) + redirección a `/buzon`.                                                           | `auth_buzon.cy.ts` · `login exitoso redirige a /buzon`.                                | N/A                                                                                                        | ✔                                                                             |
| C-02    | UI / Auth   | Login inválido mantiene en `/login` y muestra error visible.                                         | Página `/login`: render de mensaje de error (contiene “credenciales”).                                                                 | `auth_buzon.cy.ts` · `login inválido...` (assert `/credenciales/i`).                   | F3b opcional: revisar código de error devuelto por Auth.                                                   | ◐                                                                              |
| C-03    | UI / Auth   | Acceso directo a `/buzon` sin sesión redirige a `/login`.                                            | `app/buzon/page.tsx`: `supabase.auth.getUser()` y `router.replace('/login')` si no hay usuario.                                        | `auth_buzon.cy.ts` · `no permite acceder a /buzon sin sesión`.                         | API: `GET /api/sugerencias` sin sesión → 401 (ver API-01).                                                 | ✔                                                                             |
| C-04    | UI / Auth   | Ante 401 en `/api/sugerencias` (refresh), la UI redirige a `/login`.                                 | `fetchSugerencias()` en `BuzonPage`: si `res.status === 401` ⇒ `router.replace('/login')`.                                             | `refresh_sugerencias.cy.ts` · test 401 en refresh → `/login`.                          | API-01: `GET /api/sugerencias` con token inválido → 401.                                                   | ✔                                                                             |
| C-BZ-02 | UI / Lista  | La carga inicial de sugerencias se hace contra `GET /api/sugerencias`.                               | `useEffect` en `BuzonPage` → `fetchSugerencias()` tras sesión válida.                                                                  | Todos los tests de `refresh_sugerencias.cy.ts` esperan la primera llamada GET.         | API-03/09: `GET /api/sugerencias` 200 devuelve array (vacío o con datos).                                  | ✔                                                                             |
| C-BZ-05 | UI / Lista  | Botón “Actualizar lista” hace un nuevo `GET /api/sugerencias`.                                       | Botón en `BuzonPage` con `onClick={fetchSugerencias}`.                                                                                 | `refresh_sugerencias.cy.ts` · “vuelve a llamar a /api/sugerencias…”.                   | API-03/09: mismo endpoint probado con varios escenarios.                                                   | ✔                                                                             |
| C-BZ-06 | UI / Estado | Botón muestra “Actualizar lista” en reposo y “Actualizando…” mientras refresca.                      | Texto del botón depende de `loadingSugerencias` en `BuzonPage`.                                                                        | `refresh_sugerencias.cy.ts` · assert de “Actualizando…” y vuelta a “Actualizar lista”. | N/A                                                                                                        | ✔                                                                             |
| C-BZ-07 | UI / Estado | En carga inicial con latencia se muestra “Cargando sugerencias...”.                                  | Condición `loadingSugerencias && !sugerencias.length` en `BuzonPage`.                                                                  | `refresh_sugerencias.cy.ts` · test con delay en primer GET.                            | N/A                                                                                                        | ✔                                                                             |
| C-BZ-08 | UI / Lista  | Si no hay sugerencias, se muestra mensaje de estado vacío (sin romper layout).                       | En `BuzonPage`: bloque “Aún no has registrado sugerencias...” cuando `sugerencias.length === 0` sin error ni loading.                  | Implícito (no hay test dedicado; se ve según datos).                                   | API-03/09: `GET /api/sugerencias` 200 → `[]` para usuario sin datos.                                       | ◐                                                                              |
| C-BZ-09 | UI / Form   | Formulario no envía si título y contenido están vacíos (tras `trim`) y muestra mensaje de error.     | `handleSubmit` en `BuzonPage`: si `!tituloTrim                                                                                         |                                                                                        | !contenidoTrim`⇒`formError = "Título y contenido son obligatorios."`y`return`.                             | `sugerencias.cy.ts` · “no permite enviar sugerencia vacía…”.                   | API-06: `POST /api/sugerencias` con campos solo espacios → 400.                  | ✔ (UI) |
| C-BZ-10 | UI / Form   | Sugerencia válida: hace POST, se agrega al listado y limpia campos.                                  | `handleSubmit`: POST a `/api/sugerencias`; en éxito agrega `creada` al inicio y hace `setTitulo('')`, `setContenido('')`.              | `sugerencias.cy.ts` · “permite crear una sugerencia válida… (aparece en listado)”.     | API-04/10: `POST` válido 201 + body con `id, titulo, contenido, estado, created_at`.                       | ◐                                                                              |
| C-BZ-11 | UI / Form   | Error backend al crear: no limpia campos y muestra mensaje de error.                                 | `handleSubmit`: 400 ⇒ `formError = body.message`; otros errores ⇒ `formError = 'Error al crear la sugerencia.'` o “Error inesperado…”. | Sin test específico aún (solo flujo feliz y campos vacíos).                            | API-08: `POST` con fallo en BD → 500 + mensaje genérico.                                                   | ○                                                                              |
| C-BZ-12 | UI / Auth   | Ante 401 al crear (sesión expirada), redirige a `/login`.                                            | `handleSubmit`: si `res.status === 401` ⇒ `router.replace('/login')`.                                                                  | No hay test UI dedicado.                                                               | API-02: `POST /api/sugerencias` sin sesión → 401.                                                          | ◐                                                                              |
| C-BZ-13 | UI / Error  | Error inesperado al cargar muestra mensaje genérico, sin borrar lista.                               | `fetchSugerencias()`: `catch` ⇒ `sugerenciasError = 'Error inesperado al cargar las sugerencias.'` sin tocar `sugerencias`.            | No hay test directo de error inesperado (solo 500 controlado).                         | API-07: forzar error inesperado (infra / caída) para ver diferencia de mensaje.                            | ◐                                                                              |
| C-BZ-14 | UI / Error  | Error inesperado al crear muestra “Error inesperado al crear la sugerencia.”.                        | `handleSubmit`: `catch` ⇒ `formError = 'Error inesperado al crear la sugerencia.'`.                                                    | Sin test UI.                                                                           | API-08: simular fallo inesperado (timeout / network).                                                      | ◐                                                                              |
| API-01  | API / Auth  | `GET /api/sugerencias` sin sesión devuelve 401 + mensaje claro.                                      | `route.ts` GET: si `authError                                                                                                          |                                                                                        | !user`⇒`401 { message: 'No hay sesión activa.' }`.                                                         | Indirecto: `refresh_sugerencias.cy.ts` 401 refresh → `/login`.                 | F3b: `GET /api/sugerencias` sin token o token inválido ⇒ 401 + mensaje esperado. | ◐       |
| API-02  | API / Auth  | `POST /api/sugerencias` sin sesión devuelve 401 + mensaje claro.                                     | `route.ts` POST: mismo patrón de `auth.getUser()`.                                                                                     | Indirecto: `handleSubmit` redirige a `/login` si recibe 401.                           | F3b: `POST /api/sugerencias` sin token / token inválido ⇒ 401.                                             | ◐                                                                              |
| API-03  | API / Datos | `GET /api/sugerencias` devuelve solo sugerencias del usuario autenticado (RLS).                      | `route.ts` GET: `select(...)` sin filtro por socio, apoyado en RLS `sugerencias_select_own (auth.uid() = socio_id)`.                   | UI siempre muestra “Tus sugerencias” del usuario logueado.                             | F3b multiusuario: A y B con datos distintos ⇒ GET de A no ve filas de B.                                   | ○                                                                              |
| API-04  | API / Datos | `POST /api/sugerencias` crea sugerencia asociada al usuario (`socio_id = auth.uid()`).               | `route.ts` POST: `insert([{ socio_id: user.id, titulo, contenido }])` + RLS `sugerencias_insert_own`.                                  | `sugerencias.cy.ts` ve que la sugerencia aparece en UI tras crearla.                   | F3b: POST con token A ⇒ 201; ver en DB que `socio_id = A.id` y que GET de B no la ve.                      | ◐                                                                              |
| API-05  | API / Valid | Payload inválido (sin `titulo`/`contenido` o tipos incorrectos) devuelve 400 con mensaje específico. | `route.ts` POST: body nulo / tipos no string ⇒ `400 { message: 'Payload inválido. Se requiere titulo y contenido.' }`.                 | UI no llega a este caso (valida antes), solo API directa.                              | F3b: POST `{}` / tipos erróneos ⇒ 400 + mensaje esperado.                                                  | ○                                                                              |
| API-06  | API / Valid | `titulo`/`contenido` vacíos tras `trim()` devuelven 400 con mensaje de obligatoriedad.               | `route.ts` POST: si `!titulo                                                                                                           |                                                                                        | !contenido`⇒`400 { message: 'Titulo y contenido son obligatorios.' }`.                                     | UI corta antes (campos vacíos en formulario), pero el mensaje coincide con UI. | F3b: POST con `"titulo": "   "`, `"contenido": "   "` ⇒ 400 + mensaje esperado.  | ○       |
| API-07  | API / Error | Error al listar (DB) devuelve 500 con mensaje genérico.                                              | `route.ts` GET: si `error` en select ⇒ 500 `{ message: 'Error al obtener las sugerencias.' }`; `catch` ⇒ 500 genérico.                 | UI mapea 500 en refresh a “No se pudieron cargar las sugerencias.”                     | F3b: forzar fallo en DB / permisos para ver 500 y mensaje.                                                 | ◐                                                                              |
| API-08  | API / Error | Error al crear (DB) devuelve 500 con mensaje genérico.                                               | `route.ts` POST: si `error` en insert ⇒ 500 `{ message: 'Error al crear la sugerencia.' }`; `catch` ⇒ 500 genérico.                    | UI mapea `!res.ok` a error en formulario (mensaje genérico).                           | F3b: forzar fallo de INSERT (RLS / constraint) ⇒ 500 + mensaje.                                            | ◐                                                                              |
| API-09  | API / Shape | `GET /api/sugerencias` siempre responde un array JSON (vacío o con datos).                           | `NextResponse.json(data ?? [], { status: 200 })`.                                                                                      | UI recorre `sugerencias.map` y muestra estado vacío si `[]`.                           | F3b: `GET` sin filas ⇒ `[]`; con filas ⇒ array de objetos sin `socio_id` en payload.                       | ◐                                                                              |
| API-10  | API / Shape | `POST /api/sugerencias` responde solo con `id, titulo, contenido, estado, created_at`.               | `select('id, titulo, contenido, estado, created_at').single()` en INSERT.                                                              | UI usa ese objeto para agregar la sugerencia al inicio de la lista.                    | F3b: POST válido ⇒ body con esos campos y sin `socio_id`.                                                  | ◐                                                                              |
| API-11  | RLS / Read  | RLS impide leer sugerencias de otros usuarios.                                                       | `sugerencias_select_own` en SQL: `for select using (auth.uid() = socio_id)`.                                                           | UI no tiene escenario multiusuario; asume correcto.                                    | F3b multiusuario: comprobar que GET con token A solo devuelve filas con `socio_id = auth.uid()`.           | ○                                                                              |
| API-12  | RLS / Write | RLS impide insertar sugerencias con `socio_id` distinto al usuario autenticado.                      | `sugerencias_insert_own` en SQL: `for insert with check (auth.uid() = socio_id)`.                                                      | UI nunca manda `socio_id`; lo fija el backend a `user.id`.                             | F3b: probar inserciones directas (SQL / otro client) con `socio_id` ≠ `auth.uid()` ⇒ deben ser rechazadas. | ○                                                                              |

---

## 8. Checklist QA F3 (UI) – Estado actual

| Ítem                                                                          | Estado            | Comentario breve                                                        |
| ----------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| Specs UI Cypress creados (`auth_buzon`, `sugerencias`, `refresh_sugerencias`) | ✔                | 3 archivos E2E claramente separados por responsabilidad.                |
| Pruebas happy-path login + acceso a `/buzon`                                  | ✔                | Login válido → `/buzon`.                                                |
| Validación de errores de login                                                | ✔ (texto frágil) | Busca “credenciales” en mensaje. Se puede robustecer con `data-testid`. |
| Validaciones de formulario de sugerencias (campos vacíos)                     | ✔                | Mensaje “Título y contenido son obligatorios.” validado.                |
| Creación de sugerencia válida (reflejada en listado)                          | ✔                | Verifica aparición del título creado.                                   |
| Manejo de errores en refresh (500)                                            | ✔                | Mensaje mostrado y lista previa preservada.                             |
| Manejo de sesión expirada (401) en refresh                                    | ✔                | Refresh 401 → redirect a `/login`.                                      |
| Estado de carga inicial (`Cargando sugerencias...`)                           | ✔                | Validado con latencia simulada.                                         |
| Botón “Actualizar lista” / “Actualizando…”                                    | ✔                | Cambio de texto comprobado.                                             |
| Ejecución headless reproducible (`npx cypress run --spec ...`)                | ✔                | Comando documentado y usado como base para CI.                          |
| Documentación de F3 (este archivo)                                            | ✔                | Alcance, estructura, contrato y evidencias descritos.                   |
| Manejo de errores al crear sugerencias (400/500 backend)                      | ◐                 | Implementado en código, pero aún sin test UI específico de error.       |

## 9. Limitaciones conscientes en F3 (UI)

En esta fase no existe cobertura UI sobre **update/delete** de sugerencias.

No se prueban explícitamente:

- Respuestas **400/500** de `POST /api/sugerencias` desde la UI  
  (la UI muestra mensajes genéricos y en F3 no se testean estos bordes).

No se cubren escenarios multiusuario desde UI:

- La validación del RLS (filtrado por `socio_id`) se delega a **F3b (API)** y a las migraciones.

Tampoco se validan aún:

- Headers HTTP
- Estructura completa del payload de respuesta
- Tiempos de respuesta ni SLOs  
  (se asume entorno local estable para F3).

---

## 10. Próximo paso: F3b (API Tests · Postman/Newman)

La siguiente fase se centra en **pruebas de API** y verificación directa del **contrato de datos** y **RLS** para `/api/sugerencias`.

Los escenarios clave que deben quedar documentados en `docs/qa_f3b.md` son:

### GET /api/sugerencias

- **200**: lista de sugerencias propias  
  (validar estructura completa del array).
- **200**: usuario sin sugerencias → `[]`.
- **401**: sin sesión / token inválido →  
  `{ "message": "No hay sesión activa." }`.

**Multiusuario**:

- Usuario A no debe ver sugerencias de usuario B  
  (RLS efectiva).

### POST /api/sugerencias

- **201** creación válida:  
  `titulo` + `contenido` generan una fila con `socio_id = auth.uid()`.

- **400** body inválido o tipos incorrectos:
  - falta de `titulo` o `contenido`
  - tipos no string

- **400** titulo o contenido vacíos tras `trim()`.

- **401** sin sesión / token inválido.

- **500** error en inserción (fallo RLS o constraint) →  
  respuesta controlada.

---

Los resultados de F3b se documentarán en un archivo separado  
(por ejemplo `docs/qa_f3b.md`) y se integrarán en CI/CD en fases siguientes.

---
