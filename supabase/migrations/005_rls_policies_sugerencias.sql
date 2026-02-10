-- ==========================================
-- 005_rls_policies_sugerencias.sql
-- RLS para tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

-- Activar Row Level Security en la tabla
alter table public.sugerencias
  enable row level security;

-- Opcional: para evitar sorpresas, eliminar políticas previas
-- drop policy if exists "sugerencias_select_own" on public.sugerencias;
-- drop policy if exists "sugerencias_insert_own" on public.sugerencias;

-- Política: cada usuario solo puede ver sus propias sugerencias
create policy "sugerencias_select_own"
on public.sugerencias
for select
using ( (select auth.uid()) = socio_id );

-- Política: cada usuario solo puede insertar sugerencias para sí mismo
create policy "sugerencias_insert_own"
on public.sugerencias
for insert
with check ( (select auth.uid()) = socio_id );

-- NOTA:
--  - No se definen políticas de UPDATE/DELETE en Fase 2 (solo create + read).
--  - Si se agregan más adelante, deben respetar la misma condición:
--    auth.uid() = socio_id.
