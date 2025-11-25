## Arquitectura de Prompts (IA Asistida)

Este proyecto incorpora un sistema modular de prompts destinados a trabajar con modelos GPT en tareas de QA, DevOps y planificación técnica.  
La carpeta `prompts/` contiene los **Prompts Maestros (PM)** y los **Comandos Tipo**, diseñados para garantizar:

- Respuestas consistentes y reproducibles.  
- Análisis técnico contextualizados al estado real del repositorio.  
- Coaching técnico en QA Automation, DevOps y Next.js.  
- Auditoría de fases del MVP (F1–F5) con criterios claros de avance.  
- Trazabilidad en decisiones de diseño, pruebas y CI/CD.

### Componentes principales

- **PM-00 – Orquestador:**  
  Define estándares de formato, análisis y uso de contexto.  
  Garantiza coherencia entre sesiones usando ChatGPT.

- **PM-MVP – Auditor del Proyecto:**  
  Detecta estado, huecos, dependencias y prioridades del MVP.  
  Propone pasos atómicos y entregables verificables.

- **PM-QA – Coach Técnico:**  
  Genera explicaciones claras, pasos concretos, código listo para usar,  
  validaciones y buenas prácticas en QA/DevOps.

- **Comandos Tipo (post-PM):**  
  Frases de activación que permiten dirigir el comportamiento del modelo  
  según estilo (auditor, práctico, debugging, roadmap, etc.).

---

# Funcionamiento recomendado

## 1. Ejecutar un PM por chat (siempre en limpio):
- Chat 1 → PM-00  
- Chat 2 → PM-MVP  
- Chat 3 → PM-QA  

## 2. Luego usar comandos tipo:
- Para activar estilos específicos.
- Para mantener formato.
- Para dirigir la conversación sin ambigüedad.

## 3. AO-00 actualiza `project_context.md` según el repo.
Ese archivo se convierte en **fuente principal de contexto** para los PM.

---

# Seguridad

Esta carpeta es **segura para repositorios públicos** siempre que:
- No incluyas claves, tokens, `.env`, direcciones reales o datos sensibles.
- Solo mantengas prompts, estructuras y comandos tipo.

---

# Propósito

La carpeta `prompts/` formaliza la arquitectura de IA utilizada en el MVP QA – AG RBB.  
Permite reproducir el proceso, mantener orden y acelerar el desarrollo técnicos sin improvisación.
