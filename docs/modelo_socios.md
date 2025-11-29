# Modelo de datos: tabla `socios`

Este documento define el modelo real de la tabla `socios` en Supabase, tal como está implementado en el MVP QA · AG RBB. La tabla contiene el perfil básico asociado a cada usuario autenticado en Supabase Auth.

---

## 1. Rol de la tabla `socios`

- Supabase Auth gestiona la autenticación y almacena usuarios en `auth.users`.
- La tabla `socios` complementa esa información con campos propios del proyecto.
- La aplicación utiliza `socios` para mostrar datos del perfil en el buzón.

Relación real:

`auth.users` 1 ─── 0..1 `socios`

Una fila en `socios` existe solo si el registro fue creado vía la página `/register`.

---

## 2. Definición de campos

Tabla: `socios`

| Campo        | Tipo        | Obligatorio | Descripción                                              |
| ------------ | ----------- | ----------- | -------------------------------------------------------- |
| `id`         | uuid        | Sí          | Igual al `id` del usuario en `auth.users`.               |
| `email`      | text        | Sí          | Correo del socio.                                        |
| `nombre`     | text        | Sí          | Nombre que se muestra en la interfaz.                    |
| `created_at` | timestamptz | Sí          | Fecha de creación. Default: `now()`.                     |
| `rol`        | text        | No          | Rol del socio. Default: `socio`. Reservado para futuro.  |
| `estado`     | text        | No          | Estado del socio. Default: `activo`. No usado en el MVP. |

---

## 3. Uso en el MVP

La aplicación solo consume activamente:

- `id`
- `email`
- `nombre`

Estos campos permiten:

- Mostrar saludo personalizado en `/buzon`
- Asociar sugerencias al usuario autenticado
- Trazabilidad mínima para QA

Los campos `rol` y `estado` existen por diseño extensible, pero no afectan el MVP.

---

## 4. Reglas implementadas (RLS)

La tabla `socios` tiene RLS activado con las siguientes políticas:

- **select:** cada usuario puede leer únicamente su propia fila (`auth.uid() = id`)
- **insert:** los usuarios solo pueden insertarse a sí mismos
- **update:** cada usuario puede actualizar solo su propia fila

Estas políticas están definidas en:

supabase/migrations/001_socios.sql

---

## 5. Flujo real de creación del socio

El MVP utiliza este flujo:

1. El usuario se registra vía `/register`.
2. Supabase Auth crea el usuario en `auth.users`.
3. El frontend inserta manualmente la fila correspondiente en `socios`.
4. El usuario es redirigido a `/login`.

**No existe trigger automático ni endpoint dedicado para crear perfiles.**

---

## 6. Consideraciones QA (Fase 3)

Las pruebas deben asumir:

- El registro crea:
  - un usuario en Auth
  - y una fila en `socios`
- Si el insert en `socios` falla, la app usa fallback con `auth.users.email`.
- El campo `nombre` es visible en UI.
- Cada test debe usar correos únicos para evitar colisiones en Auth.

---

## 7. Estado del modelo

✔ Tabla creada  
✔ RLS aplicada  
✔ Insert manual vía `/register`  
✘ No existen triggers automáticos (por diseño del MVP)  
✘ No existen endpoints `/api/socios` (no necesarios en F1/F2)

El modelo se considera **cerrado** para Fase 1 y Fase 2.
