# MVP QA · AG RBB – Buzón de Sugerencias

MVP web desarrollado para la Asociación Gremial Resonancias del Biobío (AG RBB).  
Incluye registro y login de socios, un buzón de sugerencias con CRUD básico y un endpoint placeholder para `/api/rag/ask` preparado para futura integración con RAG.  
El proyecto incorpora pruebas automatizadas (UI + API), CI/CD con GitHub Actions y un Dockerfile básico para ejecutar la aplicación en un entorno aislado.

---

## Descripción del proyecto

Este repositorio contiene el desarrollo del MVP que se utilizará como entrega final del curso **Test Automation Engineer**.  
El objetivo es demostrar un flujo completo **Web + API + QA Automation + CI/CD**, utilizando tecnologías modernas y un diseño modular que pueda escalar en fases futuras.

**Incluye:**
- Registro y login de socios (Next.js + Supabase Auth)  
- Buzón de sugerencias (CRUD)  
- Endpoint placeholder `/api/rag/ask`  
- Pruebas automatizadas (Cypress + Postman/Newman)  
- Pipeline CI/CD con GitHub Actions  
- Dockerfile básico para ejecución de la app  

---

## Stack Tecnológico

- **Next.js** – Frontend + API Routes  
- **Supabase** – Autenticación + base de datos PostgreSQL  
- **Cypress** – Pruebas E2E  
- **Postman/Newman** – Pruebas de API  
- **GitHub Actions** – CI/CD  
- **Docker** – Contenedor básico para la aplicación  

---

## Estado del proyecto

- **Estado actual:**  
  - **Fase 0 – Estructura inicial del repositorio (sin código todavía).**  
  - **Fase 1 – En curso.**

---

## Integración Supabase – Diseño

Esta sección describe la arquitectura base de integración entre Next.js y Supabase para el MVP QA · AG RBB.

### Variables de entorno requeridas

El proyecto utiliza tres variables principales asociadas a Supabase:

- **NEXT_PUBLIC_SUPABASE_URL**  
  URL del proyecto Supabase. Es pública y se expone al cliente porque no contiene privilegios.

- **NEXT_PUBLIC_SUPABASE_ANON_KEY**  
  Clave pública del proyecto Supabase. Permite operaciones autenticadas en el navegador bajo políticas RLS.

- **SUPABASE_SERVICE_ROLE_KEY**  
  Clave privada con permisos elevados. Solo debe utilizarse en el servidor (endpoints internos) y nunca debe ser expuesta al navegador.

Todas estas variables deben estar documentadas en `.env.example` y sus valores reales deben ir en `.env.local`, que no se versiona.

### Clientes Supabase definidos

El proyecto separa la responsabilidad de los clientes Supabase según el contexto donde se usan:

- **Cliente público (frontend)**  
  Ubicación prevista: `lib/supabaseClientPublic.js`  
  Uso esperado:  
  - Formularios de registro de socios.  
  - Formularios de login.  
  - Manejo básico de sesión en componentes de interfaz.

- **Cliente de servidor (backend / API)**  
  Ubicación prevista: `lib/supabaseServerClient.js`  
  Uso esperado:  
  - Endpoints en `/api` para lectura y escritura de datos.  
  - CRUD de sugerencias.  
  - Integraciones futuras con RAG utilizando el endpoint `/api/rag/ask`.

Esta separación asegura que las claves privadas permanezcan protegidas y que las operaciones sensibles se manejen exclusivamente del lado del servidor.

### Flujo básico de autenticación

El diseño de la autenticación del MVP considera el siguiente flujo:

1. **Registro:** El socio crea su cuenta ingresando email y contraseña.  
2. **Login:** El usuario inicia sesión utilizando credenciales válidas.  
3. **Acceso al buzón:** Tras autenticar, se redirige al usuario a la interfaz del buzón de sugerencias.  
4. **Logout:** El usuario cierra sesión y es redirigido a la página de login.

Este flujo será implementado en fases posteriores, pero su arquitectura general queda definida en esta etapa.

---

### Variables de entorno y su rol en CI/CD (Fase 4)

Para mantener consistencia entre el entorno local y el pipeline de CI/CD, se definen desde esta etapa los nombres exactos de las variables que utilizará GitHub Actions como secrets:

- **NEXT_PUBLIC_SUPABASE_URL**
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **SUPABASE_SERVICE_ROLE_KEY**

Estas variables:

1. Se documentan en `.env.example`.
2. Sus valores reales viven en `.env.local` (no se versiona).
3. En la Fase 4 se configurarán como **GitHub Secrets** utilizando exactamente los mismos nombres listados arriba.

Definir estos nombres en Fase 1 evita renombrar variables cuando se construya el archivo de CI (`ci.yml`) y asegura un flujo de integración consistente entre desarrollo local y ejecución en GitHub Actions.

Estas definiciones forman parte del diseño de Fase 1C y habilitan la correcta implementación de Fase 2 (CRUD), Fase 3 (pruebas automatizadas) y Fase 4 (CI/CD).

---

## Rutas y autenticación – Resumen

El diseño detallado de rutas, modelo de datos para socios y escenarios de autenticación se encuentra documentado en la carpeta `docs/`.

### Rutas principales del MVP

La aplicación utiliza las siguientes rutas base:

- `/` – Página inicial simple. Redirige a `/buzon` si el usuario ya está autenticado.
- `/login` – Formulario de inicio de sesión. Si el usuario ya está autenticado, debe redirigir a `/buzon`.
- `/register` – Formulario de registro de nuevos socios. Tras un registro exitoso, redirige siempre a `/login`.
- `/buzon` – Pantalla principal del buzón de sugerencias (requiere autenticación).
- `/logout` – Acción de cierre de sesión que invalida la sesión activa y redirige a `/login`.

El detalle completo se encuentra en:  
`docs/rutas.md`

### Modelo de datos – Socios (resumen)

El modelo mínimo de la tabla `socios` en Supabase se alinea con el sistema de autenticación:

- Cada registro en `socios` corresponde a un usuario en `auth.users`.
- El campo `id` de `socios` coincide con el `id` del usuario en Supabase Auth.
- Para el MVP, la lógica principal utiliza los campos `id`, `email`, `nombre` y `created_at`.
- Los campos `rol` y `estado` se incluyen para extensiones futuras, pero no se usan en la lógica de la primera versión.

El diseño completo de este modelo se encuentra en:  
`docs/modelo_socios.md`

### Escenarios base de autenticación

Se han definido escenarios de uso que cubren:

- Registro exitoso y registro con datos inválidos.
- Registro con email ya registrado.
- Login exitoso y login fallido.
- Protección de acceso a `/buzon`.
- Cierre de sesión y persistencia de sesión tras recargar la página.

Estos escenarios servirán como base para las pruebas E2E (Cypress) y pruebas de API.

El detalle completo se encuentra en:  
`docs/escenarios_auth.md`

---
## Roadmap de Fases

| Fase | Ventana     | Foco principal                     | Entregables clave                                                      |
|------|-------------|------------------------------------|------------------------------------------------------------------------|
| F0   | Día 1       | Preparar repo y entorno             | Repo creado, README v0, Node/PNPM/NPM definidos                       |
| F1   | Días 2–5    | Base app + Supabase + Auth          | Next.js + Supabase configurados, flujo login/registro funcional básico |
| F2   | Días 6–10   | Buzón sugerencias + `/api/rag/ask`  | CRUD sugerencias funcionando + endpoint RAG placeholder                |
| F3   | Días 11–15  | Automatización de pruebas           | Cypress login+creación, colección Postman, scripts npm listos         |
| F4   | Días 16–18  | CI/CD + Docker                      | GitHub Actions con lint + tests + newman, badge CI, Dockerfile app    |
| F5   | Días 19–20  | Hardening + Docs + demo             | README pro, guía de uso, guión para video de presentación             |

---

## Licencia

Proyecto creado para fines educativos y de experimentación en QA Automation.  
No utilizar datos reales de socios en ambientes de prueba.

---

## Autor

Sergio Carlos Delgado Martínez  
Proyecto AG RBB · 2025