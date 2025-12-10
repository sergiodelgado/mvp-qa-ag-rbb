# QA · F3 – Pruebas E2E UI · Buzón de Sugerencias

## 1. Alcance de Fase F3

F3 valida el flujo principal de interacción UI del Buzón de Sugerencias en ambiente local, considerando:

- Autenticación de usuario QA.
- Acceso correcto a `/buzon`.
- Validación de inputs al crear una sugerencia.
- Creación exitosa de sugerencias.
- Visualización de la nueva sugerencia en el listado.
- Actualización manual de la lista mediante “Actualizar lista”.

Las pruebas corren contra el backend real (Next.js API + Supabase), sin mocks.

---

## 2. Entorno de ejecución

- Framework: **Cypress** (E2E Testing)
- Ejecución en modo interactivo:

```bash
npx cypress open
```

- Ejecución en modo headless:

```bash
npx cypress run --e2e
```

- Ejecución en CI (GitHub Actions):

```bash
npm run test:ci
```

Este comando ejecuta lint ? build ? server ? pruebas API ? pruebas E2E UI.

---

## 3. Especificaciones E2E incluidas

### 3.1. `cypress/e2e/auth_buzon.cy.ts`

**Objetivo:**  
Validar login y acceso a la vista `/buzon`.

**Cobertura:**
- Usuario con credenciales válidas puede iniciar sesión.
- Se redirige correctamente a `/buzon`.
- Se visualizan elementos clave: encabezado, nombre de usuario y sección de sugerencias.

---

### 3.2. `cypress/e2e/sugerencias.cy.ts`

**Objetivo:**  
Validar creación y visualización de sugerencias.

**Cobertura:**
- Muestra datos básicos del usuario en sesión.
- Validación de inputs vacíos (error esperado).
- Creación exitosa de una sugerencia válida.
- Visualización de la sugerencia creada en el listado “Tus sugerencias”.

---

### 3.3. `cypress/e2e/refresh_sugerencias.cy.ts`

**Objetivo:**  
Validar la actualización manual del listado.

**Cobertura:**
- Carga inicial del listado de sugerencias al abrir la vista.
- Botón “Actualizar lista” ejecuta nuevamente la consulta a `/api/sugerencias`.
- Manejo correcto de errores de API (cuando corresponde).

---

## 4. Ejecución local de F3 — pasos mínimos

1. Configurar archivo `.env.local` con:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

2. Levantar entorno local:

```bash
npm run dev
```

3. Ejecutar pruebas UI:

```bash
npx cypress open
# o:
npx cypress run --e2e
```

---

## 5. Relación con F3b y F4

- **F3b** valida que la API `/api/sugerencias` responde correctamente **sin sesión** (401), usando Postman + Newman.
- **F3** valida que la UI funciona cuando **sí hay sesión**.
- **F4** integra ambas pruebas en CI, junto con lint y build, mediante:

```bash
npm run test:ci
```

---

## 6. Estado actual

Todos los specs Cypress relevantes (`auth_buzon`, `sugerencias`, `refresh_sugerencias`) se encuentran en **verde** tanto localmente como en CI.

