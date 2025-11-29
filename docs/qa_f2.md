# Plan de pruebas Fase 2 – Buzón de sugerencias

Este documento define el conjunto mínimo de pruebas funcionales, de API y de RLS para validar la Fase 2 del MVP QA – AG RBB: creación y listado de sugerencias autenticadas.

---

## 1. Alcance

Incluye:

- Login + acceso protegido a `/buzon`.
- Creación de sugerencias desde UI.
- Listado de sugerencias propias.
- Validaciones de formulario.
- Validaciones de payload en `/api/sugerencias`.
- Aislamiento por usuario vía RLS.

No incluye:

- Editar o eliminar sugerencias.
- Roles administrativos.
- Flujo completo del futuro `/api/rag/ask`.
- Métricas, dashboards o pruebas de performance.

---

## 2. Precondiciones

- Aplicación ejecutándose con `npm run dev`.
- `.env.local` configurado con:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Migraciones Fase 1 y 2 ejecutadas:
  - Tabla `socios` con RLS.
  - Tabla `sugerencias` con RLS.
- Usuario socio válido:
  - Existe en `auth.users`.
  - Tiene fila asociada en `public.socios`.

---

## 3. Pruebas manuales UI – `/login` y `/buzon`

### Caso UI-01 · Login exitoso

**Dado** un socio válido  
**Cuando** ingresa email y password correctos  
**Entonces**:

- Aparece `Login OK` en consola.
- Navega a `/buzon`.
- No ocurre loop `/login ↔ /buzon`.

---

### Caso UI-02 · Login inválido

**Cuando** ingresa credenciales incorrectas  
**Entonces**:

- Permanece en `/login`.
- Se muestra mensaje de error visible en UI.

---

### Caso UI-03 · Acceso protegido a `/buzon`

**Dado** un navegador sin sesión  
**Cuando** ingresa `/buzon`  
**Entonces**:

- Es redirigido a `/login`.
- No se muestra el buzón.

---

### Caso UI-04 · Crear sugerencia válida

**Dado** sesión activa  
**Cuando** completa título + contenido y envía  
**Entonces**:

- Se limpia el formulario.
- La sugerencia aparece primera en la lista (orden DESC).
- No aparece error.

---

### Caso UI-05 · Validación de campos vacíos

**Cuando** intenta enviar con título o contenido vacío  
**Entonces**:

- No se ejecuta `POST /api/sugerencias`.
- Se muestran errores inline.

---

### Caso UI-06 · Estado vacío

**Dado** un socio nuevo sin sugerencias  
**Cuando** accede a `/buzon`  
**Entonces**:

- Muestra mensaje del estado vacío.
- No muestra tarjetas vacías.

---

## 4. Pruebas manuales API – `/api/sugerencias`

### Caso API-01 · GET con sesión válida

**Dado** un usuario autenticado  
**Cuando** ejecuta `GET /api/sugerencias`  
**Entonces**:

- `200 OK`
- Arreglo JSON con 0 o más elementos.
- Cada elemento tiene `id`, `titulo`, `contenido`, `estado`, `created_at`.

---

### Caso API-02 · GET sin sesión

**Cuando** ejecuta `GET` sin cookie válida  
**Entonces**:

- `401 Unauthorized`
- Body: `{ "message": "No hay sesión activa." }`

---

### Caso API-03 · POST válido

**Dado** usuario autenticado  
**Cuando** envía:

```json
{ "titulo": "Sugerencia QA", "contenido": "Detalle" }
```

**Entonces**:

- `201 Created`
- Devuelve sugerencia creada.
- La fila aparece en tabla `sugerencias`.

---

### Caso API-04 · POST inválido

Body vacío o strings vacíos:

```json
{ "titulo": "", "contenido": "" }
```

**Entonces**:

- `400 Bad Request`
- Mensaje claro indicando payload inválido.

---

### Caso API-05 · POST sin sesión

**Cuando** realiza `POST` sin cookie
**Entonces**:

- `401 Unauthorized`

---

## 5. Pruebas de RLS – aislamiento entre usuarios

### Caso RLS-01 · Lectura propia

**Dado** usuario A con sugerencias
**Cuando** A ejecuta `GET /api/sugerencias`
**Entonces**:

- Solo recibe sus propias filas.

---

### Caso RLS-02 · Lectura cruzada bloqueada

**Dado** usuario A y usuario B
**Cuando** B hace `GET`
**Entonces**:

- No puede ver filas de A.
- Resultado: arreglo vacío o solo sus propias filas.

---

### Caso RLS-03 · Insert con socio_id manipulado (SQL)

**Cuando** se ejecuta SQL manual:

```sql
insert into sugerencias (id, socio_id, titulo, contenido)
values (gen_random_uuid(), 'otro-usuario', 'X', 'Y');
```

**Entonces**:

- El INSERT falla por política de seguridad.

---

## 6. Mapeo a automatización (F3 y F3b)

### UI (Cypress)

Casos candidatos:

- UI-01 Login exitoso
- UI-02 Login inválido
- UI-03 Protección `/buzon`
- UI-04 Crear sugerencia válida
- UI-05 Validaciones vacías
- UI-06 Estado vacío

### API (Postman / Newman / Supertest)

- API-01 hasta API-05

### RLS (SQL tests)

- RLS-01, RLS-02, RLS-03

---

## 7. Criterios de aceptación Fase 2

La Fase 2 se acepta cuando:

- Todos los casos UI-01 al UI-06 pasan manualmente.
- Todos los casos API-01 al API-05 pasan manualmente.
- Al menos un test de aislamiento RLS pasa.
- `npm run build` compila sin errores.
- Los documentos:
  - `docs/rutas_f2.md`
  - `docs/api_sugerencias.md`
  - `docs/qa_f2.md`
    están consistentes con el código real.

---
