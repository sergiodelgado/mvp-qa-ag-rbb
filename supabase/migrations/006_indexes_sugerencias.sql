-- ==========================================
-- 006_indexes_sugerencias.sql
-- Índices para tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

create index if not exists sugerencias_socio_id_idx
on public.sugerencias (socio_id);

create index if not exists sugerencias_socio_id_created_at_idx
on public.sugerencias (socio_id, created_at desc);
