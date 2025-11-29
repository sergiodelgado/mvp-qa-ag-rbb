# Rutas base del MVP QA · AG RBB (Fase 1)

Este documento define las rutas fundamentales implementadas en **Fase 1**:  
autenticación, navegación base y la primera versión del buzón (sin CRUD).

La funcionalidad completa del buzón y sus APIs forma parte de **Fase 2** y se documenta en `rutas_f2.md`.

---

## 1. Rutas principales (Fase 1)

- `/`
- `/login`
- `/register`
- `/buzon` _(versión F1: saludo + datos del socio)_
- `/logout`

Estas rutas forman el flujo mínimo de autenticación y navegación.

---

## 2. Detalle de rutas

### 2.1 `/` (Home)

- **Acceso:** Público.
- **Comportamiento:**
  - Sin sesión → muestra información básica y enlaces a `/login` y `/register`.
  - Con sesión → redirige automáticamente a `/buzon`.
- **Rol:** Punto de entrada inicial.

---

### 2.2 `/login`

- **Acceso:** Público (solo usuarios sin sesión).
- **Comportamiento:**
  - Muestra formulario de email + password.
  - Login válido → redirige a `/buzon`.
  - Login inválido → muestra error.
  - Si hay sesión activa → redirige a `/buzon`.
- **Rol:** Punto principal de autenticación.

---

### 2.3 `/register`

- **Acceso:** Público (solo usuarios sin sesión).
- **Comportamiento:**
  - Formulario con `email`, `password`, `nombre`.
  - Registro exitoso:
    - Crea usuario en Supabase Auth.
    - Crea fila correspondiente en `socios`.
    - Redirige siempre a `/login`.
  - Registro inválido → muestra error.
  - Usuario autenticado → redirección automática a `/buzon`.
- **Rol:** Inicio del ciclo de vida de un socio.

---

### 2.4 `/buzon`

- **Acceso:** Solo usuarios autenticados.
- **Comportamiento en Fase 1:**
  - Sin sesión → redirección inmediata a `/login`.
  - Con sesión → muestra:
    - saludo con `nombre` y `email` del socio,
    - un placeholder simple del buzón,
    - botón de logout.
- **Importante:**  
  La funcionalidad CRUD solo existe en Fase 2 y se documenta por separado.
- **Rol:** Pantalla principal tras login.

---

### 2.5 `/logout`

- **Acceso:** Usuarios autenticados.
- **Comportamiento:**
  - Ejecuta `signOut`.
  - Limpia la sesión/cookies.
  - Redirige siempre a `/login`.
- **Rol:** Cerrar sesión.

---

## 3. Resumen de reglas de acceso (F1)

| Ruta        | Sin sesión          | Con sesión          |
| ----------- | ------------------- | ------------------- |
| `/`         | Permitido           | Redirige a `/buzon` |
| `/login`    | Permitido           | Redirige a `/buzon` |
| `/register` | Permitido           | Redirige a `/buzon` |
| `/buzon`    | Redirige a `/login` | Permitido           |
| `/logout`   | N/A                 | Redirige a `/login` |

---

## 4. Relación con Fase 2

Todo lo relacionado con:

- formulario para crear sugerencias,
- listado de sugerencias propias,
- conexión con `/api/sugerencias`,
- RLS de la tabla `sugerencias`,

está documentado en:

docs/rutas_f2.md

Este documento cubre exclusivamente el flujo base de Fase 1.

---
