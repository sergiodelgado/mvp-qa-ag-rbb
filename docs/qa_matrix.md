# docs/qa_matrix.md — Matriz Contrato → Implementación → Pruebas

**MVP QA – AG RBB · Buzón de Sugerencias**

La matriz relaciona contratos funcionales (UI + API + RLS), implementación real del repositorio y pruebas correspondientes (UI F3 y API F3b), junto con el estado de cobertura final.

---

## Leyenda

✔ Completado  
◐ Parcial  
○ Pendiente  
● Escenario avanzado (opcional para MVP)

---

# 1. UI / Autenticación / Rutas protegidas

| ID   | Contrato funcional                                          | Implementación                             | Pruebas UI F3           | Pruebas API F3b | Estado |
| ---- | ----------------------------------------------------------- | ------------------------------------------ | ----------------------- | --------------- | ------ |
| C-01 | Login válido redirige a `/buzon`.                           | Login + redirect.                          | Login exitoso.          | —               | ✔     |
| C-02 | Login inválido muestra error.                               | Render mensaje con palabra “credenciales”. | Login inválido.         | —               | ✔     |
| C-03 | Acceso a `/buzon` sin sesión redirige a login.              | Validación `auth.getUser()`.               | Acceso protegido.       | GET 401.        | ✔     |
| C-04 | Si GET `/api/sugerencias` retorna 401, UI redirige a login. | Manejo de 401 en `fetchSugerencias()`.     | Redirección verificada. | GET 401.        | ✔     |

---

# 2. UI / Listado y estados

| ID      | Contrato funcional                               | Implementación                | Pruebas UI F3 | Pruebas API F3b  | Estado |
| ------- | ------------------------------------------------ | ----------------------------- | ------------- | ---------------- | ------ |
| C-BZ-02 | Carga inicial ejecuta GET `/api/sugerencias`.    | `useEffect`.                  | GET inicial.  | GET 200 / vacío. | ✔     |
| C-BZ-05 | Botón “Actualizar lista” reejecuta GET.          | `fetchSugerencias`.           | Verificado.   | GET 200.         | ✔     |
| C-BZ-06 | Botón alterna texto durante carga.               | `loadingSugerencias`.         | Test visual.  | —                | ✔     |
| C-BZ-07 | Con latencia muestra “Cargando…”.                | Condición `loading && empty`. | Verificado.   | —                | ✔     |
| C-BZ-08 | Si no hay sugerencias, UI muestra mensaje vacío. | Mensaje en pantalla.          | Observado.    | GET vacío OK.    | ✔     |

---

# 3. UI / Formulario

| ID      | Contrato funcional                               | Implementación         | Pruebas UI F3     | Pruebas API F3b        | Estado |
| ------- | ------------------------------------------------ | ---------------------- | ----------------- | ---------------------- | ------ |
| C-BZ-09 | No envía si campos vacíos (`trim`).              | Validación en submit.  | Formulario vacío. | POST 400.              | ✔     |
| C-BZ-10 | Sugerencia válida crea registro y limpia inputs. | Inserción y limpieza.  | Crear OK.         | POST válido A/B.       | ✔     |
| C-BZ-11 | Error 500 al crear no limpia inputs.             | Manejo catch.          | —                 | POST 500 OK.           | ✔     |
| C-BZ-12 | Si POST responde 401, UI redirige a login.       | Manejo 401.            | —                 | POST 401 OK.           | ✔     |
| C-BZ-13 | Error al listar no borra lista previa.           | Catch mantiene estado. | —                 | GET error (no aplica). | ✔     |
| C-BZ-14 | Error al crear muestra mensaje específico.       | Catch POST.            | —                 | POST 500.              | ✔     |

---

# 4. API / Autenticación y validación

| ID     | Contrato funcional               | Implementación   | Pruebas API F3b | Estado |
| ------ | -------------------------------- | ---------------- | --------------- | ------ |
| API-01 | GET sin sesión → 401 + mensaje.  | Validación user. | OK.             | ✔     |
| API-02 | POST sin sesión → 401 + mensaje. | Validación user. | OK.             | ✔     |

---

# 5. API / Datos, validaciones y shape

| ID     | Contrato funcional                               | Implementación         | Pruebas API F3b            | Estado |
| ------ | ------------------------------------------------ | ---------------------- | -------------------------- | ------ |
| API-03 | GET devuelve solo sugerencias del usuario (RLS). | Política select own.   | A ve A · B no · B ve B.    | ✔     |
| API-04 | POST crea sugerencia asociada al usuario.        | `socio_id = user.id`.  | POST A/B → 201.            | ✔     |
| API-05 | Payload inválido → 400.                          | Validación body.       | POST `{}` → 400.           | ✔     |
| API-06 | Campos solo espacios → 400.                      | Validación trim.       | POST trim → 400.           | ✔     |
| API-09 | GET siempre devuelve array.                      | Respuesta consistente. | GET vacío + GET normal OK. | ✔     |
| API-10 | POST devuelve shape esperado (sin socio_id).     | `select(...)`.         | Validado.                  | ✔     |

---

# 6. API / Errores y RLS

| ID     | Contrato funcional                          | Implementación  | Pruebas API F3b     | Estado |
| ------ | ------------------------------------------- | --------------- | ------------------- | ------ |
| API-07 | Error BD en GET → 500 + mensaje genérico.   | Manejo 500.     | Simulación OK.      | ✔     |
| API-08 | Error BD en POST → 500 + mensaje genérico.  | Manejo 500.     | POST 500 OK.        | ✔     |
| API-11 | A no puede leer sugerencias de B.           | RLS select own. | GET RLS cruzado OK. | ✔     |
| API-12 | No permitir insertar con socio_id alterado. | RLS insert own. | POST inválido OK.   | ✔     |

---

# 7. Resumen de cobertura F3b

| Categoría                | Estado           |
| ------------------------ | ---------------- |
| Autenticación 401        | ✔ Completo      |
| GET autenticado (shape)  | ✔ Completo      |
| POST autenticado (shape) | ✔ Completo      |
| Validaciones 400         | ✔ Completo      |
| Errores 500              | ✔ Completo      |
| RLS lectura/escritura    | ✔ Completo      |
| Suite Newman             | ✔ Lista para CI |

---

# 8. Nota hacia F4 (CI/CD)

## La colección Postman F3b está lista para integrarse con GitHub Actions mediante Newman.
