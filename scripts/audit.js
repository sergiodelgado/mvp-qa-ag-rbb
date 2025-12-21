#!/usr/bin/env node

/**
 * Orquestador de Validaciones Pre-Deploy
 * 
 * Este script ejecuta validaciones estáticas del estado del repositorio
 * según el perfil seleccionado (quick, standard, full, security).
 */

const { execSync } = require('child_process');
const { colors, log } = require('./utils/logger');

// Importar checks modulares
const envCheck = require('./checks/env');
const gitCheck = require('./checks/git');
const criticalFilesCheck = require('./checks/critical-files');
const securityCheck = require('./checks/security');
const rlsCheck = require('./checks/rls');

// Ejecutar comando y capturar resultado
function runCommand(command, options = {}) {
  try {
    const output = execSync(command, {
      encoding: 'utf-8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error, output: error.stdout || error.stderr };
  }
}

// Checks adicionales que usan comandos npm
const lintCheck = {
  name: 'Linting',
  async run() {
    log.section('📝 Check: Linting');
    
    const result = runCommand('npm run lint');
    
    if (!result.success) {
      log.error('Linting falló. Revisa los errores arriba.');
      return false;
    }

    log.success('Linting completado sin errores');
    return true;
  }
};

const typeCheck = {
  name: 'TypeScript',
  async run() {
    log.section('🔍 Check: TypeScript');
    
    const result = runCommand('npx tsc --noEmit', { silent: true });
    
    if (!result.success) {
      log.error('Errores de TypeScript encontrados:');
      console.log(result.output);
      return false;
    }

    log.success('Verificación de tipos completada sin errores');
    return true;
  }
};

// Definición de perfiles
const PROFILES = {
  quick: {
    description: 'Validación rápida (env, git, lint)',
    checks: [envCheck, gitCheck, lintCheck],
  },
  standard: {
    description: 'Validación estándar (env, archivos críticos, git, typecheck, lint)',
    checks: [envCheck, criticalFilesCheck, gitCheck, typeCheck, lintCheck],
  },
  full: {
    description: 'Validación completa (incluye security y RLS)',
    checks: [envCheck, criticalFilesCheck, gitCheck, typeCheck, lintCheck, securityCheck, rlsCheck],
  },
  security: {
    description: 'Solo checks de seguridad (npm audit y RLS)',
    checks: [securityCheck, rlsCheck],
  },
};

// Parsear argumentos de línea de comandos
function parseArgs() {
  const args = process.argv.slice(2);
  let profile = 'standard'; // Default profile
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--profile' && args[i + 1]) {
      profile = args[i + 1];
      i++;
    }
  }
  
  if (!PROFILES[profile]) {
    log.error(`Perfil desconocido: ${profile}`);
    log.info(`Perfiles disponibles: ${Object.keys(PROFILES).join(', ')}`);
    process.exit(1);
  }
  
  return { profile };
}

// Función principal
async function runAudit() {
  const { profile } = parseArgs();
  const profileConfig = PROFILES[profile];
  
  console.log(`
${colors.bright}${colors.cyan}╔════════════════════════════════════════════════════════════╗
║                                                            ║
║           AUDITORÍA ESTÁTICA - MVP QA AG RBB              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝${colors.reset}
  `);
  
  log.info(`Perfil: ${colors.bright}${profile}${colors.reset}`);
  log.info(`Descripción: ${profileConfig.description}`);
  log.info(`Checks a ejecutar: ${profileConfig.checks.length}\n`);

  const results = {
    passed: [],
    failed: [],
  };

  const ctx = { profile }; // Contexto para pasar a los checks

  // Ejecutar todos los checks del perfil
  for (const check of profileConfig.checks) {
    try {
      const passed = await check.run(ctx);
      if (passed) {
        results.passed.push(check.name);
      } else {
        results.failed.push(check.name);
      }
    } catch (error) {
      log.error(`Error en check ${check.name}: ${error.message}`);
      results.failed.push(check.name);
    }
  }

  // Resumen final
  log.section('📊 Resumen de Auditoría');
  
  console.log(`${colors.green}✓ Checks exitosos (${results.passed.length}):${colors.reset}`);
  results.passed.forEach(name => console.log(`  - ${name}`));
  
  if (results.failed.length > 0) {
    console.log(`\n${colors.red}✗ Checks fallidos (${results.failed.length}):${colors.reset}`);
    results.failed.forEach(name => console.log(`  - ${name}`));
  }

  const totalChecks = profileConfig.checks.length;
  const passRate = ((results.passed.length / totalChecks) * 100).toFixed(1);

  console.log(`\n${colors.bright}Tasa de éxito: ${passRate}%${colors.reset}`);

  if (results.failed.length === 0) {
    console.log(`\n${colors.green}${colors.bright}🎉 ¡Auditoría completada exitosamente!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}${colors.bright}⚠️  Hay ${results.failed.length} check(s) que requieren atención.${colors.reset}\n`);
    process.exit(1);
  }
}

// Ejecutar
runAudit().catch(error => {
  log.error(`Error fatal: ${error.message}`);
  process.exit(1);
});
