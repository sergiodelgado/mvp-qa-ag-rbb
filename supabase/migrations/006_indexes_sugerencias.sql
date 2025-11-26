-- ==========================================
-- 006_indexes_sugerencias.sql
-- Índices para tabla: sugerencias
-- MVP QA · AG RBB · Fase 2
-- ==========================================

-- Índice por socio_id para acelerar listados por usuario
create index if not exists sugerencias_socio_id_idx
on public.sugerencias (socio_id);

-- Índice combinado por socio_id + created_at desc
-- útil para listar sugerencias propias ordenadas por fecha
create index if not exists sugerencias_socio_id_created_at_idx
on public.sugerencias (socio_id, created_at desc);

-- (Opcional) Índice por estado, si después filtras por estado
-- create index if not exists sugerencias_estado_idx
-- on public.sugerencias (estado);
