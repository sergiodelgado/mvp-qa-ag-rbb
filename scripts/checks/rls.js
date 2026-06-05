#!/usr/bin/env node

/**
 * Check: Supabase RLS Validation
 *
 * Valida que las políticas RLS estén optimizadas
 * para evitar el problema de auth_rls_initplan
 */

const fs = require('fs')
const path = require('path')
const { log, colors } = require('../utils/logger')

const name = 'Supabase RLS'

// Patrones problemáticos en RLS
const PROBLEMATIC_PATTERNS = [
  {
    pattern: /(?<!\(\s*select\s+)auth\.uid\(\)/gi,
    issue: 'auth.uid() sin SELECT',
    recommendation: 'Usar (SELECT auth.uid()) para evitar re-evaluación',
    severity: 'high'
  },
  {
    pattern: /(?<!\(\s*select\s+)auth\.jwt\(\)/gi,
    issue: 'auth.jwt() sin SELECT',
    recommendation: 'Usar (SELECT auth.jwt()) para evitar re-evaluación',
    severity: 'high'
  },
  {
    pattern: /(?<!\(\s*select\s+)auth\.email\(\)/gi,
    issue: 'auth.email() sin SELECT',
    recommendation: 'Usar (SELECT auth.email()) para evitar re-evaluación',
    severity: 'medium'
  }
]

// Patrones optimizados (correctos)
const OPTIMIZED_PATTERNS = [
  /\(\s*SELECT\s+auth\.uid\(\)\s*\)/gi,
  /\(\s*SELECT\s+auth\.jwt\(\)\s*\)/gi,
  /\(\s*SELECT\s+auth\.email\(\)\s*\)/gi
]

function analyzeMigrationFile(filePath) {
  const rawContent = fs.readFileSync(filePath, 'utf-8')
  const fileName = path.basename(filePath)

  // Ignorar comentarios SQL de línea completa para evitar falsos positivos.
  // Ejemplo ignorado: -- auth.uid() = socio_id
  const content = rawContent
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n')

  const issues = []
  const optimizations = []

  // Buscar patrones problemáticos
  PROBLEMATIC_PATTERNS.forEach(({ pattern, issue, recommendation, severity }) => {
    const matches = content.match(pattern)

    if (matches) {
      issues.push({
        file: fileName,
        issue,
        recommendation,
        severity,
        occurrences: matches.length
      })
    }
  })

  // Contar optimizaciones existentes
  OPTIMIZED_PATTERNS.forEach((pattern) => {
    const matches = content.match(pattern)
    if (matches) {
      optimizations.push({
        file: fileName,
        count: matches.length
      })
    }
  })

  return { issues, optimizations }
}

async function run(ctx = {}) {
  log.section('🔍 Check: Supabase RLS')

  // En perfiles full/security: validar que existan las env vars requeridas
  const requiresEnvVars = ctx.profile === 'full' || ctx.profile === 'security'

  if (requiresEnvVars) {
    const envPath = path.join(process.cwd(), '.env.local')
    if (!fs.existsSync(envPath)) {
      log.error('Archivo .env.local no encontrado (requerido para validación de RLS)')
      return false
    }

    const envContent = fs.readFileSync(envPath, 'utf-8')
    const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']
    const missing = requiredVars.filter(
      (v) => !new RegExp(`^${v}=.+`, 'm').test(envContent)
    )

    if (missing.length > 0) {
      log.error(
        `Variables de entorno faltantes para validación de RLS: ${missing.join(', ')}`
      )
      return false
    }
  }

  const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations')

  if (!fs.existsSync(migrationsDir)) {
    log.error('Directorio de migraciones no encontrado: supabase/migrations/')
    return false
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .map((file) => path.join(migrationsDir, file))

  if (files.length === 0) {
    log.warning('No se encontraron archivos de migración SQL')
    return true
  }

  log.info(`Analizando ${files.length} archivo(s) de migración...\n`)

  let totalIssues = 0
  let totalOptimizations = 0
  const allIssues = []

  files.forEach((file) => {
    const { issues, optimizations } = analyzeMigrationFile(file)

    if (issues.length > 0) {
      totalIssues += issues.length
      allIssues.push(...issues)
    }

    if (optimizations.length > 0) {
      totalOptimizations += optimizations.reduce((sum, opt) => sum + opt.count, 0)
    }
  })

  // Reporte de resultados
  if (allIssues.length > 0) {
    log.warning(`Se encontraron ${allIssues.length} problema(s) de RLS:\n`)

    allIssues.forEach((issue, index) => {
      const severityColor = issue.severity === 'high' ? colors.red : colors.yellow
      console.log(
        `${index + 1}. ${severityColor}[${issue.severity.toUpperCase()}]${colors.reset} ${issue.file}`
      )
      console.log(`   Problema: ${issue.issue}`)
      console.log(`   Ocurrencias: ${issue.occurrences}`)
      console.log(
        `   Recomendación: ${colors.cyan}${issue.recommendation}${colors.reset}\n`
      )
    })

    log.error('❌ Auditoría de RLS falló. Corrige los problemas antes de deploy.')
    return false
  }

  if (totalOptimizations > 0) {
    log.success(`✅ ${totalOptimizations} optimización(es) RLS encontradas`)
  }

  log.success('✅ Todas las políticas RLS están optimizadas')
  return true
}

function generateFixSuggestions() {
  log.section('💡 Sugerencias de Corrección')

  console.log(`${colors.bright}Ejemplo de corrección:${colors.reset}\n`)

  console.log(`${colors.red}❌ Incorrecto:${colors.reset}`)
  console.log(`CREATE POLICY "policy_name" ON public.table_name
  FOR SELECT
  USING (user_id = auth.uid());
`)

  console.log(`${colors.green}✅ Correcto:${colors.reset}`)
  console.log(`CREATE POLICY "policy_name" ON public.table_name
  FOR SELECT
  USING (user_id = (SELECT auth.uid()));
`)

  console.log(`\n${colors.bright}¿Por qué?${colors.reset}`)
  console.log(`
Sin el SELECT, Supabase re-evalúa auth.uid() para cada fila,
causando problemas de performance (auth_rls_initplan warning).

Con (SELECT auth.uid()), la función se evalúa una sola vez
y el resultado se reutiliza para todas las filas.
  `)
}

module.exports = { name, run }

// Permitir ejecución standalone
if (require.main === module) {
  run()
    .then((success) => {
      if (!success) {
        generateFixSuggestions()
        process.exit(1)
      }
      process.exit(0)
    })
    .catch((error) => {
      log.error(`Error fatal: ${error.message}`)
      process.exit(1)
    })
}
