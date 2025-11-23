# Rutas del MVP QA · AG RBB – Buzón de Sugerencias

Este documento define las rutas principales de la aplicación, su propósito y las reglas de acceso. Sirve como base para el desarrollo de la interfaz, la implementación de autenticación y el diseño de pruebas (manuales y automatizadas).

---

## 1. Rutas principales

Las rutas definidas para el MVP son:

- `/`
- `/login`
- `/register`
- `/buzon`
- `/logout` (o acción equivalente mediante botón/enlace en la interfaz)

---

## 2. Detalle de rutas

### 2.1 `/` (Home)

- **Acceso:** Usuario no autenticado y usuario autenticado.
- **Comportamiento esperado:**
  - Si el usuario **no está autenticado**, puede ver una página simple con información básica del proyecto y enlaces a:
    - `/login`
    - `/register`
  - Si el usuario **está autenticado**, debe ser redirigido automáticamente a `/buzon`.
- **Rol en el MVP:**
  - Punto de entrada genérico a la aplicación.
  - No contiene lógica de negocio propia.

---

### 2.2 `/login`

- **Acceso:** Usuario no autenticado (y redirección automática si ya está autenticado).
- **Comportamiento esperado:**
  - Si el usuario **no está autenticado**:
    - Se muestra un formulario con:
      - Email
      - Password
    - Si las credenciales son válidas:
      - El usuario inicia sesión.
      - Es redirigido a `/buzon`.
    - Si las credenciales son inválidas:
      - No se inicia sesión.
      - Se muestra un mensaje de error claro.
  - Si el usuario **ya está autenticado**:
    - No se muestra el formulario de login.
    - El usuario es redirigido directamente a `/buzon`.
- **Rol en el MVP:**
  - Punto principal de acceso para usuarios ya registrados.
  - Referencia directa para pruebas de UI (Cypress) y flujos de autenticación.

---

### 2.3 `/register`

- **Acceso:** Usuario no autenticado.
- **Comportamiento esperado:**
  - Muestra un formulario con:
    - Email
    - Password
    - Nombre o alias del socio
  - Si los datos son válidos:
    - Se crea el usuario en el sistema de autenticación (Supabase Auth).
    - Se crea el registro correspondiente en la tabla `socios`.
    - El usuario es redirigido **siempre** a `/login`.
  - Si los datos son inválidos:
    - No se crea el usuario.
    - No se crea ningún registro en `socios`.
    - Se muestra un mensaje de error.
- **Rol en el MVP:**
  - Responsable de iniciar el flujo de vida de un socio en el sistema.
  - Mantiene un flujo lineal: `register → login → buzón`.

---

### 2.4 `/buzon`

- **Acceso:** Solo usuario autenticado.
- **Comportamiento esperado:**
  - Si el usuario **no está autenticado**:
    - Cualquier intento de acceder a `/buzon` debe redirigir a `/login`.
  - Si el usuario **está autenticado**:
    - Debe ver sus propias sugerencias (en Fase 2, cuando se implemente el CRUD).
    - En futuras fases se mostrarán acciones de:
      - Crear nueva sugerencia.
      - Editar o eliminar sugerencias propias.
- **Rol en el MVP:**
  - Es la pantalla principal de la aplicación una vez que el usuario ha iniciado sesión.
  - Es el destino por defecto después de un login exitoso.

---

### 2.5 `/logout` (o acción equivalente)

- **Acceso:** Solo usuario autenticado.
- **Comportamiento esperado:**
  - La acción de logout solo debe estar visible para usuarios autenticados.
  - Al activar la acción de logout:
    - Se cierra la sesión del usuario.
    - Se invalidan las credenciales activas.
    - El usuario es redirigido **siempre** a `/login`.
  - Si por cualquier motivo un usuario no autenticado invoca la ruta/acción de logout:
    - El sistema puede tratarla como una operación vacía y redirigir a `/login`.
- **Rol en el MVP:**
  - Permitir que el usuario cierre sesión de forma explícita.
  - Punto importante para pruebas de flujo completo de autenticación.

---

## 3. Resumen de reglas de acceso

| Ruta      | Usuario no autenticado                         | Usuario autenticado                     |
|----------|-------------------------------------------------|-----------------------------------------|
| `/`      | Acceso permitido                                | Redirigir a `/buzon`                    |
| `/login` | Acceso permitido, muestra formulario            | Redirigir a `/buzon`                    |
| `/register` | Acceso permitido                             | Normalmente no necesaria; se puede redirigir a `/buzon` o no mostrar enlace |
| `/buzon` | Redirigir a `/login`                            | Acceso permitido                        |
| `/logout` | No visible / no relevante para no autenticado  | Acceso permitido, ejecuta cierre de sesión y redirige a `/login` |

Este diseño sirve de referencia estable para el desarrollo de la interfaz, la lógica de autenticación y la definición de casos de prueba.
