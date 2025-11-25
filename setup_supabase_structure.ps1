# ============================================
# Script: setup_supabase_structure.ps1
# Crea la estructura supabase/ para el MVP QA AG RBB
# Pregunta antes de sobreescribir carpetas y archivos
# ============================================

function Confirm-Overwrite($Path) {
    if (Test-Path $Path) {
        Write-Host ""
        Write-Host "⚠️  Ya existe: $Path"
        $choice = Read-Host "¿Deseas mantenerlo (M) o sobreescribirlo (S)? [M/S]"
        
        if ($choice -eq "S" -or $choice -eq "s") {
            return $true
        } else {
            return $false
        }
    }
    return $true
}

function Create-Folder($Path) {
    if (Confirm-Overwrite $Path) {
        if (Test-Path $Path) {
            Remove-Item $Path -Recurse -Force
        }
        New-Item -ItemType Directory -Path $Path | Out-Null
        Write-Host "📁 Carpeta creada: $Path"
    } else {
        Write-Host "🔒 Manteniendo carpeta: $Path"
    }
}

function Create-File($Path, $Content) {
    if (Confirm-Overwrite $Path) {
        Set-Content -Path $Path -Value $Content
        Write-Host "📝 Archivo creado: $Path"
    } else {
        Write-Host "🔒 Manteniendo archivo: $Path"
    }
}

Write-Host ""
Write-Host "============== SUPABASE SETUP =============="
Write-Host "Creando estructura completa de supabase/"
Write-Host "============================================"
Write-Host ""

# --------------------------------------------
# Crear carpetas
# --------------------------------------------

Create-Folder "supabase"
Create-Folder "supabase/migrations"
Create-Folder "supabase/seeds"
Create-Folder "supabase/docs"
Create-Folder "supabase/tests"
Create-Folder "supabase/utils"

# --------------------------------------------
# Crear archivos de migraciones
# --------------------------------------------

Create-File "supabase/migrations/001_create_socios.sql" "-- 001_create_socios.sql"
Create-File "supabase/migrations/002_alter_socios_defaults_fk.sql" "-- 002_alter_socios_defaults_fk.sql"
Create-File "supabase/migrations/003_rls_policies_socios.sql" "-- 003_rls_policies_socios.sql"

# --------------------------------------------
# Seeds
# --------------------------------------------

Create-File "supabase/seeds/socios_seed.sql" "-- Seed inicial de ejemplo para socios"

# --------------------------------------------
# Documentación
# --------------------------------------------

Create-File "supabase/docs/arquitectura_bd.md" "# Arquitectura BD del MVP"
Create-File "supabase/docs/migraciones.md" "# Registro de migraciones aplicadas"

# --------------------------------------------
# Tests SQL
# --------------------------------------------

Create-File "supabase/tests/test_queries.sql" "-- Consultas de prueba (lectura básica)"
Create-File "supabase/tests/test_rls.sql" "-- Pruebas de Row Level Security"

# --------------------------------------------
# Scripts utilitarios
# --------------------------------------------

Create-File "supabase/utils/reset_db.sh" "#!/bin/bash`n# Script para limpiar o reinicializar (placeholder)"

Write-Host ""
Write-Host "🎉 Estructura supabase/ creada con éxito."
Write-Host "============================================"
