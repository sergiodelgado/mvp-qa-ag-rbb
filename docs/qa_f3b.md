# docs/qa_f3b.md — F3b (V2 limpio)

# Pruebas API · Fase 3b — `/api/sugerencias`

La fase F3b valida directamente la API del endpoint `/api/sugerencias` usando Postman/Newman. Se revisan autenticación, validaciones, RLS y manejo de errores.
Este documento describe lo necesario para ejecutar la fase, evitando duplicación respecto de `qa_matrix.md`.

---

## 1. Objetivo

Verificar que la API:

- Exija sesión (401 cuando corresponde).
- Devuelva únicamente datos del usuario autenticado (RLS).
- Aplique validaciones correctas (400).
- Cree sugerencias válidas (201).
- Maneje errores controlados (500).
- Mantenga un shape estable (`id, titulo, contenido, estado, created_at`).

---

## 2. Alcance

### Endpoints bajo prueba

- GET `/api/sugerencias`.
- POST `/api/sugerencias`.

### Fuera de alcance

- Rutas UI (cubiertas en F3).
- Endpoints `/api/rag/*`.
- Pruebas de performance o carga.
- Pipeline CI/CD (tratado en F4).

---

## 3. Precondiciones

### Entorno

La aplicación debe estar ejecutándose en local.
Las variables de entorno `.env.local` deben incluir URL y claves Supabase necesarias (`PUBLIC_URL`, `ANON_KEY`, `SERVICE_ROLE_KEY`).

### Migraciones necesarias

- Creación de tabla de sugerencias.
- Políticas RLS.
- Índices para optimizar lectura/escritura.

### Usuarios de prueba en Supabase

Usuario A: `test@example.com / Test1234!`
Usuario B: `test.b@example.com / TestB1234!`
Ambos con rol `socio` y estado `activo`.

### Datos mínimos

- Usuario A: lista vacía o con sus propias sugerencias.
- Usuario B: al menos una sugerencia existente (para validar lectura cruzada vía RLS).

---

## 4. Autenticación en F3b

La colección Postman usa login directo contra Supabase Auth (grant_type=password).
El flujo consiste en:

1. Ejecutar login de A y B.
2. Guardar tokens de acceso y refresh para cada usuario.
3. Enviar los requests a la API usando `Authorization: Bearer <token>`.

Este método permite validar la API sin depender aún de las cookies generadas por Next.js.
La migración completa hacia cookies queda para una iteración futura.

---

## 5. Colección Postman

Ubicación: carpeta `postman/`.

### Carpetas principales

**00 – Auth / Tokens**
Obtiene tokens de usuario A y B.

**10 – GET `/api/sugerencias`**
Incluye casos sin sesión, autenticado y (pendiente) validación A/B con RLS.

**20 – POST `/api/sugerencias`**
Implementa casos sin sesión y caso válido 201.
Pendientes: payload inválido, campos vacíos y errores de BD/RLS.

**30 – RLS**
Escenarios para validar visibilidad entre usuarios y protección contra inserciones con `socio_id` alterado.

---

## 6. Validaciones mínimas

### GET 200

- Respuesta es un array.
- Cada objeto incluye: `id`, `titulo`, `contenido`, `estado`, `created_at`.
- No debe exponerse `socio_id`.

### POST 201

- Devuelve un objeto con el mismo shape.
- Campos `titulo` y `contenido` deben ser strings no vacíos.

### Mensajes de error esperados

- 401: “No hay sesión activa.”
- 400: mensajes por payload inválido o campos faltantes.
- 500: errores controlados en lectura o creación.

---

## 7. Ejecución vía Newman

### Requisitos

- Aplicación en ejecución local.
- Environment Postman con URLs, claves y usuarios configurados.
- Tokens generados mediante las requests de login.

La suite se ejecuta desde el script definido en package.json.
A medida que se agregan escenarios pendientes, la colección debe actualizarse y exportarse nuevamente.

---

## 8. Estado actual de F3b

| Escenario             | Estado | Comentario                              |
| --------------------- | ------ | --------------------------------------- |
| GET sin sesión (401)  | ✔     | Validado en Newman                      |
| POST sin sesión (401) | ✔     | Validado en Newman                      |
| GET A con datos       | ✔     | Validado en Postman UI                  |
| POST A válido (201)   | ✔     | Shape correcto                          |
| Casos 400             | ◐      | Pendientes de agregar                   |
| Casos 500             | ○      | Requieren forzar error controlado       |
| RLS lectura A/B       | ○      | Pendiente, datos creados                |
| RLS escritura         | ○      | Requiere prueba directa                 |
| Suite Newman completa | ◐      | Depende de agregar escenarios faltantes |

---

## 9. Checklist de cierre

- [ ] Colección Postman completa y exportada.
- [ ] Environment actualizado con valores reales.
- [ ] Escenarios GET listos: 401, 200, vacío, con datos.
- [ ] Escenarios POST listos: 201, 400, 401, 500.
- [ ] Pruebas RLS en lectura y escritura con usuarios A/B.
- [ ] Ejecución correcta de `npm run test:api:f3b`.
- [ ] `docs/qa_matrix.md` actualizado con resultados finales.

---
