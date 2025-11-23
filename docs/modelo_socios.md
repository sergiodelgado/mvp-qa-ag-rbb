# Modelo de datos: tabla `socios`

Este documento define el modelo mínimo de la tabla `socios` en Supabase para el MVP QA · AG RBB. La tabla `socios` representa el perfil básico asociado a cada usuario autenticado en Supabase Auth.

---

## 1. Rol de la tabla `socios`

- La autenticación se gestiona mediante **Supabase Auth**, que almacena usuarios en `auth.users`.
- La tabla `socios` complementa esa información con datos específicos del contexto AG RBB.
- Cada fila en `socios` corresponde a exactamente un usuario autenticado.

Relación conceptual:

auth.users (Supabase Auth) 1 ─── 1 socios

## 2. Definición de campos

Tabla: `socios`

| Campo        | Tipo     | Obligatorio | Descripción                                                                 |
|--------------|----------|-------------|-----------------------------------------------------------------------------|
| `id`         | uuid     | Sí          | Identificador del socio. Igual al `id` del usuario en `auth.users`.         |
| `email`      | text     | Sí          | Correo del socio.                                                           |
| `nombre`     | text     | Sí          | Nombre o alias que se mostrará en el buzón.                                |
| `created_at` | timestampz| Sí          | Fecha de creación del registro. Default: `now()`.                           |
| `rol`        | text     | No          | Rol del socio. MVP: siempre `socio`. Reservado para futuras versiones.      |
| `estado`     | text     | No          | Estado del socio (`activo`/`inactivo`). No usado en el MVP.                 |

---

## 3. Uso en el MVP

Para la primera versión funcional, la aplicación sólo utilizará activamente:

- `id`
- `email`
- `nombre`
- `created_at`

Los campos `rol` y `estado` se incluyen **solo para extensibilidad futura** pero:

- No participan en la lógica del MVP.
- No afectan los flujos de registro, login o buzón.
- No deben generar validaciones adicionales en esta fase.

---

## 4. Reglas de coherencia con Supabase Auth

Para garantizar la integridad entre `auth.users` y `socios`:

1. Cada vez que se crea un usuario vía Auth, debe crearse una fila correspondiente en `socios`.
2. `socios.id` **debe ser siempre igual** al `id` generado por `auth.users`.
3. No debe existir un socio sin un usuario correspondiente en Auth.
4. `email` debe mantenerse sincronizado con el email principal del usuario en Auth.

Esta lógica se implementará en Fase 2 usando:
- Un endpoint `/api/socios/create`
  o
- Una Policy + Trigger SQL en Supabase  
(según el diseño que se elija).

---

## 5. Consideraciones para QA

Los tests de autenticación asumirán:

- Que `socios` contiene **1 fila por usuario autenticado**.
- Que el campo `nombre` aparece en UI (ej. “Bienvenido, Sergio”).
- Que el flujo de registro crea:
  - usuario en `auth.users`;
  - fila correspondiente en `socios`.

Para evitar flakiness, **todas las pruebas deben usar correos únicos por test**.

---

## 6. Pendientes para Fase 2

- Crear efectivamente la tabla `socios` en Supabase.
- Definir RLS para que:
  - el socio sólo pueda leer/modificar su propio registro.
- Implementar el punto de creación automática del registro en `socios`.

---