-- ==========================================
-- 007_fix_rls_performance.sql
-- Optimización de políticas RLS
-- MVP QA · AG RBB
-- ==========================================
-- 
-- Problema:
-- Las políticas RLS actuales llaman a auth.uid() directamente,
-- lo que causa que PostgreSQL re-evalúe la función para cada fila.
--
-- Solución:
-- Reemplazar auth.uid() con (SELECT auth.uid()) para que se
-- evalúe una sola vez y se almacene en un InitPlan.
--
-- Referencia: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
-- ==========================================

-- ==========================================
-- TABLA: socios
-- ==========================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "socios_select_own" ON public.socios;
DROP POLICY IF EXISTS "socios_insert_own" ON public.socios;
DROP POLICY IF EXISTS "socios_update_own" ON public.socios;

-- Recrear políticas con optimización de performance
CREATE POLICY "socios_select_own"
ON public.socios
FOR SELECT
USING ((SELECT auth.uid()) = id);

CREATE POLICY "socios_insert_own"
ON public.socios
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "socios_update_own"
ON public.socios
FOR UPDATE
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- ==========================================
-- TABLA: sugerencias
-- ==========================================

-- Eliminar políticas existentes
DROP POLICY IF EXISTS "sugerencias_select_own" ON public.sugerencias;
DROP POLICY IF EXISTS "sugerencias_insert_own" ON public.sugerencias;

-- Recrear políticas con optimización de performance
CREATE POLICY "sugerencias_select_own"
ON public.sugerencias
FOR SELECT
USING ((SELECT auth.uid()) = socio_id);

CREATE POLICY "sugerencias_insert_own"
ON public.sugerencias
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = socio_id);

-- ==========================================
-- FIN DE LA MIGRACIÓN
-- ==========================================
