# F3b – Pruebas API `/api/sugerencias` · V2

## Precondiciones

- Variables de entorno definidas:
  - `SUPABASE_URL`, `SUPABASE_ANON_KEY`
  - `API_BASE_URL`
  - `TEST_EMAIL_A`, `TEST_PASSWORD_A`
  - `TEST_EMAIL_B`, `TEST_PASSWORD_B`
- Autenticación aceptada por cookies (UI/SSR) o por header `Authorization: Bearer <token>` (Postman/Newman).
- Colección Postman actualizada:
  - `10 – Login usuario A`
  - `11 – Login usuario B`
  - `20 – POST válido socio A → 201`
  - `21 – POST válido socio B → 201`
  - `22 – POST sin sesión → 401`
  - `23 – POST 400 payload vacío`
  - `24 – POST 400 campos inválidos`
  - `25 – POST 500 forzado`
  - `30 – GET sin sesión`
  - `31 – GET válido socio A`
  - `32 – GET válido socio B`
  - `33 – GET shape y ocultamiento socio_id`
  - `34 – GET RLS cruzado`

## Flujo básico

1. Ejecutar **Login usuario A/B** → guarda `ACCESS_TOKEN_*`, `REFRESH_TOKEN_*`.
2. Ejecutar los escenarios GET.
3. Ejecutar los escenarios POST.
4. Validar RLS lectura y escritura.

## Criterios de aceptación (resumen)

- GET sin sesión → **401**
- GET autenticado → **200**, array, sin `socio_id`
- POST sin sesión → **401**
- POST válido A/B → **201**
- POST inválidos → **400**
- Error forzado → **500**
- RLS:
  - A inserta con su propio `socio_id`
  - B no puede leer ni escribir datos de A
  - A no puede leer ni escribir datos de B

## Resultados actuales

Todos los casos **✔** según `qa_matrix.md V2`.
