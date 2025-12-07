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

La matriz completa que vincula:

- contratos funcionales (UI + API + RLS),
- implementación real en código,
- pruebas UI (F3 · Cypress),
- pruebas API planificadas (F3b · Postman/Newman),

se encuentra en el archivo:

- `docs/qa_matrix.md` (fuente única de verdad, se evita duplicar la matriz aquí).

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
