# Rutas base del MVP QA · AG RBB (Fase 1)

Este documento define únicamente las rutas fundamentales implementadas en **Fase 1** del proyecto: autenticación, navegación base y acceso inicial al buzón.  
El comportamiento extendido del buzón de sugerencias y sus APIs forma parte de **Fase 2** y se documenta en `rutas_f2.md`.

> Nota  
> Este archivo cubre solo las rutas esenciales del MVP antes del CRUD de sugerencias.  
> Para todo lo relacionado con _crear_ o _listar_ sugerencias, ver `docs/rutas_f2.md`.

---

## 1. Rutas principales (Fase 1)

- `/`
- `/login`
- `/register`
- `/buzon` _(versión base, sin CRUD en F1)_
- `/logout`

Estas rutas constituyen el flujo mínimo de autenticación y navegación antes de la implementación del buzón funcional de sugerencias.

---

## 2. Detalle de rutas

### 2.1 `/` (Home)

- **Acceso:** Público.
- **Comportamiento (F1):**
  - Usuario sin sesión: ve información básica + enlaces a `/login` y `/register`.
  - Usuario con sesión activa: redirige automáticamente a `/buzon`.
- **Rol:** Punto de entrada genérico.

---

### 2.2 `/login`

- **Acceso:** Público (solo usuarios sin sesión).
- **Comportamiento (F1):**
  - Formulario de email y contraseña.
  - Ingreso válido → redirección a `/buzon`.
  - Ingreso inválido → mensaje de error.
  - Usuario ya autenticado → redirección automática a `/buzon`.
- **Rol:** Punto principal de autenticación.

---

### 2.3 `/register`

- **Acceso:** Público (solo usuarios sin sesión).
- **Comportamiento (F1):**
  - Formulario con `email`, `password`, `nombre`.
  - Registro exitoso:
    - Crea usuario en Supabase Auth.
    - Crea registro en tabla `socios`.
    - Redirige siempre a `/login`.
  - Registro inválido: muestra error.
- **Rol:** Inicio del ciclo de vida del socio.

---

### 2.4 `/buzon`

- **Acceso:** Solo usuarios autenticados.
- **Comportamiento (F1):**
  - Usuario sin sesión → redirección a `/login`.
  - Usuario autenticado → ve una versión inicial del buzón (placeholder).
- **Importante:**
  - La funcionalidad completa (crear y listar sugerencias) pertenece a Fase 2.  
    Para esos detalles ver `docs/rutas_f2.md`.
- **Rol:** Destino post-login y área protegida principal.

---

### 2.5 `/logout`

- **Acceso:** Usuarios autenticados.
- **Comportamiento (F1):**
  - Ejecuta `signOut`.
  - Limpia sesión/cookies.
  - Redirige siempre a `/login`.
- **Rol:** Cierre explícito de sesión.

---

## 3. Resumen de reglas de acceso (F1)

| Ruta        | Sin sesión                | Con sesión                     |
| ----------- | ------------------------- | ------------------------------ |
| `/`         | Acceso permitido          | Redirige a `/buzon`            |
| `/login`    | Acceso permitido          | Redirige a `/buzon`            |
| `/register` | Acceso permitido          | Puede redirigir a `/buzon`     |
| `/buzon`    | Redirige a `/login`       | Acceso permitido               |
| `/logout`   | No visible / no relevante | Redirige a `/login` tras salir |

---

## 4. Relación con Fase 2 (nota de cierre)

La funcionalidad completa del buzón de sugerencias, incluyendo:

- formulario de creación
- listado del socio
- conexión con `/api/sugerencias`
- RLS en `sugerencias`

está detallada en **`docs/rutas_f2.md`** y no forma parte de este documento.

Este archivo queda como referencia base de navegación y autenticación del MVP.
