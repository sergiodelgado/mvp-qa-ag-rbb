-- ============================================
-- 002_alter_socios_defaults_fk.sql
-- Ajustes de integridad y defaults:
--  - FK hacia auth.users
--  - Defaults para rol y estado
--  - Normalización de filas existentes
-- ============================================

-- Asegura que exista la tabla antes de tocarla
do $$
begin
  if not exists (
    select 1
    from pg_tables
    where schemaname = 'public'
      and tablename = 'socios'
  ) then
    raise exception 'Tabla public.socios no existe. Ejecutar 001_create_socios.sql primero.';
  end if;
end$$;

-- 1) Foreign key hacia auth.users
alter table public.socios
  drop constraint if exists socios_id_fkey;

alter table public.socios
  add constraint socios_id_fkey
  foreign key (id)
  references auth.users(id)
  on delete cascade;

-- 2) Defaults para rol y estado
alter table public.socios
  alter column rol set default 'socio',
  alter column estado set default 'activo';

-- 3) Normalizar filas ya existentes
update public.socios
set rol = coalesce(rol, 'socio'),
    estado = coalesce(estado, 'activo');
