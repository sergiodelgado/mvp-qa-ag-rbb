# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).  
Incluye registro y login de socios, un buzón de sugerencias con CRUD básico y un endpoint placeholder para `/api/rag/ask` preparado para futura integración con RAG.  
El proyecto incorpora pruebas automatizadas (UI + API), CI/CD con GitHub Actions y un Dockerfile básico para ejecutar la aplicación en un entorno aislado.

---

## Descripción del proyecto

Este repositorio contiene el desarrollo del MVP que se utilizará como entrega final del curso **Test Automation Engineer**.  
El objetivo es demostrar un flujo completo **Web + API + QA Automation + CI/CD**, utilizando tecnologías modernas y un diseño modular que pueda escalar en fases futuras.

**Incluye:**
- Registro y login de socios (Next.js + Supabase Auth)  
- Buzón de sugerencias (CRUD)  
- Endpoint placeholder `/api/rag/ask`  
- Pruebas automatizadas (Cypress + Postman/Newman)  
- Pipeline CI/CD con GitHub Actions  
- Dockerfile básico para ejecución de la app  

---

## Stack Tecnológico

- **Next.js** – Frontend + API Routes  
- **Supabase** – Autenticación + base de datos PostgreSQL  
- **Cypress** – Pruebas E2E  
- **Postman/Newman** – Pruebas de API  
- **GitHub Actions** – CI/CD  
- **Docker** – Contenedor básico para la aplicación  

---

## Estado del proyecto

- **Estado actual:**  
  - **Fase 0 – Estructura inicial del repositorio (sin código todavía).**  
  - **Fase 1 – En curso.**

---

## Roadmap de Fases

| Fase | Ventana     | Foco principal                     | Entregables clave                                                      |
|------|-------------|------------------------------------|------------------------------------------------------------------------|
| F0   | Día 1       | Preparar repo y entorno             | Repo creado, README v0, Node/PNPM/NPM definidos                       |
| F1   | Días 2–5    | Base app + Supabase + Auth          | Next.js + Supabase configurados, flujo login/registro funcional básico |
| F2   | Días 6–10   | Buzón sugerencias + `/api/rag/ask`  | CRUD sugerencias funcionando + endpoint RAG placeholder                |
| F3   | Días 11–15  | Automatización de pruebas           | Cypress login+creación, colección Postman, scripts npm listos         |
| F4   | Días 16–18  | CI/CD + Docker                      | GitHub Actions con lint + tests + newman, badge CI, Dockerfile app    |
| F5   | Días 19–20  | Hardening + Docs + demo             | README pro, guía de uso, guión para video de presentación             |

---

## Licencia

Proyecto creado para fines educativos y de experimentación en QA Automation.  
No utilizar datos reales de socios en ambientes de prueba.

---

## Autor

Sergio Carlos Delgado Martínez  
Proyecto AG RBB · 2025