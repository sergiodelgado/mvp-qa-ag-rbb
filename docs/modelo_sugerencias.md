# Modelo de datos: tabla `sugerencias`

Este documento describe el modelo real de la tabla `sugerencias` tal como está implementada en el MVP QA · AG RBB.  
La tabla almacena las sugerencias ingresadas por los socios autenticados y aplica RLS estricta basada en `auth.uid()`.

---

## 1. Propósito

- Permitir que cada socio registre sus propias sugerencias dentro de `/buzon`.
- Asociar cada sugerencia al usuario autenticado mediante su `id` de Supabase Auth.
- Habilitar trazabilidad básica para QA y para funcionalidades futuras.
- Servir como base mínima para flujos de revisión más avanzados en versiones posteriores.

Relación real:

auth.users 1 ─── 0..1 socios 1 ─── N sugerencias

`auth.users.id` → `socios.id` → `sugerencias.socio_id`

---

## 2. Definición de campos

Tabla: `sugerencias`

| Campo        | Tipo        | Obligatorio | Descripción                                                                      |
| ------------ | ----------- | ----------- | -------------------------------------------------------------------------------- |
| `id`         | uuid        | Sí          | Identificador único. Default: `gen_random_uuid()`.                               |
| `socio_id`   | uuid        | Sí          | FK a `socios.id`, que coincide con el `id` del usuario en Supabase Auth.         |
| `titulo`     | text        | Sí          | Título visible en el listado del buzón.                                          |
| `contenido`  | text        | Sí          | Texto completo de la sugerencia.                                                 |
| `estado`     | text        | No          | Estado del ciclo. Default: `nueva`. Sugerido: `nueva`, `en_revision`, `cerrada`. |
| `created_at` | timestamptz | Sí          | Fecha de creación. Default: `now()`.                                             |

---

## 3. Uso en el MVP (Fase 2)

La página `/buzon` implementa:

1. **Creación** de sugerencias (formulario).
2. **Listado** de las sugerencias propias en orden descendente.
3. Conexión mediante:
   - `POST /api/sugerencias` → crear
   - `GET /api/sugerencias` → listar

En esta fase **no existe**:

- edición,
- eliminación,
- estados avanzados.

Solo creación + lectura propia.

---

## 4. Reglas de integridad y autenticación

- `sugerencias.socio_id` siempre corresponde al usuario autenticado (`auth.uid()`).
- La app genera `socio_id` automáticamente a partir de la sesión.
- Si no existe fila en `socios`, la API responde 401 debido a que la política RLS impide la operación.
- No existe trigger automático: las filas en `socios` se crean manualmente en `/register`.

---

## 5. RLS (Row Level Security)

La tabla `sugerencias` tiene RLS activa con políticas:

### SELECT

El usuario solo puede ver sus propias sugerencias:

socio_id = auth.uid()

### INSERT

El usuario solo puede insertar si `socio_id = auth.uid()`.

### UPDATE / DELETE

(No implementados en F2; reservados para futuras fases.)

Las políticas están definidas en:

supabase/migrations/005_rls_policies_sugerencias.sql

---

## 6. Notas para QA (Fase 3)

Los tests deben validar:

- creación exitosa de una sugerencia propia,
- lectura solo de sugerencias del usuario actual,
- imposible ver o crear sugerencias para otro `socio_id`,
- errores HTTP:
  - `401` sin sesión,
  - `403` si falla una política RLS.

Cada test debe usar correos únicos para evitar colisiones en Auth.

---

## 7. Estado del modelo

✔ Tabla creada
✔ RLS aplicada
✔ CRUD mínimo funcionando vía API
✔ Integrado con `/buzon`
✘ No existen UPDATE/DELETE en esta fase (correcto por diseño)

La tabla se considera **cerrada para F1 + F2**.

---
