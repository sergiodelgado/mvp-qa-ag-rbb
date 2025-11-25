-- ==========================================
-- 004_create_sugerencias.sql
-- Tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

create table if not exists public.sugerencias (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null,
  titulo text not null,
  contenido text not null,
  estado text not null default 'nueva',
  created_at timestamptz not null default now()
);

alter table public.sugerencias
  add constraint sugerencias_socio_id_fkey
  foreign key (socio_id)
  references public.socios (id)
  on delete cascade;
