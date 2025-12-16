# QA · F4 – Dockerización y Ejecución en Contenedores

Infraestructura mínima para construir, ejecutar y probar la aplicación Buzón de Sugerencias (Next.js + Supabase) dentro de Docker.  
F4 unifica: imágenes reproducibles, entorno aislado de ejecución, compatibilidad CI/CD y soporte para pruebas automatizadas.

---

## 1. Objetivos de F4

- Empaquetar la aplicación en una imagen Docker estable y reproducible.
- Ejecutar el Buzón de Sugerencias en un contenedor aislado.
- Habilitar builds consistentes para CI/CD (GitHub Actions).
- Proveer comandos estándar para desarrollo, QA y troubleshooting.
- Facilitar integración futura con Postman/Newman, Cypress y pipelines.

---

## 2. Archivos Docker de referencia

### 2.1 `Dockerfile`

Imagen multi-stage con Node 20-alpine, optimizada para producción:

```
# Etapa 1: dependencias
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Etapa 2: build de producción
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Etapa 3: runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000
CMD ["npm", "run", "start"]
```

---

### 2.2 `docker-compose.local.yml`

Definición local para ejecutar el contenedor en modo desarrollo/QA:

```
services:
  mvp-qa-agrbb-buzon:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: mvp-qa-agrbb-buzon
    ports:
      - "3000:3000"
    environment:
      SUPABASE_URL: ${SUPABASE_URL}
      SUPABASE_ANON_KEY: ${SUPABASE_ANON_KEY}
      API_BASE_URL: "http://localhost:3000/api"
    volumes:
      - .:/app
    restart: unless-stopped
```

---

## 3. Ejecución local

### 3.1 Build + run (primer uso)

```
docker compose -f docker-compose.local.yml up --build
```

### 3.2 Ejecutar en segundo plano

```
docker compose -f docker-compose.local.yml up -d
```

### 3.3 Ver contenedores activos

```
docker compose -f docker-compose.local.yml ps
```

### 3.4 Detener todo

```
docker compose -f docker-compose.local.yml down
```

### 3.5 Acceder desde navegador

```
http://localhost:3000
```

---

## 4. Logs y debugging

### Ver logs del contenedor

```
docker logs -f mvp-qa-agrbb-buzon
```

### Shell dentro del contenedor

```
docker exec -it mvp-qa-agrbb-buzon sh
```

---

## 5. Integración con QA (Cypress + Postman)

### 5.1 Tests API (Postman / F3b)

Se ejecutarán contra:

```
http://localhost:3000/api
```

### 5.2 Tests UI (Cypress / F3)

Ejecutar Cypress con el contenedor ya arriba:

```
npx cypress run
```

### 5.3 Futuro: tests dentro del contenedor

Ejemplo (para pipelines CI/CD):

```
docker exec mvp-qa-agrbb-buzon npm test
```

(Definir scripts según necesidades del proyecto)

---

## 6. Integración CI/CD (GitHub Actions)

### 6.1 Esqueleto de workflow compatible con F4

```
name: CI-F4-Docker

on:
  push:
    branches: ["main", "feature/*", "refactor/*"]
  pull_request:

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v4

      - name: Build Docker image
        run: docker build -t mvp-qa-ag-rbb-app .

      - name: Run container
        run: docker run -d -p 3000:3000 --name app mvp-qa-ag-rbb-app

      - name: Health check
        run: curl --retry 5 --retry-delay 5 http://localhost:3000

      # Aquí pueden integrarse Postman/Newman y Cypress
```

---

## 7. Buenas prácticas y recomendaciones

- Usar imágenes ligeras (`alpine`) para reducir tiempos de build en CI.
- Mantener Dockerfile libre de dependencias innecesarias.
- Definir variables críticas en `.env.local` y `.env.ci`.
- Documentar diferencias entre entornos: local, QA, CI.
- Mantener versiones de Node y Next sincronizadas entre contenedor y repositorio.

---

## 8. Checklist para completar F4

- [ ] Dockerfile validado y funcionando
- [ ] docker-compose.local.yml probado
- [ ] Contenedor expone la app en `localhost:3000`
- [ ] Postman F3b ejecutado contra contenedor
- [ ] Cypress F3 ejecutado contra contenedor
- [ ] Workflow CI con build + healthcheck configurado
- [ ] Documentación final unificada en `docs/qa_f4_docker.md`

---

**Estado:** Documento base completado.  
Listo para integración con CI/CD y validación QA.
