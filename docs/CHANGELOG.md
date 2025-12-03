# CHANGELOG

## [0.3.0] - F3 UI completada, preparación F3b

- Se consolida `docs/qa_f3.md` con alcance, requisitos y evidencias de la Fase 3 (UI · Cypress).
- Se crea `docs/qa_matrix.md` como matriz contrato–implementación–pruebas (UI + API + RLS).
- Se actualiza `README.md` para reflejar F3 completada y plan de F3b (API Testing).

## [0.2.0] - F2 Buzón de sugerencias

- Implementación de la tabla `sugerencias` con RLS.
- Endpoint real `/api/sugerencias` (GET/POST).
- UI de `/buzon` con formulario, listado y estado vacío.
- Documentos agregados:
  - `docs/modelo_sugerencias.md`
  - `docs/rutas_f2.md`
  - `docs/api_sugerencias.md`
  - `docs/fase2_sugerencias.md`
  - `docs/qa_f2.md`

## [0.1.0] - F1 Base del proyecto

- Proyecto Next.js inicializado (App Router + TypeScript).
- Integración con Supabase (Auth + tabla `socios` + RLS).
- Rutas base: `/`, `/login`, `/register`, `/buzon` (placeholder), `/logout`.
- Documentos iniciales:
  - `docs/rutas.md`
  - `docs/modelo_socios.md`
