# **Comandos Tipo para usar después de PM-MVP**

## (para pegar en `prompts/post_PM_MVP_comandos_tipo.md`)

---

# 1. Pregunta inicial obligatoria sobre el entorno

Antes de cualquier auditoría o planificación, necesitas que el modelo NO asuma herramientas abiertas.

Usa una de estas:

* “Antes de responder, pregúntame qué herramientas tengo abiertas y en qué estado.”
* “Valida mi entorno: VS Code, terminal, proyecto cargado, Next.js dev corriendo o no.”
* “Confirma el estado de mis herramientas antes de planificar.”
* “No asumas que tengo configuraciones activas. Pregunta el entorno primero.”

---

# 2. **Lista corta** (comandos rápidos y universales para PM-MVP)

### Cargar contexto del proyecto

* “Carga project_context.md antes de responder.”
* “Valida el estado actual del MVP.”

### Ubicar la consulta en fases

* “Dime en qué fase estoy y qué corresponde ahora.”
* “Clasifica esto dentro de F1–F5.”

### Planificación mínima

* “Propón 1–3 entregables concretos.”
* “Dame el siguiente paso atómico.”
* “Dime qué depende de qué.”

### Control de supuestos

* “No inventes datos; usa solo project_context.md.”
* “Pide aclaración si falta información para planificar.”

---

# 3. **Lista pro-mode** (modo auditor completo del PM-MVP)

### Activar auditoría profunda

* “Activa modo auditor y usa project_context.md como fuente principal.”
* “Ubica mi consulta en el mapa general del proyecto.”
* “Evalúa riesgos y huecos antes de proponer acciones.”

### Estructura estricta

* “Divide tu respuesta en: estado actual, huecos, entregables concretos, paso atómico.”
* “Valida que cumples el formato PM-MVP antes de entregar.”
* “Explica dependencias y riesgos entre fases F1–F5.”

### Profundidad técnica

* “Evalúa qué tareas puedo hacer sin romper nada y qué requiere completar otra fase.”
* “Indica impacto de esta tarea en autenticación, rutas y Supabase.”
* “Analiza cómo esta decisión afecta las pruebas y CI/CD.”

### Manejo de conectores

* “Si hay conectores, indica qué archivo leíste y de dónde.”
* “Si no hay conectores, trabaja solo con project_context.md.”

### Planificación avanzada

* “Dame un micro-plan de 30–90 minutos para avanzar.”
* “Organiza tareas por impacto y riesgo técnico.”
* “Propón un roadmap breve para cerrar la fase actual.”

### Cierre obligatorio

* “Cierra con el siguiente paso atómico y por qué es el correcto.”
* “Indica qué debo preparar en el entorno antes de ese paso.”

---

# 4. Comandos tipo orientados a fases del MVP

### **F1 – Base App + Auth + Supabase**

* “Valida qué falta para cerrar F1.”
* “Indica archivos clave que debo completar para cerrar Auth.”

### **F2 – Buzón de sugerencias**

* “Define el mínimo producto funcional para terminar F2.”
* “Qué endpoints y componentes necesito para el buzón.”

### **F3 – Pruebas automatizadas**

* “Dime qué tests mínimos debo implementar primero.”
* “Propón estructura mínima para UI/API tests.”

### **F4 – CI/CD + Docker**

* “Qué workflow puedo construir según el estado actual.”
* “Dame el pipeline más simple útil para F4.”

### **F5 – Docs + Demo**

* “Qué documentos faltan según project_context.md.”
* “Propón estructura mínima para el README final.”

---

# 5. Comandos para evitar errores del modelo

* “No asumas que existe deploy.”
* “No asumas que tengo CI/CD configurado.”
* “No inventes rutas, tablas, carpetas o workflows.”
* “Pide confirmación antes de generar supuestos críticos.”

---

# 6. Comandos para sesiones largas de planificación

* “Dame diagnóstico completo del estado del MVP según project_context.md.”
* “Propón un roadmap de 1–2 semanas basado en mis fases.”
* “Divide el plan en bloques de 30 minutos.”
* “Dime qué puedo posponer sin romper nada.”

---
