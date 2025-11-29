# Rutas Fase 2 – Buzón de sugerencias

Este documento define las rutas y endpoints implementados en la Fase 2 del MVP QA – AG RBB.  
Incluye las rutas UI, los endpoints API y su relación con Supabase + RLS.

---

## 1. Rutas UI (Next.js · App Router)

| Ruta        | Propósito                                                | Requiere sesión | Datos utilizados        | Notas clave                           |
| ----------- | -------------------------------------------------------- | --------------- | ----------------------- | ------------------------------------- |
| `/buzon`    | Página principal del buzón: formulario + listado propio. | Sí              | `socios`, `sugerencias` | Redirige a `/login` si no hay sesión. |
| `/login`    | Inicio de sesión.                                        | No              | –                       | Redirige a `/buzon` si ya hay sesión. |
| `/register` | Registro de socio.                                       | No              | `auth.users`, `socios`  | Tras registro → `/login`.             |
| `/logout`   | Cierre de sesión.                                        | Sí              | –                       | Limpia cookies y redirige a `/login`. |

**Notas adicionales:**

- `/` (home) está documentada en `docs/rutas.md` (F1).
- En F2, la única pantalla enriquecida es `/buzon`.

---

## 2. API (Next.js Route Handlers)

### `GET /api/sugerencias`

- Lista las sugerencias del socio autenticado.
- Filtrado automático por RLS: `socio_id = auth.uid()`.
- Orden: `created_at DESC`.
- Respuesta esperada: `200 OK` con un arreglo JSON.

### `POST /api/sugerencias`

- Crea una nueva sugerencia asociada al socio autenticado.
- Payload requerido:

```json
{ "titulo": "string no vacío", "contenido": "string no vacío" }
```

- `socio_id` **no** viene en el body: se extrae del JWT del usuario.
- Respuesta esperada: `201 Created` con el registro insertado.

---

## 3. Relación con Supabase y RLS

- `sugerencias.socio_id` siempre coincide con `auth.uid()`.

- RLS habilita:

  | Operación | Permitido | Condición                    |
  | --------- | --------- | ---------------------------- |
  | SELECT    | Sí        | `socio_id = auth.uid()`      |
  | INSERT    | Sí        | `new.socio_id = auth.uid()`  |
  | UPDATE    | No (F2)   | Reservado para F3+           |
  | DELETE    | No (F2)   | Reservado para fases futuras |

- Si se intenta acceder a sugerencias de otro usuario:
  - Resultado esperado: `403` o arreglo vacío según contexto.

---

## 4. Diagrama de flujo (UI → API → DB)

```sql
/buzon
├── Render inicial
├── GET /api/sugerencias
│     └── SELECT * FROM sugerencias
│         WHERE socio_id = auth.uid()
│
└── POST /api/sugerencias
      └── INSERT INTO sugerencias (socio_id, titulo, contenido, estado)
          VALUES (auth.uid(), titulo, contenido, 'nueva')
```

---

## 5. Observaciones QA

- `/buzon` es el entrypoint único para interacción autenticada en F2.
- Las APIs dependen 100% del **token en cookies**, no de localStorage.
- RLS es la barrera de seguridad principal:
  - Aísla sugerencias entre usuarios.
  - Impide manipular `socio_id`.

- Los tests de F2 deben validar que:
  - No hay fugas de datos cruzados.
  - Los handlers siguen las validaciones de payload.
  - La UI refleja correctamente el estado vacío y los errores.

---

Documento consistente con:

- `docs/api_sugerencias.md`
- `docs/qa_f2.md`
- Código actual de `/buzon` y `/api/sugerencias`
- Migraciones SQL F2 aplicadas
