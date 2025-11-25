Perfecto.
Aquí van las **listas completas para PM-QA**, listas para pegar en:

`prompts/post_PM_QA_comandos_tipo.md`

Con tu toque ordenado, técnico y sin relleno.
Y sí, mantengo mi actitud amarga pero funcional.

---

# prompts/post_PM_QA_comandos_tipo.md

## Comandos tipo para usar después de PM-QA

---

# 1. Pregunta inicial obligatoria sobre el entorno

(Previene que el modelo asuma cosas absurdas como “ya tienes Cypress instalado”)

* “Antes de responder, pregúntame qué herramientas tengo abiertas y en qué estado están.”
* “Valida mi entorno: VS Code abierto o no, PowerShell activo o no, Next.js dev corriendo o no, Supabase configurado o no.”
* “Confirma si tengo el proyecto cargado en la carpeta correcta.”
* “Pregunta qué herramientas tengo disponibles antes de dar instrucciones técnicas.”

---

# 2. Lista corta (comandos rápidos y universales)

Para activar lo esencial de PM-QA sin tocar modos profundos.

### Activar estructura base

* “Checklist primero.”
* “Cargar project_context.md antes de responder.”
* “Clasifica mi consulta: básico, intermedio o práctico.”

### Explicación mínima

* “Explica simple primero.”
* “Modo práctico: pasos + comandos.”
* “Dame el siguiente micro-objetivo.”

### Control de supuestos

* “No inventes datos, usa solo project_context.md.”
* “Pide aclaración si falta información.”

### Verificación mínima

* “Incluye un comando para validar.”
* “Indica el resultado esperado.”

---

# 3. Lista pro-mode (modo experto para debugging, DevOps y QA profundo)

Estas frases obligan al modelo a activar todo el CRTF en modo estricto.

### Activar modo técnico avanzado

* “Activa modo QA/DevOps completo y usa project_context.md como fuente principal.”
* “Evalúa el nivel de mi consulta antes de responder.”
* “Divide respuesta en: concepto, pasos, código, validación, errores típicos.”

### Control del flujo de trabajo

* “Explica en dos capas: simple primero, luego avanzado.”
* “Indica dependencias técnicas y riesgos antes de implementar.”
* “Dime qué debo preparar en el entorno para ejecutar la solución.”

### Debugging avanzado

* “Modo debugging: identifica la causa raíz, archivos involucrados y el fix.”
* “Señala el error probable y cómo comprobarlo.”
* “Incluye parche de código listo para copiar/pegar.”

### QA Automation

* “Genera tests E2E mínimos para este flujo.”
* “Estructura carpetas de pruebas según buenas prácticas.”
* “Incluye datos de prueba coherentes.”
* “Indica qué casos de error debo cubrir.”

### CI/CD

* “Propón un workflow básico para GitHub Actions basado en mi contexto actual.”
* “Incluye YAML limpio con comentarios útiles.”
* “Indica qué secretos necesito configurar.”

### Seguridad y entorno

* “Verifica variables de entorno necesarias y cómo validarlas.”
* “Dime qué configuración podría romper el proyecto.”

### Cierre técnico

* “Cierra con validación final y siguiente paso técnico.”
* “Indica qué debo implementar después y por qué.”

---

# 4. Comandos tipo centrados en tecnologías específicas

### Git/GitHub

* “Dame la secuencia git segura para aplicar estos cambios.”
* “Valida estado del repo antes de avanzar.”

### Next.js

* “Indica dónde debe ir este componente o lógica dentro de app/.”
* “Señala cómo impacta este cambio en las rutas.”

### Supabase

* “Valida que las claves y el cliente estén bien configurados.”
* “Indica cómo probar esta operación contra Supabase.”

### Cypress / Playwright

* “Genera un test sencillo siguiendo este flujo.”
* “Incluye comando para ejecutarlo.”

### Newman / Postman

* “Genera la colección mínima para probar esta API.”
* “Dame el comando Newman para correr los tests.”

### Docker

* “Genera Dockerfile base sin romper el build.”
* “Indica el comando docker build y cómo validar que funciona.”

---

# 5. Comandos tipo para evitar errores del modelo

* “No asumas que Cypress está instalado.”
* “No asumas que ya tengo CI/CD.”
* “No inventes archivos, rutas o tablas.”
* “Indica qué necesitas confirmar antes de avanzar.”
* “Marca qué parte de la respuesta depende de supuestos.”

---

# 6. Comandos para sesiones largas (QA + DevOps combinados)

* “Dame un diagnóstico técnico completo del proyecto según project_context.md.”
* “Propón un plan de pruebas para F1–F3.”
* “Divide la solución en bloques de 30 minutos.”
* “Dime qué puedo automatizar ahora y qué debo dejar para F4.”

---
