# CHANGELOG · MVP QA – AG RBB · Buzón de Sugerencias

`docs/CHANGELOG.md`

Registro técnico por fases. Fechas aproximadas usadas solo para trazabilidad.

---

## 0.4.0 — F3b · Pruebas API `/api/sugerencias` (en progreso)

### Artefactos incorporados

- Colección Postman y environment local.
- Script de ejecución con Newman (`test:api:f3b`).

### Documentación actualizada

- `docs/qa_f3b.md` (plan y casos).
- `docs/qa_matrix.md` V3 (alineado UI + API + RLS).

### Cobertura lograda

- GET sin sesión retorna 401 con mensaje estándar.
- POST sin sesión retorna 401 con mensaje estándar.
- Login multiusuario (A y B) funcional; tokens correctos.
- POST válido retorna 201 con shape definido (sin `socio_id`).

### Cobertura pendiente según matriz V3

- GET autenticado: validar caso array vacío.
- Validaciones 400: payload `{}` y campos solo con espacios.
- Errores 500: forzar fallos en GET y POST.
- RLS multiusuario: lectura A/B y protección contra inserción con `socio_id` alterado.

---

## 0.3.0 — F3 · Pruebas UI (Cypress) — Completado

### Artefactos creados

- Specs de autenticación, sugerencias y refresh.

### Cobertura validada

- Login válido e inválido.
- Ruta `/buzon` protegida.
- Creación de sugerencias.
- Validación de campos vacíos.
- Estados de carga y actualización.
- Manejo de errores 401 y 500 en UI.
- Flujo completo de carga inicial y refresh manual.

### Documentación

- `docs/qa_f3.md`.
- `docs/qa_matrix.md` (UI completamente cubierta).

---

## 0.2.0 — F2 · Buzón de sugerencias — Completado

### Backend

- Tabla `sugerencias` con RLS activo e índices aplicados.

### API

- Endpoint `/api/sugerencias` con GET y POST operativos.

### UI

- Página `/buzon` con saludo al socio, formulario validado, listado propio con RLS y estados de carga/vacío.

### Documentación

- Modelos, rutas, API, fase F2 y QA F2.

---

## 0.1.0 — F1 · Base del proyecto — Completado

### Proyecto

- Estructura inicial en Next.js (App Router).
- Integración Supabase (Auth + DB).

### Modelo de identidad

- Tabla `socios` con RLS.

### Rutas iniciales

- Inicio, registro, login, buzón (placeholder) y logout.

### Documentación

- Rutas y modelo de socios.

---
