# `docs/qa_f3.md`

## Pruebas UI · Cypress · Fase 3

**MVP QA – AG RBB · Buzón de Sugerencias**

Este documento describe el alcance, configuración y evidencia de la **Fase 3 (QA UI con Cypress)** para el MVP del **Buzón de Sugerencias**.

Las pruebas son **end-to-end de interfaz** sobre la aplicación real (**Next.js + Supabase**), usando:

- UI real (`/login`, `/buzon`)
- Backend real (`/api/sugerencias`)
- RLS activas en Supabase sobre `socios` y `sugerencias`

---

# 1. Alcance de la Fase 3 (UI)

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

# 2. Estructura Cypress

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

3. Specs implementados

3.1 auth_buzon.cy.ts
Prueba login y protección de rutas del buzón.

Test Descripción
login exitoso redirige a /buzon Con EMAIL_VALID / PASSWORD_VALID desde support/credentials, el usuario pasa de /login a /buzon y ve “Buzón de sugerencias”.
login inválido mantiene al usuario en /login y muestra error Con contraseña incorrecta, el usuario permanece en /login y se muestra un mensaje de error que contiene la palabra “credenciales”.
no permite acceder a /buzon sin sesión (redirige a /login) Acceder directo a /buzon sin sesión redirige a /login.

Contratos cubiertos (Auth + acceso protegido):

Solo usuarios con credenciales válidas acceden a /buzon.

Los errores de autenticación son visibles en la UI.

Intentar acceder a /buzon sin sesión redirige a /login.

3.2 sugerencias.cy.ts
Prueba el flujo principal del formulario del buzón.

Test Descripción
permite crear una sugerencia válida y verla en el listado Tras login, se completa #titulo y #contenido, se envía el formulario y el título único aparece en el listado de sugerencias.
no permite enviar sugerencia vacía y muestra mensaje de error Con #titulo y #contenido vacíos, se hace submit y aparece el mensaje “Título y contenido son obligatorios.” en la UI.

Contratos cubiertos (Formulario):

Una sugerencia válida se refleja en el listado del buzón.

Sugerencias vacías no se envían y muestran el mensaje de error esperado.

La validación de campos vacíos se hace en UI (antes de llamar a la API).

3.3 refresh_sugerencias.cy.ts
Pruebas específicas de carga y refresco de la lista, y manejo de errores.

Test Descripción
vuelve a llamar a /api/sugerencias al presionar "Actualizar lista" Intercepta GET /api/sugerencias, verifica llamada inicial al entrar a /buzon, luego hace click en “Actualizar lista” y se observa una segunda llamada. Además verifica que el botón muestre “Actualizando…” durante el fetch y vuelva a “Actualizar lista” al finalizar.
muestra mensaje de error cuando /api/sugerencias responde 500 al refrescar Tras una carga inicial exitosa, el refresco se intercepta con 500. La UI muestra “No se pudieron cargar las sugerencias.” y mantiene la cantidad de items en el listado.
redirige a /login si /api/sugerencias responde 401 al refrescar En el refresco se simula respuesta 401 con body { message: 'No hay sesión activa.' } y la UI redirige a /login.
muestra "Cargando sugerencias..." mientras se cargan las sugerencias iniciales El primer GET /api/sugerencias se intercepta con latencia. Durante la espera aparece el texto “Cargando sugerencias...” y desaparece cuando la respuesta llega.

Contratos cubiertos (Lista + refresh):

La lista inicial se carga desde /api/sugerencias.

El botón “Actualizar lista” vuelve a llamar a /api/sugerencias.

Durante el refresco se muestra “Actualizando…” en el botón.

Los errores 500 en refresh muestran mensaje de error y no vacían la lista.

Los 401 en refresh redirigen a /login.

Durante la carga inicial con latencia se muestra “Cargando sugerencias…”.

4. Comandos para ejecutar las pruebas
   Desde la raíz del repositorio:

4.1 Modo interactivo
bash
Copiar código
npx cypress open
Seleccionar:

cypress/e2e/auth_buzon.cy.ts

cypress/e2e/sugerencias.cy.ts

cypress/e2e/refresh_sugerencias.cy.ts

4.2 Modo headless

npx cypress run --spec \
 cypress/e2e/auth_buzon.cy.ts,\
 cypress/e2e/sugerencias.cy.ts,\
 cypress/e2e/refresh_sugerencias.cy.ts

Salida esperada (resumen):

Specs: 3
Tests: 9
All specs passed!
Este comando es la base para integrar Cypress en CI (Fase 4 · CI/CD).

5. Requisitos de ejecución
   5.1 Entorno local
   Node.js 20+ / 22+

Dependencias instaladas:

npm install
Variables en .env.local:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY
(usada por el backend; las pruebas UI no la llaman directamente, pero la API sí).

Supabase configurado con:

tabla socios

tabla sugerencias

RLS activas en ambas tablas

migraciones ejecutadas:

004_create_sugerencias.sql

005_rls_policies_sugerencias.sql

006_indexes_sugerencias.sql

5.2 Usuario para pruebas
Debe existir un usuario válido en Auth y socios, utilizado en los specs via EMAIL_VALID y PASSWORD_VALID:

email: test@example.com
password: Test1234!

En cypress/support/credentials.ts se definen las constantes:

EMAIL_VALID

PASSWORD_VALID

que deben corresponder a estas credenciales.

5.3 Servidor local
La app debe estar corriendo en http://localhost:3000:

bash
Copiar código
npm run dev
En cypress.config.ts se debe configurar baseUrl a http://localhost:3000 para que las rutas /login y /buzon funcionen sin prefijo.

6. Contrato funcional validado en F3 (UI)
   6.1 Login y rutas protegidas
   /login:

Con credenciales válidas (EMAIL_VALID, PASSWORD_VALID) redirige a /buzon.

Con contraseña inválida:

se mantiene la URL /login,

se muestra un mensaje de error que contiene “credenciales”.

/buzon:

Acceso directo sin sesión válida:

la UI redirige a /login (validado por auth_buzon.cy.ts).

Acceso tras login válido:

se muestra el título “Buzón de sugerencias”.

6.2 Buzón de sugerencias (UI)
Comportamiento observado y probado:

Carga inicial de sugerencias:

Tras validar sesión y perfil, la página llama a GET /api/sugerencias.

Mientras se espera respuesta y no hay datos:

se muestra “Cargando sugerencias...”.

Cuando llega la respuesta:

desaparece el mensaje,

se puebla el listado (o se cae en estado vacío si no hay filas).

Estado vacío:

Si no hay sugerencias (sugerencias.length === 0), sin error ni carga:

se muestra el mensaje:
“Aún no has registrado sugerencias. Parte creando la primera arriba.”

Botón “Actualizar lista”:

En estado normal:

muestra el texto “Actualizar lista”.

Al hacer click:

dispara un nuevo GET /api/sugerencias.

mientras loadingSugerencias está activo, el botón muestra “Actualizando…”.

Al terminar:

vuelve a mostrar “Actualizar lista”.

Errores al refrescar lista:

Si GET /api/sugerencias responde 500 en el refresh:

la UI muestra “No se pudieron cargar las sugerencias.”

la lista previa de <li> se mantiene (no se borra).

Si responde 401 (sesión expirada):

la UI redirige a /login.

6.3 Formulario de sugerencias (UI)
Comportamiento observado y probado:

Los campos usan IDs:

#titulo

#contenido

Validación básica:

Si ambos campos se dejan vacíos y se hace submit:

no se debe enviar una sugerencia,

se muestra el mensaje:

“Título y contenido son obligatorios.”

Flujo feliz de creación:

Con #titulo y #contenido con texto:

el formulario hace POST /api/sugerencias desde la UI.

la respuesta exitosa agrega la nueva sugerencia al inicio de la lista (BuzonPage).

el título único usado en la prueba (“Sugerencia Cypress {timestamp}”) aparece en el listado.

(La limpieza de campos tras éxito está implementada en el componente, pero en F3 los specs solo validan la presencia en lista, no el valor vacío explícito de los inputs.)

6.4 API + RLS (desde la perspectiva UI en F3)
La UI trabaja contra /api/sugerencias, implementado en app/api/sugerencias/route.ts, y se apoya en RLS:

GET /api/sugerencias:

Requiere sesión válida (auth.getUser()).

En caso de no haber sesión:

responde 401 { message: 'No hay sesión activa.' }.

En caso de éxito:

responde 200 con un array JSON de objetos:

id, titulo, contenido, estado, created_at.

RLS (sugerencias_select_own) garantiza que solo se devuelven filas con socio_id = auth.uid().

POST /api/sugerencias:

Requiere sesión válida.

Body esperado:

titulo: string

contenido: string

Validaciones:

body inválido o tipos incorrectos → 400 con mensaje
"Payload inválido. Se requiere titulo y contenido."

titulo/contenido vacíos tras trim() → 400 con mensaje
"Titulo y contenido son obligatorios."

En éxito:

inserta una fila en public.sugerencias con:

socio_id = user.id (usuario autenticado),

estado y created_at desde defaults de BD.

devuelve 201 con:

id, titulo, contenido, estado, created_at.

En error de BD:

responde 500 con mensaje genérico de error.

RLS en sugerencias (migraciones):

ENABLE ROW LEVEL SECURITY en public.sugerencias.

Política de lectura:

sql
Copiar código
create policy "sugerencias_select_own"
on public.sugerencias
for select
using ( auth.uid() = socio_id );
Política de inserción:

sql
Copiar código
create policy "sugerencias_insert_own"
on public.sugerencias
for insert
with check ( auth.uid() = socio_id );
En F3, estas reglas se validan indirectamente (via UI + E2E).
La verificación directa (multiusuario, payload malicioso, etc.) se realiza en F3b (API tests).

7. Checklist QA F3 (UI) – Estado actual
   Ítem Estado Comentario breve
   Specs UI Cypress creados (auth_buzon, sugerencias, refresh_sugerencias) ✔ 3 archivos E2E claramente separados por responsabilidad.
   Pruebas happy-path login + acceso a /buzon ✔ Login válido → /buzon.
   Validación de errores de login ✔ (texto frágil) Busca “credenciales” en mensaje. Se puede robustecer con data-testid.
   Validaciones de formulario de sugerencias (campos vacíos) ✔ Mensaje “Título y contenido son obligatorios.” validado.
   Creación de sugerencia válida (reflejada en listado) ✔ Verifica aparición del título creado.
   Manejo de errores en refresh (500) ✔ Mensaje mostrado y lista previa preservada.
   Manejo de sesión expirada (401) en refresh ✔ Refresh 401 → redirect a /login.
   Estado de carga inicial (Cargando sugerencias...) ✔ Validado con latencia simulada.
   Botón “Actualizar lista” / “Actualizando…” ✔ Cambio de texto comprobado.
   Ejecución headless reproducible (npx cypress run --spec ...) ✔ Comando documentado y usado como base para CI.
   Documentación de F3 (este archivo) ✔ Alcance, estructura, contrato y evidencias descritos.
   Manejo de errores al crear sugerencias (400/500 backend) ◐ Implementado en código, pero aún sin test UI específico de error.

8. Limitaciones conscientes en F3 (UI)
   No hay cobertura UI sobre update/delete de sugerencias.

No se prueban explícitamente:

respuestas 400/500 de POST /api/sugerencias desde la UI (se asume manejo por mensajes).

No se prueban escenarios multiusuario desde UI:

la validación de RLS (filtrado por socio_id) se delega a F3b (API) y a las migraciones.

No se validan aún:

headers HTTP,

estructura completa de payload de respuesta,

ni tiempos de respuesta como SLOs (se asume entorno de desarrollo estable).

9. Próximo paso: F3b (API Tests · Postman/Newman)
   La siguiente fase se centra en pruebas de API y verificación directa del contrato de datos y RLS para /api/sugerencias.

Escenarios clave a cubrir en docs/qa_f3b.md:

GET /api/sugerencias
200: lista de sugerencias propias (estructura exacta del array).

200: usuario sin sugerencias → [].

401: sin sesión / token inválido → { message: 'No hay sesión activa.' }.

Multiusuario:

Usuario A no ve sugerencias de B (RLS efectiva).

POST /api/sugerencias
201: creación válida:

body con titulo y contenido produce una fila con socio_id = auth.uid().

400: body inválido o tipos incorrectos:

payload sin titulo/contenido,

tipos no string.

400: titulo y contenido solo espacios (trim() vacío).

401: sin sesión / token inválido.

500: fallo en inserción (RLS restrictiva / constraints) → error controlado.

Los resultados de F3b se documentarán en un archivo separado (por ejemplo, docs/qa_f3b.md) y se integrarán con CI/CD en fases posteriores.

---
