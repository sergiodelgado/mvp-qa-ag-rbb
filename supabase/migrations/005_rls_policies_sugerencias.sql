-- ==========================================
-- 005_rls_policies_sugerencias.sql
-- RLS para tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

alter table public.sugerencias
  enable row level security;

create policy "sugerencias_select_own"
on public.sugerencias
for select
using ( auth.uid() = socio_id );

create policy "sugerencias_insert_own"
on public.sugerencias
for insert
with check ( auth.uid() = socio_id );
