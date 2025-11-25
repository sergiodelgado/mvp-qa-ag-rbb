-- ============================================
-- 001_create_socios.sql
-- Tabla base: socios
-- MVP QA · AG RBB
-- ============================================

create table if not exists public.socios (
  id uuid primary key,
  email text not null,
  nombre text not null,
  created_at timestamptz not null default now(),
  rol text null,
  estado text null
);

comment on table public.socios is
  'Tabla de socios AG RBB. 1:1 con auth.users.';

comment on column public.socios.id is
  'UUID del usuario, igual a auth.users.id';

comment on column public.socios.email is
  'Correo del socio, sincronizado con Supabase Auth';

comment on column public.socios.nombre is
  'Nombre o alias visible en la interfaz';

comment on column public.socios.created_at is
  'Fecha de creación del registro del socio';

comment on column public.socios.rol is
  'Rol lógico del socio (MVP: socio)';

comment on column public.socios.estado is
  'Estado del socio (MVP: activo/inactivo, no usado aún)';
