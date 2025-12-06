# README.md — MVP QA · AG RBB · Buzón de Sugerencias

**Proyecto educativo y técnico del curso Test Automation Engineer**, integrando Web + API + QA + Supabase + CI/CD (planificado).

Este MVP implementa registro/login de socios, un buzón de sugerencias funcional, autenticación real con Supabase, RLS estricto, pruebas UI con Cypress (F3) y primeras pruebas API con Postman/Newman (F3b V0).

---

## 1. Descripción general

El proyecto demuestra:

- Autenticación con Supabase (cookies + RLS).
- CRUD mínimo de sugerencias (crear + listar).
- Arquitectura Next.js 16 (App Router) con Route Handlers.
- Integración UI ↔ API ↔ DB con políticas RLS.
- Pruebas UI E2E completas (F3).
- Pruebas API iniciales con Newman (F3b V0).
- CI/CD y Docker planificados para F4.

---

## 2. Stack tecnológico

- **Frontend:** Next.js 16 + TypeScript
- **Backend:** Route Handlers (`app/api/**`)
- **Base de datos:** Supabase (PostgreSQL + Auth + RLS)
- **QA UI:** Cypress (F3)
- **QA API:** Postman + Newman (F3b)
- **CI/CD:** GitHub Actions (F4 planificado)
- **Contenedores:** Docker (F4 planificado)

---

## 3. Estado del MVP por fases

### F1 — Base del proyecto (completado)

- Next.js + Supabase configurados
- Tabla `socios` con RLS
- Flujo: registro, login, buzón (placeholder), logout
- Documentación: rutas + modelo de socios

---

### F2 — Buzón de sugerencias (completado)

- Tabla `sugerencias` con RLS
- API GET y POST operativos
- UI `/buzon`: saludo, validación, listado propio, mensajes de carga y estado vacío
- Documentos: modelos, rutas, API, QA F2

---

### F3 — Pruebas UI (Cypress) (completado)

Cobertura UI validada:

- Login válido e inválido
- `/buzon` protegida
- Creación de sugerencias válidas
- Validación de campos vacíos
- Estados de carga / refresh
- Manejo de 401 en UI
- Manejo contemplado de errores 500 (sin test dedicado)

Documentos asociados:
`docs/qa_f3.md`, `docs/qa_matrix.md` sección UI

---

### F3b — Pruebas API (Postman/Newman) (F3b V0 · en progreso)

Artefactos:

- Colección Postman + environment local
- Script Newman `test:api:f3b`

Cobertura lograda:

- GET sin sesión → 401
- POST sin sesión → 401
- POST válido → 201 con shape correcto (sin `socio_id`)
- Autenticación multiusuario funcional (usuarios A y B)

Cobertura pendiente (según matriz y changelog):

- GET autenticado: validar array vacío
- Validaciones 400: payload `{}` y campos solo con espacios
- Errores 500: simular fallos en GET y POST
- RLS multiusuario:
  - lectura A/B
  - intento de inserción con `socio_id` alterado

Documentos asociados:
`docs/qa_f3b.md`, `docs/qa_matrix.md`, `docs/CHANGELOG.md`

---

### F4 — CI/CD + Docker (planificado)

- Pipeline GitHub Actions
- Imagen Docker + ejecución en contenedor

### F5 — Hardening + Demo final (planificado)

- Revisión seguridad básica
- Demo o video
- Documentación final

---

## 4. Integración Supabase

### Variables de entorno

Requiere URL pública, clave anon y clave service role.
Los nombres están documentados en `.env.example`.
Las claves reales no se versionan.

### Clientes

- **supabaseClientPublic**: cliente browser con persistencia vía cookies.
- **supabaseServerClient**: cliente server usado en `/api/sugerencias` y futuras integraciones.

Ambos están alineados con el modelo de sesión de Supabase + Next.js.

---

## 5. Rutas principales

### F1

`/`, `/login`, `/register`, `/buzon` (placeholder), `/logout`

### F2

`/buzon` (UI completa)
`/api/sugerencias` (GET/POST)

Documentación: `docs/rutas.md`, `docs/rutas_f2.md`

---

## 6. Modelo de datos

Tablas:

- `socios`
- `sugerencias`

Ambas con RLS estricto usando `auth.uid()`.

Migraciones:

- creación de tabla
- políticas RLS
- índices

Documentos: modelos y API de sugerencias.

---

## 7. Pruebas automatizadas

### UI — Cypress (F3)

Specs:

- autenticación
- sugerencias
- refresh / carga

Resultados:

- 3 specs
- 9 tests
- implementación UI completamente cubierta según matriz

---

### API — Postman / Newman (F3b)

Requisitos:

- app en ejecución
- environment configurado
- login A/B para obtener tokens

Cobertura actual:

- GET sin sesión → 401
- POST sin sesión → 401
- POST válido → 201
- GET autenticado y error 401 alineados con UI

Pendientes:

- validaciones 400
- errores 500
- RLS multiusuario
- caso GET array vacío

---

## 8. Carpeta `postman/`

Contiene:

- colección
- environment
- estructura por carpetas: auth, GET, POST, RLS

La colección está sincronizada con `docs/qa_f3b.md` y matriz QA.

---

## 9. Changelog

Historial técnico localizado en `docs/CHANGELOG.md`.
Incluye fases F1 → F3b.

---

## 10. Licencia

Proyecto educativo para AG RBB.
No usar datos reales en entornos de prueba.

---

## 11. Autor

**Sergio Carlos Delgado Martínez**
AG RBB · 2025

---
