# Plan de pruebas Fase 2 – Buzón de sugerencias

Este documento define las pruebas mínimas para validar la Fase 2 del MVP QA – AG RBB: creación y listado de sugerencias para socios autenticados.

---

## 1. Alcance

Incluye:

- Flujo de login + acceso a `/buzon`.
- Creación de sugerencias desde la UI.
- Listado de sugerencias propias.
- Comportamiento sin sesión.
- Validaciones mínimas de payload en API.
- Verificación básica de RLS (aislamiento por usuario).

No incluye:

- Edición o eliminación de sugerencias.
- Roles administrativos.
- Integración con `/api/rag/ask`.
- Métricas y dashboards.

---

## 2. Precondiciones

- Proyecto levantado con `npm run dev`.
- Variables de entorno configuradas en `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Migraciones Fase 1 y Fase 2 ejecutadas en Supabase (tablas `socios` y `sugerencias` creadas).
- Al menos un usuario socio válido:
  - Existe en `auth.users`.
  - Tiene fila asociada en `public.socios`.

---

## 3. Pruebas manuales UI – `/login` + `/buzon`

### Caso UI-01 · Login exitoso

- **Dado** un usuario socio existente y confirmado.
- **Cuando** ingresa email y password correctos en `/login` y presiona “Ingresar”.
- **Entonces**:
  - Se muestra en consola `Login OK, user: ...`.
  - El navegador navega a `/buzon`.
  - No se producen redirecciones de vuelta a `/login`.

### Caso UI-02 · Login inválido

- **Dado** un usuario cualquiera.
- **Cuando** ingresa credenciales incorrectas en `/login`.
- **Entonces**:
  - Permanece en `/login`.
  - Se muestra mensaje de error en la página.

### Caso UI-03 · Acceso a `/buzon` sin sesión

- **Dado** un navegador sin cookies de sesión (modo incógnito o tras logout).
- **Cuando** visita directamente `/buzon`.
- **Entonces**:
  - Es redirigido a `/login`.
  - No se muestra contenido del buzón.

### Caso UI-04 · Crear sugerencia válida

- **Dado** un socio autenticado en `/buzon`.
- **Cuando** completa título y contenido en el formulario y envía.
- **Entonces**:
  - El formulario se limpia.
  - La nueva sugerencia aparece al inicio de la lista.
  - No se muestra mensaje de error.

### Caso UI-05 · Validación de campos vacíos

- **Dado** un socio autenticado en `/buzon`.
- **Cuando** intenta enviar el formulario con título o contenido vacío.
- **Entonces**:
  - No se envía la petición (no debería verse un request `POST /api/sugerencias` en Network).
  - Se muestra mensaje de error en la página.

### Caso UI-06 · Estado vacío

- **Dado** un socio autenticado sin sugerencias en la tabla.
- **Cuando** visita `/buzon`.
- **Entonces**:
  - La sección de lista muestra el mensaje de “Aún no has registrado sugerencias”.
  - No se muestran tarjetas vacías.

---

## 4. Pruebas manuales API – `/api/sugerencias`

Estas pruebas pueden realizarse con Postman / Thunder Client / curl, usando la cookie de sesión del navegador o ejecutándolas desde el mismo contexto autenticado.

### Caso API-01 · GET con sesión válida

- **Dado** un socio autenticado.
- **Cuando** realiza `GET /api/sugerencias`.
- **Entonces**:
  - Recibe `200 OK`.
  - El cuerpo es un array JSON.
  - Cada elemento contiene `id`, `titulo`, `contenido`, `estado`, `created_at`.

### Caso API-02 · GET sin sesión

- **Dado** un cliente sin cookies válidas.
- **Cuando** realiza `GET /api/sugerencias`.
- **Entonces**:
  - Recibe `401 Unauthorized`.
  - El cuerpo contiene `{ "message": "No hay sesión activa." }`.

### Caso API-03 · POST válido

- **Dado** un socio autenticado.
- **Cuando** realiza `POST /api/sugerencias` con body:

  ```json
  { "titulo": "Test QA", "contenido": "Contenido de prueba" }
  ```

* **Entonces**:
  - Recibe `201 Created`.
  - El cuerpo contiene la sugerencia creada (`id`, `estado`, `created_at`, etc.).
  - La fila aparece en la tabla `sugerencias` en Supabase.

### Caso API-04 · POST con payload inválido

- **Dado** un socio autenticado.
- **Cuando** realiza `POST /api/sugerencias` con body (o tipos incorrectos):

  ```json
  { "titulo": "", "contenido": "" }
  ```

- **Entonces**:
  - Recibe `400 Bad Request`.
  - El mensaje indica problema de payload o campos obligatorios.

### Caso API-05 · POST sin sesión

- **Dado** un cliente sin sesión.
- **Cuando** realiza `POST /api/sugerencias`.
- **Entonces**:
  - Recibe `401 Unauthorized`.

---

## 5. Pruebas de RLS – aislamiento por usuario

Estas pruebas pueden hacerse en el SQL editor de Supabase usando `auth.uid()` o desde APIs con distintos usuarios.

### Caso RLS-01 · Lectura propia

- **Dado** un usuario A con sugerencias creadas.
- **Cuando** ejecuta un `GET /api/sugerencias` autenticado como A.
- **Entonces**:
  - Solo ve sus propias sugerencias (todas con `socio_id = A.id`).

### Caso RLS-02 · Lectura cruzada bloqueada

- **Dado** un usuario A con sugerencias y un usuario B distinto.
- **Cuando** B ejecuta `GET /api/sugerencias`.
- **Entonces**:
  - No ve sugerencias de A.
  - Dependiendo del contexto, ve solo sus propias sugerencias o arreglo vacío.

### Caso RLS-03 · Insert con socio_id manipulado (SQL directo)

- **Dado** políticas RLS activas en `sugerencias`.
- **Cuando** se intenta un `INSERT` manual con `socio_id` distinto de `auth.uid()`.
- **Entonces**:
  - El INSERT falla por política de seguridad.

---

## 6. Mapeo a automatización futura (F3 / F3b)

### UI (Cypress/Playwright)

Casos candidatos:

- UI-01 Login exitoso.
- UI-02 Login inválido.
- UI-03 Protección de `/buzon`.
- UI-04 Crear sugerencia válida y ver actualización de lista.
- UI-05 Validación de campos vacíos.
- UI-06 Estado vacío para nuevos usuarios.

### API (Postman / Supertest)

Casos candidatos:

- API-01 GET con sesión.
- API-02 GET sin sesión.
- API-03 POST válido.
- API-04 POST inválido.
- API-05 POST sin sesión.

### RLS (SQL tests)

Casos candidatos:

- RLS-01, RLS-02 y RLS-03 como scripts SQL que pueden integrarse a una suite de pruebas de base de datos.

---

## 7. Criterios de aceptación Fase 2

La Fase 2 se considera aceptada cuando:

- Todos los casos UI-01 a UI-06 se cumplen manualmente.
- Todos los casos API-01 a API-05 se cumplen manualmente.
- Se verifica al menos un escenario de aislamiento RLS entre dos usuarios.
- `npm run build` compila sin errores.
- La documentación de rutas y APIs está actualizada (`docs/rutas_f2.md`, `docs/api_sugerencias.md`).

---
