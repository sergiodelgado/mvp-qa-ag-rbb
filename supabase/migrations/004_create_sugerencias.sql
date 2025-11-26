-- ==========================================
-- 004_create_sugerencias.sql
-- Tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

-- Supuesto: la extensión pgcrypto ya está habilitada para gen_random_uuid().
-- Si no lo está, descomenta la siguiente línea:
-- create extension if not exists "pgcrypto";

create table if not exists public.sugerencias (
  id uuid primary key default gen_random_uuid(),
  socio_id uuid not null,
  titulo text not null,
  contenido text not null,
  estado text not null default 'nueva',
  created_at timestamptz not null default now()
);

-- Relación con socios (1 socio N sugerencias)
alter table public.sugerencias
  add constraint sugerencias_socio_id_fkey
  foreign key (socio_id)
  references public.socios (id)
  on delete cascade;

