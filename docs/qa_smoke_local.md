# QA · Smoke test local · Buzón de Sugerencias

## Entorno

- Comando: 
pm run dev
- URL base: http://localhost:3000
- Backend: Next.js App Router + Supabase SSR
- Estado del proyecto al momento del test: **Bloque A (API estable) completado**

---

## 1. Login usuario de prueba

**Acción**
- Abrir http://localhost:3000/login
- Ingresar credenciales de usuario QA existente

**Resultado:** OK  
**Notas:**  
- El flujo redirige correctamente a /buzon.  
- No se observan errores en consola del navegador ni en el terminal.

---

## 2. Crear sugerencia desde la UI

**Acción**
- Navegar a /buzon
- Completar formulario con 	itulo = Prueba QA X y un mensaje
- Enviar

**Resultado:** OK  
**Notas:**  
- La API responde 201.  
- La nueva sugerencia aparece listada inmediatamente.  
- La consola del backend no muestra errores.  
- Se confirma que la columna socio_id se persiste correctamente.

---

## 3. GET /api/sugerencias sin sesión

**Acción**
- Abrir ventana incógnito
- Ir a: http://localhost:3000/api/sugerencias

**Esperado**
- Status: **401**
- Body: { "message": "No hay sesión activa." }

**Resultado:** OK  
**Notas:**  
- La ruta responde 401 de forma consistente.  
- RLS y verificación de sesión funcionan como se espera.

---

## 4. GET /api/sugerencias con sesión

**Acción**
- Usuario logueado ? abrir http://localhost:3000/api/sugerencias

**Esperado**
- Status: **200**
- JSON con sugerencias del usuario autenticado

**Resultado:** OK  
**Notas:**  
- Respuesta contiene array con sugerencias registradas.  
- No se observa error interno (500).  
- La ruta ya no presenta fallas relacionadas a cookies() o Supabase SSR.

---

## Conclusión general del smoke test

El entorno local está **estable** para avanzar a pruebas automatizadas (Cypress).  
La API de /api/sugerencias cumple el mínimo funcional necesario para habilitar:

- Pruebas de flujo básico (F3)
- Pruebas API Postman/Newman (F3b)
- Integración con Cypress UI (F3c)

Se cierra correctamente el **Bloque A: Estabilización de API**.
