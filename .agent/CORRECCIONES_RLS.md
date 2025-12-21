# Correcciones Aplicadas a la Migración RLS

**Fecha:** 2025-12-20  
**Archivo:** `007_fix_rls_performance.sql`

---

## ✅ Correcciones Realizadas

### 1. **Agregado `WITH CHECK` en `socios_update_own`**

**Problema identificado:**  
La política `socios_update_own` solo tenía `USING`, lo cual es incompleto para operaciones de UPDATE.

**Explicación:**  
Para políticas de UPDATE, se necesitan **ambos** controles:
- **`USING`**: Controla **qué filas** puede tocar el usuario (pre-condición)
- **`WITH CHECK`**: Controla **qué valores** puede establecer el usuario después del update (post-condición)

**Sin `WITH CHECK`:**  
Un usuario malicioso podría actualizar su propia fila para cambiar el `id` (o cualquier columna relevante) y "transferir" el registro a otro usuario.

**Ejemplo del riesgo:**
```sql
-- ❌ Sin WITH CHECK (vulnerable)
UPDATE socios SET id = 'otro-usuario-uuid' WHERE id = auth.uid();
-- Esto podría permitir "transferir" tu perfil a otro usuario
```

**Con `WITH CHECK` (seguro):**
```sql
-- ✅ Con WITH CHECK (seguro)
UPDATE socios SET id = 'otro-usuario-uuid' WHERE id = auth.uid();
-- ERROR: new row violates row-level security policy for table "socios"
```

---

### 2. **Verificación de Columnas**

Se confirmó que las columnas comparadas son correctas:

#### Tabla `socios`:
```sql
-- Estructura:
id UUID PRIMARY KEY → FK a auth.users(id)

-- Política correcta:
(SELECT auth.uid()) = id  ✅
```

**Confirmación:**  
La tabla `socios` usa `id` como PK que **ES** la FK a `auth.users(id)` (líneas 10, 19-23 de `001_socios.sql`).

No hay columna separada `user_id`, por lo que `id` es la comparación correcta.

#### Tabla `sugerencias`:
```sql
-- Estructura:
id UUID PRIMARY KEY
socio_id UUID → FK a public.socios(id)

-- Política correcta:
(SELECT auth.uid()) = socio_id  ✅
```

**Confirmación:**  
La tabla `sugerencias` tiene `socio_id` que referencia a `public.socios(id)` (líneas 13, 21-25 de `004_create_sugerencias.sql`).

Como `socios.id` = `auth.users.id`, entonces comparar contra `socio_id` es correcto.

---

## 📋 Migración Final (Versión Corregida)

```sql
-- ==========================================
-- 007_fix_rls_performance.sql
-- Optimización de políticas RLS
-- MVP QA · AG RBB
-- ==========================================

-- ==========================================
-- TABLA: socios
-- ==========================================

DROP POLICY IF EXISTS "socios_select_own" ON public.socios;
DROP POLICY IF EXISTS "socios_insert_own" ON public.socios;
DROP POLICY IF EXISTS "socios_update_own" ON public.socios;

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
WITH CHECK ((SELECT auth.uid()) = id);  -- ✅ CORREGIDO

-- ==========================================
-- TABLA: sugerencias
-- ==========================================

DROP POLICY IF EXISTS "sugerencias_select_own" ON public.sugerencias;
DROP POLICY IF EXISTS "sugerencias_insert_own" ON public.sugerencias;

CREATE POLICY "sugerencias_select_own"
ON public.sugerencias
FOR SELECT
USING ((SELECT auth.uid()) = socio_id);

CREATE POLICY "sugerencias_insert_own"
ON public.sugerencias
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = socio_id);
```

---

## 🎯 Resumen de Cambios

| Política | Antes | Después | Notas |
|----------|-------|---------|-------|
| `socios_select_own` | `auth.uid()` | `(SELECT auth.uid())` | ✅ Performance fix |
| `socios_insert_own` | `auth.uid()` | `(SELECT auth.uid())` | ✅ Performance fix |
| `socios_update_own` | Solo `USING` | `USING` + `WITH CHECK` | ✅ **Security fix + Performance** |
| `sugerencias_select_own` | `auth.uid()` | `(SELECT auth.uid())` | ✅ Performance fix |
| `sugerencias_insert_own` | `auth.uid()` | `(SELECT auth.uid())` | ✅ Performance fix |

---

## 🔒 Contexto: ¿Cuándo Aplican Estas Políticas?

**RLS NO aplica cuando:**
- Usas `service_role_key` (bypass completo de RLS)
- Tus inserts anónimos desde el servidor usan service role ✅

**RLS SÍ aplica cuando:**
- El cliente hace queries directamente a Supabase con `anon` key
- Usuarios autenticados hacen SELECT/INSERT/UPDATE desde el cliente
- Cualquier query que no use service role

Por lo tanto, estas políticas son importantes para:
1. Lecturas desde el cliente (ej: home feed cargando sugerencias del usuario)
2. Inserts/updates autenticados desde el cliente (si los implementas en el futuro)
3. Cualquier acceso directo a las tablas desde el browser

---

## ✅ Estado Final

- ✅ **Performance fix**: Todas las políticas usan `(SELECT auth.uid())`
- ✅ **Security fix**: `socios_update_own` ahora tiene `WITH CHECK`
- ✅ **Verificado**: Columnas comparadas son correctas (`id` y `socio_id`)
- ✅ **Listo para aplicar**: La migración está completa y segura

---

## 📚 Referencias Adicionales

- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/sql-createpolicy.html)
- [Supabase RLS Best Practices](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Understanding USING vs WITH CHECK](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)

---

**Próximo paso:** Aplicar la migración corregida en Supabase 🚀
