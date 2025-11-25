# Modelo de datos: tabla `sugerencias`

Este documento define el modelo mínimo de la tabla `sugerencias` en Supabase para el MVP QA · AG RBB. La tabla representa el buzón interno donde los socios autenticados pueden registrar y dar seguimiento a sugerencias para el proyecto.

---

## 1. Propósito

- Centralizar las sugerencias generadas por los socios dentro de la aplicación (/buzon).
- Asociar cada sugerencia a un socio autenticado para habilitar trazabilidad y RLS.
- Servir como base para flujos de revisión y cierre de sugerencias.

Relación conceptual:

`auth.users` (Supabase Auth) 1 ─── 1 `socios` 1 ─── N `sugerencias`

---

## 2. Definición de campos

Tabla: `sugerencias`

| Campo        | Tipo        | Obligatorio | Descripción                                                                                           |
|-------------|-------------|------------|-------------------------------------------------------------------------------------------------------|
| `id`        | uuid        | Sí         | Identificador principal de la sugerencia (PK). Default: `gen_random_uuid()`.                         |
| `socio_id`  | uuid        | Sí         | Referencia al socio que crea la sugerencia. FK a `socios.id` (mapea 1:1 con `auth.users.id`).        |
| `titulo`    | text        | Sí         | Título corto mostrado en el buzón.                                                                   |
| `contenido` | text        | Sí         | Descripción detallada de la sugerencia.                                                              |
| `estado`    | text        | No         | Estado del flujo de la sugerencia. Valores sugeridos: `nueva`, `en_revision`, `cerrada`. Default: `nueva`. |
| `created_at`| timestamptz | Sí         | Marca de tiempo de creación. Default: `now()`.                                                       |

---

## 3. Uso en el MVP

- La pantalla `/buzon` lista las sugerencias del socio autenticado.
- Flujo esperado:
  1. El socio autenticado envía título y contenido.
  2. Se crea la fila en `sugerencias` con `estado = 'nueva'`.
  3. El socio puede consultar su historial; futuras fases podrán permitir cambios de estado.
- En Fase 2 no se requiere edición ni borrado: solo creación y lectura propia.

---

## 4. Coherencia con socios y autenticación

- `sugerencias.socio_id` apunta al `id` de la tabla `socios` (que coincide con `auth.users.id`).
- No debe existir una sugerencia sin socio autenticado.
- Si se usa un trigger para crear `socios` al registrarse, el mismo `id` se reutiliza al insertar en `sugerencias`.

### RLS (Row Level Security)

Políticas base en `sugerencias`:

1. **Insert**: permitir solo a usuarios autenticados crear sugerencias con `socio_id = auth.uid()`.
2. **Select**: permitir leer únicamente filas donde `socio_id = auth.uid()`.
3. **Update/Delete** (futuro): limitar a `socio_id = auth.uid()` o a roles administrativos.

Esto garantiza que cada socio vea únicamente sus propias sugerencias y que todas estén ligadas a un usuario Auth válido.

---

## 5. Pendientes Fase 2

- Validar migraciones SQL en ambientes de prueba.
- Conectar `/api/sugerencias` a esta tabla.
- Incorporar pruebas de RLS en `supabase/tests/test_rls.sql`.
