-- ============================================
-- 003_rls_policies_socios.sql
-- Row Level Security para socios
--  - Cada usuario solo ve/modifica su propio registro
-- ============================================

-- Verifica existencia de tabla
do $$
begin
  if not exists (
    select 1
    from pg_tables
    where schemaname = 'public'
      and tablename = 'socios'
  ) then
    raise exception 'Tabla public.socios no existe. Ejecutar migraciones 001 y 002 primero.';
  end if;
end$$;

-- 1) Activar RLS
alter table public.socios enable row level security;

-- 2) Limpiar políticas anteriores (si existieran)
drop policy if exists "socios_select_own" on public.socios;
drop policy if exists "socios_insert_own" on public.socios;
drop policy if exists "socios_update_own" on public.socios;

-- 3) Política: cada usuario ve solo su propio registro
create policy "socios_select_own"
on public.socios
for select
using (auth.uid() = id);

-- 4) Política: cada usuario inserta solo su propio registro
create policy "socios_insert_own"
on public.socios
for insert
with check (auth.uid() = id);

-- 5) Política: cada usuario actualiza solo su propio registro
create policy "socios_update_own"
on public.socios
for update
using (auth.uid() = id);
