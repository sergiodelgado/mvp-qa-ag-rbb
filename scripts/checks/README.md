# Audit System - Checks Architecture

Este directorio contiene los checks modulares del sistema de auditoría Quality Gate v1.

## 📁 Estructura

```
scripts/checks/
├── env.js              # Validación de variables de entorno
├── git.js              # Validación de estado de Git
├── critical-files.js   # Verificación de archivos críticos
├── security.js         # Auditoría de seguridad (npm audit)
└── rls.js              # Validación de políticas RLS de Supabase
```

## 🔧 Contrato Uniforme

Todos los checks siguen el mismo patrón:

```javascript
module.exports = {
  name: 'Check Name',
  async run(ctx = {}) {
    // Lógica de validación
    return true|false;  // true = pass, false = fail
  }
};
```

### Contexto (`ctx`)

El orquestador pasa un objeto de contexto a cada check:

```javascript
const ctx = {
  profile: 'quick' | 'standard' | 'full' | 'security'
};
```

Los checks pueden usar `ctx.profile` para lógica condicional.

## 🌐 Compatibilidad CI/Local

Todos los checks detectan automáticamente el entorno:

```javascript
const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';

if (isCI) {
  // Validar desde process.env (GitHub secrets)
} else {
  // Validar desde .env.local
}
```

## ➕ Agregar un Nuevo Check

1. **Crear archivo** en `scripts/checks/nuevo-check.js`

2. **Implementar contrato:**

```javascript
const { log } = require('../utils/logger');

const name = 'Nuevo Check';

async function run(ctx = {}) {
  log.section(`🔍 Check: ${name}`);
  
  // Tu lógica de validación aquí
  const isValid = true; // o false
  
  if (isValid) {
    log.success('Check pasó correctamente');
    return true;
  } else {
    log.error('Check falló');
    return false;
  }
}

module.exports = { name, run };
```

3. **Importar en `audit.js`:**

```javascript
const nuevoCheck = require('./checks/nuevo-check');

// Agregar al perfil deseado
const PROFILES = {
  full: {
    checks: [...existingChecks, nuevoCheck],
  },
};
```

## 📊 Checks Existentes

### `env.js` - Variables de Entorno

**Propósito:** Valida que todas las variables de entorno requeridas estén configuradas.

**Variables validadas:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**CI-aware:** ✅ Valida desde `process.env` en CI, desde `.env.local` en local.

---

### `git.js` - Estado de Git

**Propósito:** Verifica que no haya cambios sin commitear y muestra la rama actual.

**Validaciones:**
- No hay archivos modificados sin commitear
- Muestra rama actual
- Advierte si estás en `main`

**CI-aware:** ✅ Funciona en ambos entornos.

---

### `critical-files.js` - Archivos Críticos

**Propósito:** Verifica que todos los archivos críticos del proyecto existan.

**Archivos validados:**
- `package.json`
- `next.config.mjs`
- `tsconfig.json`
- `.env.local` (solo en local)
- `Dockerfile`
- `.github/workflows/ci-f3b.yml`

**CI-aware:** ✅ Omite `.env.local` en CI (usa secrets).

---

### `security.js` - Auditoría de Seguridad

**Propósito:** Ejecuta `npm audit` para detectar vulnerabilidades en dependencias.

**Nivel:** `--audit-level=moderate` (detecta vulnerabilidades moderadas y superiores)

**CI-aware:** ✅ Funciona en ambos entornos.

---

### `rls.js` - Validación de RLS

**Propósito:** Analiza migraciones SQL de Supabase para detectar políticas RLS no optimizadas.

**Detecta:**
- `auth.uid()` sin `SELECT` (causa re-evaluación por fila)
- `auth.jwt()` sin `SELECT`
- `auth.email()` sin `SELECT`

**Recomendación:** Usar `(SELECT auth.uid())` para evaluar una sola vez.

**CI-aware:** ✅ Valida env vars desde `process.env` en CI.

**Nota:** Reporta warnings en migraciones antiguas que ya fueron corregidas por migraciones posteriores (comportamiento aceptado).

---

## 🎯 Uso

Los checks son ejecutados automáticamente por `scripts/audit.js` según el perfil seleccionado:

```bash
npm run audit:quick      # env, git, lint
npm run audit:standard   # + criticalFiles, typecheck
npm run audit:full       # + security, rls
npm run audit:security   # solo security, rls
```

## 🔍 Debugging

Para ejecutar un check individual:

```javascript
const check = require('./scripts/checks/env');
check.run({ profile: 'full' }).then(result => {
  console.log('Result:', result);
});
```

## 📝 Exit Codes

- `0` - Todos los checks pasaron
- `1` - Al menos un check falló

Los exit codes son manejados por el orquestador (`audit.js`).
