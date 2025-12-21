# Guía de Pruebas Locales - MVP QA AG RBB

**Fecha:** 2025-12-20  
**Versión:** v2.0.0

---

## 🎯 **Objetivo**

Ejecutar el proyecto localmente y realizar pruebas de funcionalidad después de la migración RLS.

---

## ✅ **Pre-requisitos**

- [x] Node.js instalado
- [x] Dependencias instaladas (`npm install`)
- [x] `.env.local` configurado con credenciales de Supabase
- [x] Migración RLS aplicada en Supabase Cloud

---

## 🚀 **Opción 1: Servidor de Desarrollo (Recomendado)**

### **Paso 1: Levantar el servidor de desarrollo**

```bash
npm run dev
```

**Resultado esperado:**
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
- Ready in X ms
```

### **Paso 2: Abrir la aplicación**

Abre tu navegador en: **http://localhost:3000**

### **Paso 3: Pruebas manuales**

#### A) **Página de Inicio (Home Feed)**
- [ ] La página carga correctamente
- [ ] Se muestran las sugerencias (si las hay)
- [ ] El estado de autenticación se muestra correctamente

#### B) **Autenticación (si aplica)**
- [ ] Puedes hacer login
- [ ] El perfil del usuario se carga correctamente
- [ ] Solo ves TUS datos (validación de RLS)

#### C) **Buzón de Sugerencias**
- [ ] Puedes acceder a `/buzon`
- [ ] Puedes enviar una sugerencia anónima
- [ ] Puedes enviar una sugerencia autenticada (si estás logueado)

#### D) **API Endpoints**
Prueba los endpoints manualmente:

**1. Health Check:**
```bash
curl http://localhost:3000/api/health
```

**2. Sugerencias (GET):**
```bash
curl http://localhost:3000/api/sugerencias
```

**3. Crear Sugerencia (POST) - Anónima:**
```bash
curl -X POST http://localhost:3000/api/sugerencias \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Test local\",\"contenido\":\"Prueba desde localhost\"}"
```

---

## 🧪 **Opción 2: Tests Automatizados**

### **A) Tests de API con Newman/Postman**

```bash
npm run test:api:f3b
```

**Qué prueba:**
- Health check endpoint
- POST /api/sugerencias (creación)
- Validaciones de backend

**Resultado esperado:**
```
✓ Status is 200
✓ Response has correct structure
```

---

### **B) Tests E2E con Cypress**

#### **1. Modo Interactivo (para debugging):**

```bash
npm run cypress:open
```

**Esto abre el UI de Cypress donde puedes:**
- Seleccionar qué tests ejecutar
- Ver el browser mientras corre
- Hacer debugging paso a paso

#### **2. Modo Headless (para CI):**

```bash
npm run test:e2e
```

**Qué prueba:**
- Flujo completo de home feed
- Navegación
- Interacciones de UI

---

### **C) Tests Completos (CI Simulation)**

```bash
npm run test:ci
```

**Esto ejecuta:**
1. Linter (ESLint)
2. Build del proyecto
3. Levanta el servidor
4. Ejecuta tests de API (Newman)
5. Ejecuta tests E2E (Cypress)

⚠️ **Nota:** Este comando tarda varios minutos.

---

## 🔍 **Validación Específica: Políticas RLS**

### **Prueba Manual en el Browser**

1. **Levanta el dev server:**
   ```bash
   npm run dev
   ```

2. **Abre las DevTools del browser** (F12)

3. **Ve a Console y ejecuta:**

```javascript
// Asumiendo que tienes acceso al cliente de Supabase en el browser
const { data, error } = await fetch('/api/sugerencias').then(r => r.json());
console.log('Sugerencias:', data);
```

4. **Verifica:**
   - Si estás autenticado: solo ves tus sugerencias ✅
   - Si no estás autenticado: ves un error o array vacío ✅

---

## 📊 **Checklist de Pruebas Post-Migración RLS**

### **Funcionamiento Básico:**
- [ ] App carga en http://localhost:3000
- [ ] No hay errores en consola del browser
- [ ] No hay errores en terminal del servidor

### **RLS - Lectura (SELECT):**
- [ ] Usuario autenticado solo ve sus propios datos
- [ ] Usuario no autenticado no puede leer datos privados
- [ ] Service role (server-side) puede leer todo

### **RLS - Escritura (INSERT):**
- [ ] Usuario autenticado puede crear sus propios registros
- [ ] Usuario autenticado NO puede crear registros para otros
- [ ] Inserts anónimos (via service role) funcionan

### **RLS - Actualización (UPDATE):**
- [ ] Usuario autenticado puede actualizar su propio perfil
- [ ] Usuario autenticado NO puede actualizar datos de otros
- [ ] No puede "transferir" su perfil cambiando el `id`

### **Performance:**
- [ ] Queries no se sienten lentos
- [ ] No hay warnings de re-evaluación en logs de Supabase

---

## 🛠️ **Comandos Útiles**

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción (requiere build previo) |
| `npm run lint` | Verificar código con ESLint |
| `npm run cypress:open` | Tests E2E interactivos |
| `npm run test:api:f3b` | Tests de API con Newman |
| `npm run test:e2e` | Tests E2E headless |
| `npm run test:ci` | Suite completa de tests |

---

## 🐛 **Troubleshooting**

### **Error: "Cannot find module..."**
```bash
npm install
```

### **Error: "Port 3000 already in use"**
```bash
# Mata el proceso en puerto 3000
npx kill-port 3000
# O usa otro puerto
PORT=3001 npm run dev
```

### **Error: "Supabase connection failed"**
- Verifica que `.env.local` tenga las credenciales correctas
- Verifica que `SUPABASE_URL` y `SUPABASE_ANON_KEY` estén correctos
- Verifica conexión a internet

### **Error: "RLS policy violation"**
- Esto es BUENO (significa que RLS funciona)
- Verifica que estés autenticado correctamente
- Verifica que estés accediendo solo a tus datos

---

## 📝 **Próximos Pasos**

1. **Levanta el dev server** con `npm run dev`
2. **Navega por la app** manualmente
3. **Ejecuta tests automatizados** con `npm run test:api:f3b`
4. **Opcional:** Ejecuta Cypress con `npm run cypress:open`

---

**¿Dudas?** Consulta la documentación en `/docs` o pregunta en el equipo.

---

**Estado:** ✅ Listo para pruebas locales
