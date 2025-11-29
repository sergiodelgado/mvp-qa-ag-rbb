# `docs/qa_f3.md`

## Pruebas UI · Cypress · Fase 3

**MVP QA – AG RBB · Buzón de Sugerencias**

Este documento describe el alcance, configuración y evidencia de la **Fase 3 (QA UI con Cypress)** para el MVP del **Buzón de Sugerencias** de AG RBB.

Se enfoca en **pruebas end-to-end de interfaz** sobre la aplicación real (Next.js + Supabase), usando el backend y las reglas de negocio existentes.

---

# 1. Alcance de la Fase 3 (UI)

Cobertura UI E2E sobre:

- Registro y login (flujo básico)
- Acceso protegido a rutas
- Flujo principal del buzón de sugerencias:
  - carga inicial de sugerencias propias
  - creación de nuevas sugerencias
  - validaciones de campos
  - refresco manual de la lista
  - manejo de errores en carga/refresh
  - manejo de sesión expirada (401) en la UI

> **Nota:**  
> Esta fase NO cubre aún:
>
> - actualización/edición de sugerencias,
> - eliminación de sugerencias,
> - pruebas de API puras (sin navegador),
> - validación directa de políticas RLS en la base de datos.  
>   Eso se aborda en **F3b (API tests)** y fases posteriores.

---

# 2. Estructura Cypress

cypress/
e2e/
auth_buzon.cy.ts
sugerencias.cy.ts
refresh_sugerencias.cy.ts
fixtures/
support/
cypress.config.ts

Las pruebas se apoyan en:

cypress/e2e/auth_buzon.cy.ts → login y protección de /buzon

cypress/e2e/sugerencias.cy.ts → creación y validación de formulario

cypress/e2e/refresh_sugerencias.cy.ts → carga/refresh y manejo de errores

3. Especificación de specs implementados
   3.1 auth_buzon.cy.ts

Prueba login y protección de rutas.

Test Descripción
✔ login exitoso → /buzon Autenticación válida y redirección correcta.
✔ login inválido muestra error Manejo consistente de errores (“Credenciales…”).
✔ acceso a /buzon sin sesión redirige a /login Protección de ruta en la UI.

Contrato funcional cubierto:

Solo usuarios con credenciales válidas acceden a /buzon.

Errores de autenticación son visibles en la UI.

Intentar acceder a /buzon sin sesión envía de vuelta a /login.

3.2 sugerencias.cy.ts

Flujo principal del formulario del buzón.

Test Descripción
✔ crear sugerencia válida Formulario válido → POST exitoso → formulario limpio → sugerencia visible en la lista.
✔ no enviar con campos vacíos Valida campos, muestra error, no intenta POST.

Contrato funcional cubierto:

No se permite enviar sugerencias vacías.

Una sugerencia válida:

gatilla un POST a /api/sugerencias,

se refleja en el listado,

limpia los campos del formulario.

3.3 refresh_sugerencias.cy.ts

Control específico de carga y refresco de lista.

Test Descripción
✔ refrescar lista llama GET nuevamente Botón “Actualizar lista” dispara una nueva llamada GET.
✔ error 500 mantiene lista previa + muestra error UI estable ante errores 500 en refresh (lista no se borra).
✔ sesión expirada (401) redirige a /login Un 401 en refresh provoca redirección a /login.
✔ estado “Cargando sugerencias…” en carga inicial Validación del indicador de carga inicial con latencia.

Contrato funcional cubierto:

La lista inicial se obtiene desde /api/sugerencias.

El botón “Actualizar lista” vuelve a llamar al endpoint.

Ante error 500:

la UI muestra un mensaje de error,

la lista existente no se pierde.

Ante 401 (sesión expirada):

la UI redirige al login.

Ante latencia:

se muestra “Cargando sugerencias…” mientras se esperan datos.

4. Comando para ejecutar pruebas (headless)

Desde la raíz del repositorio:

npx cypress run --spec cypress/e2e/auth_buzon.cy.ts,cypress/e2e/sugerencias.cy.ts,cypress/e2e/refresh_sugerencias.cy.ts

Salida esperada (resumen):

Specs: 3
Tests: 9
All specs passed!

Este comando se usará como base para integrar Cypress en CI en la Fase 4 (CI/CD).
En este documento solo se declara la forma de ejecución, no el pipeline específico.

5. Requisitos de ejecución
   5.1 Entorno local

Node 20+ / 22+

Variables en .env.local configuradas:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY (no usada directamente en UI tests)

Supabase configurado con:

tablas socios y sugerencias,

RLS activo para ambas tablas,

migraciones ejecutadas.

5.2 Usuario para pruebas

Debe existir un usuario válido creado manualmente:

email: test@example.com
password: Test1234!

Este usuario se utiliza en los specs como credencial de login para los flujos del buzón.

5.3 Servidor local

Cypress requiere la app corriendo en http://localhost:3000:

npm run dev

6. Contrato funcional válido en F3
   6.1 UI (buzón)

Botón “Actualizar lista”:

estado normal → muestra “Actualizar lista”,

durante fetch de refresh → muestra “Actualizando…”.

Formulario de sugerencias:

solo envía si título y contenido tienen texto no vacío (trimmed),

en éxito:

limpia campos,

agrega la nueva sugerencia al listado,

en error:

no limpia campos,

muestra mensaje de error en la UI.

Estado vacío:

si el usuario no tiene sugerencias, la UI muestra un mensaje de vacío (sin romper el layout).

6.2 API + comportamiento observado desde UI

Esta sección describe el contrato de comportamiento tal como se observa desde la UI.
Las pruebas de API directas se definen en F3b.

/api/sugerencias:

GET y POST requieren sesión válida.

GET devuelve solo sugerencias del usuario autenticado.

POST crea una sugerencia asociada al usuario autenticado.

Ante 401:

la UI redirige a /login desde /buzon.

Ante 500 en GET de refresh:

la UI muestra un mensaje de error,

mantiene la lista previa.

RLS:

La UI trabaja bajo el supuesto de que las políticas RLS impiden:

leer sugerencias de otros usuarios,

escribir sugerencias con un socio_id distinto al del usuario.

La verificación directa de RLS se aborda en:

migraciones de Supabase (infra),

pruebas de API (F3b).

7. Checklist QA F3 (UI) – Estado actual
   Item Estado
   Specs UI Cypress creados ✔
   Pruebas happy-path login + buzón ✔
   Validaciones de formulario de sugerencias ✔
   Manejo de errores en refresh (500) ✔
   Manejo de sesión expirada (401) ✔
   Estado de carga inicial de sugerencias ✔
   Ejecución headless reproducible ✔
   Documentación de F3 (este archivo) ✔

Limitaciones conscientes en F3 (UI):

No hay cobertura UI sobre update/delete de sugerencias.

No se validan aún respuestas de API en detalle (payload exacto, headers, etc.).

No se testean explícitamente las políticas RLS a nivel de base de datos.

8. Próximo paso: F3b (API Tests · Postman/Newman)

La siguiente fase de QA se centra en pruebas de API y verificación más directa del contrato de datos:

GET /api/sugerencias

200: lista de sugerencias propias

401: sin sesión

validación de filtrado (no aparecen sugerencias de otros usuarios)

POST /api/sugerencias

201: creación válida

400: body inválido (sin título/contenido)

401: sin sesión

403 (o equivalente): intentos que violen reglas RLS

Estos escenarios se documentarán en docs/qa_f3b.md y se implementarán con Postman/Newman y CI/CD en fases siguientes.
