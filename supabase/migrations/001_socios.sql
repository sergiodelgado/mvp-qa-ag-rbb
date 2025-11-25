-- ==========================================
-- 001_socios.sql
-- Tabla: socios
-- MVP QA · AG RBB
-- Migración oficial
-- ==========================================

-- 0) Crear tabla base
create table public.socios (
  id uuid primary key,
  email text not null,
  nombre text not null,
  created_at timestamptz not null default now(),
  rol text null,
  estado text null
);

-- 1) Agregar FK hacia auth.users
alter table public.socios
  add constraint socios_id_fkey
  foreign key (id)
  references auth.users(id)
  on delete cascade;

-- 2) Defaults para rol y estado
alter table public.socios
  alter column rol set default 'socio',
  alter column estado set default 'activo';

-- 3) Normalizar filas existentes
update public.socios
set rol = coalesce(rol, 'socio'),
    estado = coalesce(estado, 'activo');

-- ==========================================
-- Activar RLS y definir políticas
-- ==========================================

-- 1) Activar RLS
alter table public.socios enable row level security;

-- 2) Política: leer solo tu perfil
create policy "socios_select_own"
on public.socios
for select
using (auth.uid() = id);

-- 3) Política: insertar tu propio perfil
create policy "socios_insert_own"
on public.socios
for insert
with check (auth.uid() = id);

-- 4) Política: actualizar tu propio perfil
create policy "socios_update_own"
on public.socios
for update
using (auth.uid() = id);
