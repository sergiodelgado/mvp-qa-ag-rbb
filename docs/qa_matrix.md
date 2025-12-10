`docs/qa_matrix.md` · Matriz de casos vs pruebas

# QA · Matriz de cobertura · Buzón de Sugerencias

| ID    | Requisito / Flujo                                                 | Tipo de prueba       | Implementación                     | Estado |
| ----- | ----------------------------------------------------------------- | -------------------- | ---------------------------------- | ------ |
| F3-1  | Usuario QA puede iniciar sesión y ver el Buzón                    | E2E UI               | `auth_buzon.cy.ts`                 | OK     |
| F3-2  | Buzón muestra nombre de usuario en sesión                         | E2E UI               | `auth_buzon.cy.ts`                 | OK     |
| F3-3  | No permite enviar sugerencias vacías                              | E2E UI               | `sugerencias.cy.ts`                | OK     |
| F3-4  | Permite crear sugerencia válida y se ve en el listado             | E2E UI               | `sugerencias.cy.ts`                | OK     |
| F3-5  | Lista de sugerencias se actualiza con el botón “Actualizar lista” | E2E UI               | `refresh_sugerencias.cy.ts`        | OK     |
| F3b-1 | GET `/api/sugerencias` sin sesión → 401 + mensaje                 | API (Postman/Newman) | `GET sin sesión → 401`             | OK     |
| F3b-2 | POST `/api/sugerencias` sin sesión → 401 + mensaje                | API (Postman/Newman) | `POST sin sesión → 401`            | OK     |
| F4-1  | Pipeline CI corre lint + build + API + E2E en GitHub Actions      | Integración continua | `npm run test:ci` (workflow QA CI) | OK     |
