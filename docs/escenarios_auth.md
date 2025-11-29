# Escenarios de autenticación – MVP QA · AG RBB

Este documento define los escenarios de autenticación del MVP.  
Todos se validan tanto manualmente como mediante pruebas automatizadas (Cypress y API).

Estos escenarios se basan en el flujo real implementado en Fase 1 + Fase 2:  
Supabase Auth con cookies (createBrowserClient / createServerClient) + rutas protegidas.

---

## 1. Alcance

Los escenarios cubren:

- Registro
- Registro inválido
- Email duplicado
- Login exitoso y fallido
- Acceso protegido a `/buzon`
- Logout
- Persistencia de sesión
- Protección contra navegación cruzada (redirigir si ya hay sesión)

---

## 2. Escenarios principales

### 2.1 Registro exitoso

**Objetivo:** Validar que un nuevo usuario puede registrarse correctamente.

- **Dado** un usuario no autenticado en `/register`
- **Cuando** completa email, password y nombre válidos
- **Y** envía el formulario
- **Entonces** se crea usuario en `auth.users`
- **Y** se crea una fila correspondiente en `socios`
- **Y** es redirigido a `/login`
- **Y** se muestra un mensaje de éxito o feedback equivalente

---

### 2.2 Registro inválido

**Objetivo:** Evitar creación de usuarios con datos inválidos.

- **Dado** un usuario no autenticado
- **Cuando** envía email mal formateado o password débil
- **Entonces** no se crea usuario
- **Y** no se crea fila en `socios`
- **Y** se muestra un mensaje de error claro

---

### 2.3 Registro con email ya registrado

**Objetivo:** Validar manejo de duplicados.

- **Dado** que existe un usuario registrado con cierto email
- **Cuando** intento registrarme con ese email
- **Entonces** Supabase rechaza la operación
- **Y** no se crea usuario adicional
- **Y** no se crea un segundo `socio`
- **Y** se muestra un mensaje de error genérico (“credenciales inválidas” o similar)

---

### 2.4 Login exitoso

**Objetivo:** Validar flujo completo de inicio de sesión.

- **Dado** un usuario ya registrado
- **Cuando** ingresa email y password válidos en `/login`
- **Entonces** Supabase crea la cookie de sesión (Auth Cookie)
- **Y** el usuario es redirigido a `/buzon`
- **Y** `/buzon` muestra su nombre/email desde `socios`
- **Y** si refresca la página, la sesión se mantiene sin volver a `/login`

> Nota  
> Este comportamiento se sostiene gracias a `createBrowserClient` + `createServerClient`.

---

### 2.5 Login fallido

**Objetivo:** Validar mensajes claros y bloqueo de acceso.

- **Cuando** se ingresa email válido y password incorrecta
- **Entonces** la autenticación falla
- **Y** se muestra mensaje de error
- **Y** el usuario permanece en `/login`

---

### 2.6 Protección de `/buzon`

**Usuario no autenticado:**

- **Dado** que no existe cookie de sesión
- **Cuando** intento acceder a `/buzon`
- **Entonces** soy redirigido a `/login`

**Usuario autenticado:**

- **Dado** que tengo sesión activa
- **Cuando** accedo a `/buzon`
- **Entonces** puedo ver mi saludo y mis sugerencias

---

### 2.7 Logout

**Objetivo:** Asegurar limpieza de sesión y redirección correcta.

- **Dado** un usuario autenticado
- **Cuando** hace clic en “Logout”
- **Entonces** Supabase elimina la cookie de sesión
- **Y** el usuario es redirigido a `/login`
- **Y** cualquier intento posterior de acceder a `/buzon`
- **Entonces** redirige a `/login`

---

### 2.8 Persistencia de sesión

**Objetivo:** Validar que la sesión no desaparece erróneamente.

- **Dado** un usuario autenticado
- **Cuando** refresca la página
- **O** abre una nueva pestaña con `/buzon`
- **Entonces** la sesión sigue activa
- **Y** no se redirige a `/login`

---

### 2.9 Protección inversa: rutas públicas con sesión activa

**Objetivo:** Garantizar navegación correcta si ya hay sesión.

- **Dado** un usuario autenticado
- **Cuando** intenta acceder a `/login` o `/register`
- **Entonces** el sistema lo redirige automáticamente a `/buzon`

---

## 3. Notas para QA

- Los tests deben usar **emails únicos** por ejecución.
- Evitar race-conditions creando usuarios directamente en SQL (siempre usar registro real).
- Validar cookies explícitamente en pruebas API (`auth.getUser()` debería devolver el usuario).
- Toda la protección depende de políticas RLS activas en `socios` y `sugerencias`.

Este documento cubre el comportamiento real aplicado en Fase 1 y utilizado en Fase 2.  
Es base directa para los test suites de Cypress, Supertest y Postman de Fase 3.
