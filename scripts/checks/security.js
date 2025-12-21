/**
 * Check: Security Audit (npm audit)
 */

const { execSync } = require('child_process');
const { log } = require('../utils/logger');

const name = 'Security Audit';

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

async function run(ctx = {}) {
  log.section('🔒 Check: Security Audit');
  
  const result = runCommand('npm audit --audit-level=moderate', { silent: true });
  
  if (!result.success) {
    log.warning('Se encontraron vulnerabilidades. Ejecuta "npm audit" para más detalles.');
    console.log(result.output);
    
    log.info('Puedes ejecutar "npm audit fix" para intentar corregirlas automáticamente');
    return false;
  }

  log.success('No se encontraron vulnerabilidades críticas');
  return true;
}

module.exports = { name, run };
