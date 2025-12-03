# `docs/qa_matrix.md`

## Matriz Contrato → Implementación → Pruebas

**MVP QA – AG RBB · Buzón de Sugerencias**  
Esta matriz conecta:

- Contratos funcionales del sistema (UI + API + RLS)
- Implementación real en código
- Pruebas UI (F3 · Cypress)
- Pruebas API previstas (F3b · Postman/Newman)
- Estado actual de cobertura

---

### Leyenda de estado

- ✔ → Cubierto
- ◐ → Parcialmente cubierto (UI o API) / pendiente robustecer
- ○ → Pendiente (planificado para F3b u otras fases)

---

## 1. Contratos UI / Auth / Rutas protegidas

| ID   | Tipo      | Contrato funcional                                                   | Implementación (archivo / zona)                                                          | Pruebas UI F3 (Cypress)                                              | Pruebas API F3b (Postman/Newman)                         | Estado |
| ---- | --------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------- | ------ |
| C-01 | UI / Auth | Login válido lleva de `/login` a `/buzon`.                           | Página `/login` (formulario) + lógica de submit (Supabase Auth) + redirect.              | `auth_buzon.cy.ts` · `login exitoso redirige a /buzon`.              | N/A                                                      | ✔     |
| C-02 | UI / Auth | Login inválido mantiene en `/login` y muestra error visible.         | Página `/login`: render de mensaje de error (contiene la palabra “credenciales”).        | `auth_buzon.cy.ts` · `login inválido...` (assert `/credenciales/i`). | Opcional: verificar código de error devuelto por Auth.   | ◐      |
| C-03 | UI / Auth | Acceso directo a `/buzon` sin sesión redirige a `/login`.            | `app/buzon/page.tsx`: `supabase.auth.getUser()` y `router.replace('/login')`.            | `auth_buzon.cy.ts` · `no permite acceder a /buzon sin sesión`.       | Ver API-01: `GET /api/sugerencias` sin sesión → 401.     | ✔     |
| C-04 | UI / Auth | Ante 401 en `/api/sugerencias` (refresh), la UI redirige a `/login`. | `fetchSugerencias()` en `BuzonPage`: `if (res.status === 401) router.replace('/login')`. | `refresh_sugerencias.cy.ts` · 401 en refresh → `/login`.             | API-01: `GET /api/sugerencias` con token inválido → 401. | ✔     |

---

## 2. Contratos UI / Lista y estados de carga

| ID      | Tipo        | Contrato funcional                                                              | Implementación (archivo / zona)                                                            | Pruebas UI F3 (Cypress)                                             | Pruebas API F3b (Postman/Newman)                           | Estado |
| ------- | ----------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ---------------------------------------------------------- | ------ |
| C-BZ-02 | UI / Lista  | La carga inicial de sugerencias se hace contra `GET /api/sugerencias`.          | `app/buzon/page.tsx`: `useEffect` → `fetchSugerencias()` tras sesión válida.               | Todos los tests de `refresh_sugerencias.cy.ts` esperan primer GET   | API-03/09: `GET /api/sugerencias` 200 (vacío o con datos). | ✔     |
| C-BZ-05 | UI / Lista  | El botón “Actualizar lista” hace un nuevo `GET /api/sugerencias`.               | Botón en `BuzonPage` con `onClick={fetchSugerencias}`.                                     | `refresh_sugerencias.cy.ts` · “vuelve a llamar a /api/sugerencias…” | API-03/09: mismo endpoint con varios escenarios.           | ✔     |
| C-BZ-06 | UI / Estado | Botón muestra “Actualizar lista” en reposo y “Actualizando…” mientras refresca. | `BuzonPage`: texto del botón según `loadingSugerencias`.                                   | `refresh_sugerencias.cy.ts` · assert “Actualizando…” y revertir.    | N/A                                                        | ✔     |
| C-BZ-07 | UI / Estado | En carga inicial con latencia se muestra “Cargando sugerencias...”.             | `BuzonPage`: `loadingSugerencias && !sugerencias.length`.                                  | `refresh_sugerencias.cy.ts` · test con delay en primer GET.         | N/A                                                        | ✔     |
| C-BZ-08 | UI / Lista  | Sin sugerencias, se muestra mensaje de estado vacío.                            | `BuzonPage`: texto “Aún no has registrado sugerencias…” cuando `sugerencias.length === 0`. | Sin test dedicado (comportamiento observado).                       | API-03/09: `GET /api/sugerencias` 200 → `[]`.              | ◐      |

---

## 3. Contratos UI / Formulario de sugerencias

| ID      | Tipo       | Contrato funcional                                                               | Implementación (archivo / zona)                                                                                                   | Pruebas UI F3 (Cypress)                                                            | Pruebas API F3b (Postman/Newman)                                               | Estado                                                       |
| ------- | ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------------------------------------- | ------- |
| C-BZ-09 | UI / Form  | Formulario no envía si título y contenido están vacíos (`trim`) y muestra error. | `BuzonPage.handleSubmit`: si `!tituloTrim                                                                                         |                                                                                    | !contenidoTrim`→`formError = "Título y contenido son obligatorios."`y`return`. | `sugerencias.cy.ts` · “no permite enviar sugerencia vacía…”. | API-06: `POST /api/sugerencias` con campos solo espacios → 400. | ✔ (UI) |
| C-BZ-10 | UI / Form  | Sugerencia válida: hace POST, se agrega al listado y limpia campos.              | `handleSubmit`: `fetch('/api/sugerencias', POST)`; en éxito agrega `creada` al inicio y hace `setTitulo('')`, `setContenido('')`. | `sugerencias.cy.ts` · “permite crear una sugerencia válida…” (presencia en lista). | API-04/10: `POST` válido 201 con shape correcto.                               | ◐                                                            |
| C-BZ-11 | UI / Form  | Error backend al crear: no limpia campos y muestra mensaje de error.             | `handleSubmit`: 400 ⇒ `formError = body.message`; otros errores ⇒ mensaje genérico.                                               | Sin test UI específico (solo happy-path + vacíos).                                 | API-08: `POST` con fallo en BD → 500 + mensaje.                                | ○                                                            |
| C-BZ-12 | UI / Auth  | Ante 401 al crear (sesión expirada), redirige a `/login`.                        | `handleSubmit`: si `res.status === 401` ⇒ `router.replace('/login')`.                                                             | Sin test UI específico.                                                            | API-02: `POST /api/sugerencias` sin sesión → 401.                              | ◐                                                            |
| C-BZ-13 | UI / Error | Error inesperado al cargar muestra mensaje genérico, sin borrar lista.           | `fetchSugerencias()`: `catch` ⇒ `sugerenciasError = 'Error inesperado al cargar las sugerencias.'` sin tocar `sugerencias`.       | Sin test UI específico (solo 500 controlado).                                      | API-07: forzar error inesperado (infra / permisos).                            | ◐                                                            |
| C-BZ-14 | UI / Error | Error inesperado al crear muestra “Error inesperado al crear la sugerencia.”     | `handleSubmit`: `catch` ⇒ `formError = 'Error inesperado al crear la sugerencia.'`.                                               | Sin test UI específico.                                                            | API-08: simular fallo inesperado (timeout / network).                          | ◐                                                            |

---

## 4. Contratos API / Auth y validación

| ID     | Tipo       | Contrato funcional                                               | Implementación (archivo / zona)                                                                              | Pruebas UI F3 (Cypress)                                      | Pruebas API F3b (Postman/Newman)                                           | Estado |
| ------ | ---------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------------------------------- | ------ |
| API-01 | API / Auth | `GET /api/sugerencias` sin sesión devuelve 401 + mensaje claro.  | `app/api/sugerencias/route.ts` · GET: si `authError` o `!user` ⇒ 401 `{ message: 'No hay sesión activa.' }`. | Indirecto: 401 en refresh ⇒ redirect a `/login`.             | `GET /api/sugerencias` sin token / token inválido ⇒ 401 + cuerpo esperado. | ◐      |
| API-02 | API / Auth | `POST /api/sugerencias` sin sesión devuelve 401 + mensaje claro. | `route.ts` · POST: mismo patrón de `auth.getUser()`.                                                         | Indirecto: `handleSubmit` redirige a `/login` si recibe 401. | `POST /api/sugerencias` sin token / token inválido ⇒ 401.                  | ◐      |

---

## 5. Contratos API / Datos y validaciones

| ID     | Tipo        | Contrato funcional                                                                     | Implementación (archivo / zona)                                                                                        | Pruebas UI F3 (Cypress)                                      | Pruebas API F3b (Postman/Newman)                                                        | Estado                              |
| ------ | ----------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------- | --- |
| API-03 | API / Datos | `GET /api/sugerencias` devuelve solo sugerencias del usuario autenticado (RLS).        | `route.ts` GET: `select('id, titulo, contenido, estado, created_at')` + RLS `sugerencias_select_own`.                  | UI siempre muestra “Tus sugerencias”.                        | Multiusuario: tokens A y B, cada uno ve solo sus filas.                                 | ○                                   |
| API-04 | API / Datos | `POST /api/sugerencias` crea sugerencia asociada a `auth.uid()`.                       | `route.ts` POST: `insert([{ socio_id: user.id, titulo, contenido }])` + RLS `sugerencias_insert_own`.                  | Creación en UI refleja nueva fila en buzón.                  | POST con token A ⇒ 201; verificar en DB que `socio_id = A.id` y que B no la ve por GET. | ◐                                   |
| API-05 | API / Valid | Payload inválido (sin `titulo`/`contenido` o tipos incorrectos) ⇒ 400 con mensaje.     | `route.ts` POST: body nulo / tipos no string ⇒ `400 { message: 'Payload inválido. Se requiere titulo y contenido.' }`. | UI no llega acá (valida antes).                              | POST `{}` o tipos erróneos ⇒ 400 + mensaje esperado.                                    | ○                                   |
| API-06 | API / Valid | `titulo`/`contenido` vacíos tras `trim()` ⇒ 400 con mensaje de obligatoriedad.         | `route.ts` POST: si `!titulo                                                                                           |                                                              | !contenido`⇒`400 { message: 'Titulo y contenido son obligatorios.' }`.                  | Mensaje coincide con validación UI. | POST `"titulo": "   "`, `"contenido": "   "` ⇒ 400. | ○   |
| API-09 | API / Shape | `GET /api/sugerencias` siempre responde un array JSON (vacío o con datos).             | `NextResponse.json(data ?? [], { status: 200 })`.                                                                      | UI recorre `sugerencias.map` y muestra estado vacío si `[]`. | GET sin filas ⇒ `[]`; con filas ⇒ array de objetos sin `socio_id`.                      | ◐                                   |
| API-10 | API / Shape | `POST /api/sugerencias` responde solo con `id, titulo, contenido, estado, created_at`. | `insert(...).select('id, titulo, contenido, estado, created_at').single()`.                                            | UI usa ese objeto para agregar la sugerencia a la lista.     | POST válido ⇒ body con esos campos y sin `socio_id`.                                    | ◐                                   |

---

## 6. Contratos API / Errores y RLS

| ID     | Tipo        | Contrato funcional                                                         | Implementación (archivo / zona)                                                                              | Pruebas UI F3 (Cypress)                                     | Pruebas API F3b (Postman/Newman)                                          | Estado |
| ------ | ----------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------- | ------ |
| API-07 | API / Error | Error al listar (DB) ⇒ 500 con mensaje genérico.                           | `route.ts` GET: si `error` ⇒ 500 `{ message: 'Error al obtener las sugerencias.' }`; `catch` ⇒ 500 genérico. | UI mapea a “No se pudieron cargar las sugerencias.”         | Forzar fallo en DB / permisos y validar mensaje.                          | ◐      |
| API-08 | API / Error | Error al crear (DB) ⇒ 500 con mensaje genérico.                            | `route.ts` POST: si `error` ⇒ 500 `{ message: 'Error al crear la sugerencia.' }`; `catch` ⇒ 500 genérico.    | UI muestra mensaje genérico en formulario.                  | Forzar fallo de INSERT (RLS / constraint) ⇒ 500 + mensaje.                | ◐      |
| API-11 | RLS / Read  | RLS impide leer sugerencias de otros usuarios.                             | `005_rls_policies_sugerencias.sql`: `policy "sugerencias_select_own" using (auth.uid() = socio_id)`.         | No hay escenario multiusuario en UI (se asume).             | Multiusuario: GET de A nunca devuelve filas con `socio_id` de B.          | ○      |
| API-12 | RLS / Write | RLS impide insertar sugerencias con `socio_id` distinto al usuario actual. | `005_rls_policies_sugerencias.sql`: `policy "sugerencias_insert_own" with check (auth.uid() = socio_id)`.    | UI nunca envía `socio_id` (lo fija el backend a `user.id`). | Intentos de inserción directa con `socio_id` ≠ `auth.uid()` deben fallar. | ○      |
