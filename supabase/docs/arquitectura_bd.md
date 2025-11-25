# Arquitectura de Base de Datos – MVP QA · AG RBB

Este documento describe la estructura mínima de la base de datos utilizada en el MVP, su relación con **Supabase Auth**, y el rol que cumple en los flujos de registro, login y buzón.

---

## 1. Tabla `socios`

La tabla `socios` almacena el perfil básico de cada usuario registrado en el sistema.
Es una tabla **1:1 con `auth.users`**, lo que significa que cada usuario autenticado en Supabase Auth tiene exactamente un registro asociado en `public.socios`.

### Campos

| Campo        | Tipo        | Obligatorio  | Descripción                                                  |
| ------------ | ----------- | ------------ | ------------------------------------------------------------ |
| `id`         | uuid        | Sí           | Identificador del socio. Debe coincidir con `auth.users.id`. |
| `email`      | text        | Sí           | Email del socio. Se mantiene sincronizado con Auth.          |
| `nombre`     | text        | Sí           | Nombre o alias visible en el buzón.                          |
| `created_at` | timestamptz | Sí           | Fecha de creación. Default: `now()`.                         |
| `rol`        | text        | No (default) | Rol lógico del socio. Default: `socio`.                      |
| `estado`     | text        | No (default) | Estado del socio. Default: `activo`.                         |

---

## 2. Esquema SQL (base + integridad + RLS)

### Estructura de la tabla

```sql
create table public.socios (
  id uuid primary key,
  email text not null,
  nombre text not null,
  created_at timestamptz not null default now(),
  rol text default 'socio',
  estado text default 'activo'
);
```

### Integridad con `auth.users`

```sql
alter table public.socios
  add constraint socios_id_fkey
  foreign key (id)
  references auth.users(id)
  on delete cascade;
```

### Row Level Security

```sql
alter table public.socios enable row level security;

create policy "socios_select_own"
on public.socios
for select
using (auth.uid() = id);

create policy "socios_insert_own"
on public.socios
for insert
with check (auth.uid() = id);

create policy "socios_update_own"
on public.socios
for update
using (auth.uid() = id);
```

---

## 3. Diagrama 1:1 con Supabase Auth

### Representación conceptual

```
┌───────────────────────┐         1       1         ┌────────────────────────┐
│     auth.users         │──────────────────────────▶│     public.socios       │
├───────────────────────┤                           ├────────────────────────┤
│ id (uuid)              │                           │ id (uuid, PK, FK→Auth) │
│ email                  │                           │ email                  │
│ ... otros campos ...   │                           │ nombre                 │
└───────────────────────┘                           │ created_at             │
                                                    │ rol                    │
                                                    │ estado                 │
                                                    └────────────────────────┘
```

### Regla principal

**`socios.id` siempre debe ser igual a `auth.users.id`.**

Esto garantiza integridad entre autenticación y perfil visible.

---

## 4. Cómo se usa en el MVP

### 4.1 Registro (`/register`)

1. El usuario ingresa email + password + nombre.
2. Se crea el usuario en Supabase Auth.
3. Se inserta un registro en `socios` con:

   * `id = auth.users.id`
   * `email = email ingresado`
   * `nombre = alias indicado`
4. Redirección a `/login`.

### 4.2 Login (`/login`)

* La sesión se valida con Supabase Auth.
* Si login es exitoso, el usuario va directo a `/buzon`.

### 4.3 Buzón (`/buzon`)

* Solo accesible si el usuario está autenticado.
* La app puede leer el perfil del socio usando RLS
  → solo puede leer *su propio registro*.

### 4.4 API interna: `/api/socios` (Fase 2)

* El endpoint puede listar o crear registros usando el **service role**, lo que ignora RLS.
* Se usa para pruebas automatizadas y administración interna.

---

## 5. Resumen

* La arquitectura es deliberadamente mínima y segura.
* `auth.users` maneja autenticación.
* `public.socios` maneja el contexto AG RBB.
* RLS garantiza que cada socio solo acceda a su propio registro.
* El diseño es estable para pruebas manuales, E2E (Cypress) y API (Postman/Newman).

---

Este documento representa el diseño oficial de la BD para el MVP QA · AG RBB y debe mantenerse sincronizado con las migraciones en `supabase/migrations/`.
