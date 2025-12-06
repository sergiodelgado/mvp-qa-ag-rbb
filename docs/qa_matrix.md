# docs/qa_matrix.md — Matriz Contrato → Implementación → Pruebas

**MVP QA – AG RBB · Buzón de Sugerencias**

La matriz relaciona contratos funcionales (UI + API + RLS), implementación real del repositorio y pruebas correspondientes (UI F3 y API F3b), junto con el estado de cobertura.

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

| ID      | Contrato funcional                               | Implementación                        | Pruebas UI F3 | Pruebas API F3b      | Estado |
| ------- | ------------------------------------------------ | ------------------------------------- | ------------- | -------------------- | ------ |
| C-BZ-02 | Carga inicial ejecuta GET `/api/sugerencias`.    | `useEffect`.                          | GET inicial.  | GET 200 / vacío.     | ✔     |
| C-BZ-05 | Botón “Actualizar lista” reejecuta GET.          | Llamada directa a `fetchSugerencias`. | Verificado.   | GET 200.             | ✔     |
| C-BZ-06 | Botón alterna texto durante carga.               | Estado `loadingSugerencias`.          | Test visual.  | —                    | ✔     |
| C-BZ-07 | Con latencia muestra “Cargando sugerencias…”.    | Condición `loading && empty`.         | Verificado.   | —                    | ✔     |
| C-BZ-08 | Si no hay sugerencias, UI muestra mensaje vacío. | Mensaje en pantalla.                  | Observado.    | GET vacío pendiente. | ◐      |

---

# 3. UI / Formulario

| ID      | Contrato funcional                                   | Implementación         | Pruebas UI F3     | Pruebas API F3b           | Estado  |
| ------- | ---------------------------------------------------- | ---------------------- | ----------------- | ------------------------- | ------- |
| C-BZ-09 | No envía si campos vacíos (`trim`).                  | Validación en submit.  | Formulario vacío. | POST vacío pendiente.     | ✔ (UI) |
| C-BZ-10 | Sugerencia válida crea registro y limpia inputs.     | Inserción y limpieza.  | Crear OK.         | POST válido implementado. | ✔      |
| C-BZ-11 | Error 500 al crear no limpia campos y muestra error. | Manejo en catch.       | —                 | Error POST pendiente.     | ◐       |
| C-BZ-12 | Si POST responde 401, UI redirige a login.           | Manejo de 401.         | —                 | POST 401 OK.              | ✔      |
| C-BZ-13 | Error al listar no borra lista previa.               | Catch mantiene estado. | —                 | GET error pendiente.      | ◐       |
| C-BZ-14 | Error al crear muestra mensaje específico.           | Catch POST.            | —                 | POST error pendiente.     | ◐       |

---

# 4. API / Autenticación y validación

| ID     | Contrato funcional               | Implementación   | Pruebas API F3b | Estado |
| ------ | -------------------------------- | ---------------- | --------------- | ------ |
| API-01 | GET sin sesión → 401 + mensaje.  | Validación user. | OK Newman.      | ✔     |
| API-02 | POST sin sesión → 401 + mensaje. | Validación user. | OK Newman.      | ✔     |

---

# 5. API / Datos, validaciones y shape

| ID     | Contrato funcional                               | Implementación           | Pruebas API F3b                 | Estado |
| ------ | ------------------------------------------------ | ------------------------ | ------------------------------- | ------ |
| API-03 | GET devuelve solo sugerencias del usuario (RLS). | Política select propia.  | Test multiusuario pendiente.    | ◐      |
| API-04 | POST crea sugerencia asociada al usuario actual. | Inserción con `user.id`. | POST válido OK.                 | ✔     |
| API-05 | Payload inválido → 400.                          | Validaciones de body.    | Prueba pendiente.               | ○      |
| API-06 | Campos solo espacios → 400.                      | Validación `trim()`.     | Prueba pendiente.               | ○      |
| API-09 | GET siempre devuelve array (vacío o con datos).  | Respuesta consistente.   | Falta validar caso array vacío. | ◐      |
| API-10 | POST devuelve solo objetos con shape esperado.   | Select sin `socio_id`.   | Validado.                       | ✔     |

---

# 6. API / Errores y RLS

| ID     | Contrato funcional                          | Implementación  | Pruebas API F3b           | Estado |
| ------ | ------------------------------------------- | --------------- | ------------------------- | ------ |
| API-07 | Error BD en GET → 500 + mensaje genérico.   | Manejo 500.     | Pendiente.                | ◐      |
| API-08 | Error BD en POST → 500 + mensaje genérico.  | Manejo 500.     | Pendiente.                | ◐      |
| API-11 | Usuario A no puede leer sugerencias de B.   | RLS select own. | Pendiente multiusuario.   | ○      |
| API-12 | No permitir insertar con socio_id alterado. | RLS insert own. | Pendiente prueba directa. | ○      |

---

# 7. Resumen de cobertura F3b

| Categoría                | Estado                          |
| ------------------------ | ------------------------------- |
| Autenticación 401        | ✔ Completo                     |
| GET autenticado (shape)  | ◐ Falta caso vacío              |
| POST autenticado (shape) | ✔ Completo                     |
| Validaciones 400         | ○ Pendiente                     |
| Errores 500              | ○ Pendiente                     |
| RLS lectura/escritura    | ○ Pendiente                     |
| Suite Newman             | ◐ Base lista, falta completarla |

---

# 8. Nota hacia F4 (CI/CD)

Todos los contratos (`C-*` y `API-*`) pasarán a ejecutarse automáticamente en GitHub Actions usando la suite Newman.
La colección Postman debe mantenerse alineada con esta matriz y con `docs/qa_f3b.md`.

---
