# ✔ CHANGELOG · MVP QA – AG RBB · Buzón de Sugerencias

`docs/CHANGELOG.md`

Registro técnico por fases. Fechas aproximadas usadas solo para trazabilidad.

---

## **0.4.1 — F3b consolidado + avance F3c (API cookies + build)**

- **Supabase server-side**: corrección del adapter de cookies (`cookieStore.get`) para evitar 401 falsos y mantener compatibilidad local/prod.
- **Route handler `/api/sugerencias`**: ahora acepta sesión por cookies (UI/SSR) además de `Authorization: Bearer` (Postman/Newman), manteniendo la ruta estable para ambas fuentes.
- **Documentación**: README y QA F3b actualizados (flujo de autenticación en API). Matriz F3b sigue en verde.
- **CI local**: validación `npm run build` ejecutada (falló por falta de acceso a Google Fonts en entorno aislado; código listo para CI con red).

---

## **0.4.0 — F3b · Pruebas API `/api/sugerencias` — Completado**

### ✔ Artefactos incorporados

- Colección Postman + environment local.
- Scripts Newman:
  - `npm run test:api:f3b`

- Requests de login multiusuario y pruebas RLS.
- Suite multiusuario A/B completa.

### ✔ Documentación actualizada

- `docs/qa_f3b.md` V3 (contratos → pruebas).
- `docs/qa_matrix.md` V3 (UI + API + RLS alineado).
- README actualizado (estado F3b).

### ✔ Cobertura lograda (todos los API-\* completados)

- **GET sin sesión** → 401 con mensaje estándar.
- **POST sin sesión** → 401 con mensaje estándar.
- **Login usuario A y B** operativo, tokens guardados en entorno.
- **POST válido** → 201 con shape final (sin `socio_id`).
- **GET autenticado**:
  - Devuelve solo sugerencias del usuario.
  - Maneja correctamente el caso **array vacío**.

- **Validaciones 400**:
  - Payload `{}` → 400.
  - Campos solo con espacios → 400.

- **Errores 500**:
  - GET y POST devuelven mensajes genéricos controlados.

- **RLS multiusuario**:
  - A no ve sugerencias de B.
  - B no ve sugerencias de A.
  - RLS INSERT evita modificar `socio_id` (inserción maliciosa rechazada).

- **Suite Newman F3b** estable.

La Fase F3b queda oficialmente **cerrada**.

---

## **0.3.0 — F3 · Pruebas UI (Cypress) — Completado**

### Artefactos creados

- Specs UI:
  - Autenticación
  - Sugerencias
  - Refresh manual

### Cobertura validada

- Login válido / inválido.
- Redirección a `/buzon` sin sesión.
- Creación de sugerencias desde UI.
- Validación de campos vacíos.
- Estados visuales de carga.
- Manejo de errores 401 y 500.
- Ciclo completo: carga inicial → crear → refrescar.

### Documentación

- `docs/qa_f3.md`
- `docs/qa_matrix.md` (sección UI completa)

---

## **0.2.0 — F2 · Buzón de sugerencias — Completado**

### Backend

- Tabla `sugerencias` con RLS activo (SELECT/INSERT).
- Índices por `socio_id` y `created_at`.

### API

- `/api/sugerencias` con GET + POST estables.

### UI

- Página `/buzon` integrada:
  - Saludo personalizado
  - Formulario validado
  - Listado propio con RLS
  - Estados: vacío / cargando / error

### Documentación

- Modelos, rutas, F2, QA F2.

---

## **0.1.0 — F1 · Base del proyecto — Completado**

### Proyecto

- Estructura inicial Next.js (App Router).
- Integración Supabase (Auth + DB).

### Modelo identidad

- Tabla `socios` + RLS.

### Rutas

- Inicio
- Registro
- Login
- Buzón (placeholder)
- Logout

### Documentación

- Rutas y modelo de socios.

---
