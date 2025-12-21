-- ==========================================
-- Verificación de Políticas RLS Optimizadas
-- ==========================================

-- Este script verifica que las políticas RLS se hayan
-- creado correctamente con la optimización de performance

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual AS "USING (expression)",
    with_check AS "WITH CHECK (expression)"
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('socios', 'sugerencias')
ORDER BY tablename, policyname;

-- ==========================================
-- Lo que debes ver:
-- ==========================================
-- 
-- Para SOCIOS:
-- 1. socios_select_own (SELECT):
--    USING: ((SELECT auth.uid()) = id)
--    WITH CHECK: NULL
--
-- 2. socios_insert_own (INSERT):
--    USING: NULL
--    WITH CHECK: ((SELECT auth.uid()) = id)
--
-- 3. socios_update_own (UPDATE):
--    USING: ((SELECT auth.uid()) = id)
--    WITH CHECK: ((SELECT auth.uid()) = id)
--
-- Para SUGERENCIAS:
-- 4. sugerencias_select_own (SELECT):
--    USING: ((SELECT auth.uid()) = socio_id)
--    WITH CHECK: NULL
--
-- 5. sugerencias_insert_own (INSERT):
--    USING: NULL
--    WITH CHECK: ((SELECT auth.uid()) = socio_id)
--
-- ==========================================
-- CLAVE: Busca "(SELECT auth.uid())" con paréntesis extras
-- ==========================================
