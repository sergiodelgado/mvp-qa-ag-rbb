/**
 * Check: Critical Files Validation
 */

const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

const name = 'Critical Files';

async function run(ctx = {}) {
  log.section('📁 Check: Critical Files');
  
  const criticalFiles = [
    'package.json',
    'next.config.mjs',
    'tsconfig.json',
    '.env.local',
    'Dockerfile',
    '.github/workflows/ci-f3b.yml',
  ];

  let allExist = true;
  
  for (const file of criticalFiles) {
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
