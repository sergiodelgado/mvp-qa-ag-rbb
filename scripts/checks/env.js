/**
 * Check: Environment Variables Validation
 */

const fs = require('fs');
const path = require('path');
const { log } = require('../utils/logger');

const name = 'Environment Variables';

async function run(ctx = {}) {
  log.section('🔐 Check: Environment Variables');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];

  const envPath = path.join(process.cwd(), '.env.local');
  const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
  
  // En CI: validar desde process.env
  if (isCI) {
    log.info('Entorno CI detectado - validando desde process.env');
    
    const missing = requiredVars.filter(varName => !process.env[varName]);
    
    if (missing.length > 0) {
      log.error(`Variables faltantes en CI: ${missing.join(', ')}`);
      return false;
    }
    
    log.success('Todas las variables de entorno están configuradas en CI');
    return true;
  }
  
  // En local: validar desde .env.local
  if (!fs.existsSync(envPath)) {
    log.error('Archivo .env.local no encontrado');
    log.info('Tip: Copia .env.example a .env.local y completa las variables');
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const missing = requiredVars.filter(varName => {
    const regex = new RegExp(`^${varName}=.+`, 'm');
    return !regex.test(envContent);
  });

  if (missing.length > 0) {
    log.error(`Variables faltantes en .env.local: ${missing.join(', ')}`);
    return false;
  }

  log.success('Todas las variables de entorno están configuradas');
  return true;
}

module.exports = { name, run };
