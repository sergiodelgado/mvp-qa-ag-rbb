# Rutas Fase 2 – Buzón de sugerencias

Este documento describe las rutas de la Fase 2 del MVP QA – AG RBB, incluyendo UI y APIs, con su relación a Supabase y reglas RLS.

---

## 1. Rutas UI (Next.js · App Router)

| Ruta        | Propósito                                                 | Requiere sesión | Datos utilizados        | Notas                                                  |
| ----------- | --------------------------------------------------------- | --------------- | ----------------------- | ------------------------------------------------------ |
| `/buzon`    | Página principal del buzón. Muestra formulario + listado. | Sí              | `socios`, `sugerencias` | Redirige a `/login` si no hay sesión.                  |
| `/login`    | Inicio de sesión.                                         | No              | –                       | Redirige a `/buzon` si el usuario ya está autenticado. |
| `/register` | Registro de socio.                                        | No              | `auth.users`, `socios`  | Tras registrarse, envía a `/login`.                    |
| `/logout`   | Cierre de sesión.                                         | Sí              | –                       | Limpia cookies y navega a `/login`.                    |

---

## 2. API (Next.js Route Handlers)

### `/api/sugerencias` (GET)

- Devuelve solo sugerencias asociadas al `auth.uid()`.
- Orden: `created_at DESC`
- Respuesta esperada: `200 OK` con arreglo de sugerencias.

### `/api/sugerencias` (POST)

- Crea una nueva sugerencia ligada al `auth.uid()`.
- Payload: `{ titulo, contenido }`
- Respuesta esperada: `201 Created` con registro completo.

---

## 3. Relación con Supabase y RLS

- `sugerencias.socio_id` = `auth.uid()`
- RLS permite:
  - SELECT propio
  - INSERT propio
- Cualquier intento de acceso con otro `socio_id` produce `403`.

---

## 4. Diagrama de flujo (UI → API → DB)

/buzon
├── Render inicial
├── GET /api/sugerencias
│ └── SELECT \* FROM sugerencias WHERE socio_id = auth.uid()
└── POST /api/sugerencias
└── INSERT INTO sugerencias (...) VALUES (...)

---

## 5. Observaciones QA

- `/buzon` es entrypoint único para interacción autenticada.
- La API es completamente dependiente del cookie token.
- RLS es la barrera de seguridad principal.
