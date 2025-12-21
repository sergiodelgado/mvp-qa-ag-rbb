/**
 * Check: Critical Files Validation
 */

const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

const name = 'Critical Files';

async function run(ctx = {}) {
  log.section('📁 Check: Critical Files');
  
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    '.env.local',  // Solo en local, no en CI
    'Dockerfile',
    '.github/workflows/ci-f3b.yml',
  ];

  let allExist = true;
  
  for (const file of criticalFiles) {
    // Skip .env.local check in CI (variables come from secrets)
    if (file === '.env.local' && isCI) {
      log.info(`⊘ ${file} (omitido en CI - se usan secrets)`);
      continue;
    }
    
    const filePath = path.join(process.cwd(), file);
    if (!fs.existsSync(filePath)) {
      log.error(`Archivo crítico faltante: ${file}`);
      allExist = false;
    } else {
      log.info(`✓ ${file}`);
    }
  }

  if (allExist) {
    log.success('Todos los archivos críticos están presentes');
  }
  
  return allExist;
}

module.exports = { name, run };
