# Escenarios de autenticación – MVP QA · AG RBB

Este documento define los escenarios principales de autenticación que servirán tanto para pruebas manuales como para pruebas automatizadas (Cypress y API).

---

## 1. Alcance

Los escenarios cubren:

- Registro
- Registro inválido
- Registro con email duplicado
- Login exitoso
- Login fallido
- Acceso protegido a `/buzon`
- Logout
- Persistencia de sesión

---

## 2. Escenarios principales

### 2.1 Registro exitoso

**Objetivo:** Validar que un usuario sin cuenta puede registrarse.

- **Dado** que un usuario no autenticado accede a `/register`
- **Cuando** completa email, password y nombre válidos
- **Y** envía el formulario
- **Entonces** se crea el usuario en Auth
- **Y** se crea un registro en `socios`
- **Y** el sistema redirige al usuario a `/login`
- **Y** se muestra mensaje de éxito

---

### 2.2 Registro inválido

**Objetivo:** Evitar creación de usuarios con datos inválidos.

- **Dado** que un usuario no autenticado accede a `/register`
- **Cuando** ingresa email inválido o password débil
- **Entonces** no se crea usuario
- **Y** no se crea registro en `socios`
- **Y** se muestra mensaje de error


---

### 2.2.b Registro con email ya registrado

**Objetivo:** Validar comportamiento de duplicados.

- **Dado** que ya existe un usuario registrado con cierto email
- **Cuando** intento registrarme con ese email
- **Entonces** no se crea usuario
- **Y** no se crea registro en `socios`
- **Y** se muestra un mensaje de error (puede ser genérico)

---

### 2.3 Login exitoso

- **Dado** que existo como usuario registrado
- **Cuando** ingreso email y password correctos
- **Entonces** entro a la aplicación
- **Y** soy redirigido a `/buzon`
- **Y** si recargo `/buzon`, mi sesión se mantiene

---

### 2.4 Login fallido

- **Cuando** el usuario ingresa email válido y password incorrecta
- **Entonces** la autenticación falla
- **Y** se muestra mensaje de error
- **Y** el usuario permanece en `/login`

---

### 2.5 Protección de `/buzon`

**Usuario no autenticado:**

- **Dado** que el usuario no ha iniciado sesión
- **Cuando** intenta acceder a `/buzon`
- **Entonces** es redirigido a `/login`

**Usuario autenticado:**

- **Dado** que el usuario ha iniciado sesión correctamente
- **Cuando** accede a `/buzon`
- **Entonces** puede ver su información


---

### 2.6 Logout

- **Dado** que estoy autenticado
- **Cuando** hago click en “Logout”
- **Entonces** se cierra la sesión
- **Y** soy redirigido a `/login`
- **Y** si intento acceder luego a `/buzon` sin iniciar sesión
- **Entonces** soy redirigido a `/login`