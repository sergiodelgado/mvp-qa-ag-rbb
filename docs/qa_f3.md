# `docs/qa_f3.md`

## Pruebas UI · Cypress · Fase 3

**MVP QA – AG RBB · Buzón de Sugerencias**

Este documento consolida la evidencia, comandos, criterios y arquitectura de pruebas UI desarrolladas en la **Fase 3 (Cypress)**.
Todas las pruebas pasan en modo interactivo y headless.

---

# 1. Alcance de la Fase 3

Cobertura UI E2E sobre:

- Registro y login
- Acceso protegido
- Flujo completo del buzón de sugerencias:
  - carga inicial
  - creación de sugerencias
  - validaciones
  - refresco de lista
  - manejo de errores
  - manejo de sesión expirada (401)

Se prueban exclusivamente interacciones reales en el navegador, usando el backend y la UI real del proyecto.

---

# 2. Estructura Cypress

```
cypress/
  e2e/
    auth_buzon.cy.ts
    sugerencias.cy.ts
    refresh_sugerencias.cy.ts
  fixtures/
  support/
cypress.config.ts
```

---

# 3. Specs implementados

## 3.1 `auth_buzon.cy.ts`

Prueba login y protección de rutas.

| Test                                                | Descripción                                      |
| --------------------------------------------------- | ------------------------------------------------ |
| ✔ login exitoso → `/buzon`                         | Autenticación válida y redirección correcta.     |
| ✔ login inválido muestra error                     | Manejo consistente de errores (“Credenciales…”). |
| ✔ acceso a `/buzon` sin sesión redirige a `/login` | Protección UI correcta.                          |

---

## 3.2 `sugerencias.cy.ts`

Flujo principal del CRUD UI.

| Test                           | Descripción                                              |
| ------------------------------ | -------------------------------------------------------- |
| ✔ crear sugerencia válida     | Form OK, POST OK, formulario limpio, sugerencia visible. |
| ✔ no enviar con campos vacíos | Valida campos, muestra error, no hace POST.              |

---

## 3.3 `refresh_sugerencias.cy.ts`

Control específico de carga y refresco.

| Test                                               | Descripción                                     |
| -------------------------------------------------- | ----------------------------------------------- |
| ✔ refrescar lista llama GET nuevamente            | `Actualizar lista` dispara nueva petición real. |
| ✔ error 500 mantiene lista previa + muestra error | UI estable ante fallas.                         |
| ✔ sesión expirada (401) redirige a `/login`       | Manejo consistente de autenticación.            |
| ✔ estado “Cargando sugerencias…” en carga inicial | Validación de indicador de carga.               |

---

# 4. Comando para ejecutar pruebas (headless)

Ejecutar desde la raíz del repo:

```bash
npx cypress run --spec cypress/e2e/auth_buzon.cy.ts,cypress/e2e/sugerencias.cy.ts,cypress/e2e/refresh_sugerencias.cy.ts
```

Salida esperada:

```
√  All specs passed!
Specs: 3
Tests: 9
```

---

# 5. Requisitos de ejecución

### 5.1 Entorno local

- Node 20+ / 22+
- Variables en `.env.local` configuradas:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (no usada en UI tests)

- Supabase configurado con tablas:
  - `socios`
  - `sugerencias`
  - RLS activado

### 5.2 Usuario para pruebas

Debe existir un usuario válido creado manualmente para test:

```
email: test@test.com
password: 123456
```

### 5.3 Servidor local

Cypress requiere la app corriendo:

```bash
npm run dev
```

---

# 6. Contrato funcional que se valida

## 6.1 UI

- Botón “Actualizar lista” debe manejar estados:
  - normal → “Actualizar lista”
  - durante fetch → “Actualizando…”

- Formulario de sugerencias:
  - limpia campos solo después de POST exitoso (201)
  - error → no limpia campos
  - error visible en UI

## 6.2 API

- GET y POST requieren sesión.
- GET devuelve solo sugerencias del usuario.
- POST crea fila con `socio_id = auth.uid()`.
- GET/POST 401 → redirección a `/login`.
- GET 500 → UI muestra error, no borra lista previa.

---

# 7. Checklist QA F3 (completado)

| Item                           | Estado |
| ------------------------------ | ------ |
| Specs UI creados               | ✔     |
| Pruebas happy-path             | ✔     |
| Pruebas de error               | ✔     |
| Sesión expirada (401)          | ✔     |
| Estado de carga inicial        | ✔     |
| Mantención de lista ante fallo | ✔     |
| Headless CI-ready              | ✔     |
| Documentación                  | ✔     |

---

# 8. Próximo paso

**F3b – Pruebas API (Postman/Newman):**

- Tests GET /api/sugerencias
  - 200
  - 401
  - filtrados

- Tests POST /api/sugerencias
  - 201
  - 400
  - 401
  - 403

---
