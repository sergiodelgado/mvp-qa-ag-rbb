/**
 * Check: Git Status Validation
 */

const { execSync } = require('child_process');
const { log } = require('../utils/logger');

const name = 'Git Status';

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
  log.section('🌿 Check: Git Status');
  
  // Verificar que no hay cambios sin commitear
  const statusResult = runCommand('git status --porcelain', { silent: true });
  
  if (statusResult.output && statusResult.output.trim().length > 0) {
    log.warning('Hay cambios sin commitear:');
    console.log(statusResult.output);
    return false;
  }

  // Verificar rama actual
  const branchResult = runCommand('git branch --show-current', { silent: true });
  const currentBranch = branchResult.output.trim();
  
  log.info(`Rama actual: ${currentBranch}`);
  
  if (currentBranch === 'main') {
    log.warning('Estás en la rama main. Asegúrate de que esto es intencional.');
  }

  log.success('Estado de Git validado');
  return true;
}

module.exports = { name, run };
