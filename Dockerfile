# Dockerfile · MVP QA – AG RBB · Buzón de Sugerencias
# Imagen multi-stage para Next.js 16 (App Router) con npm

#############################################
# 1) Etapa de dependencias
#############################################
FROM node:20-alpine AS deps

WORKDIR /app

# Copiamos manifest de dependencias
COPY package.json package-lock.json ./

# Instalamos dependencias en modo reproducible
RUN npm ci


#############################################
# 2) Etapa de build
#############################################
FROM node:20-alpine AS builder

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# --- VARIABLES NECESARIAS PARA EL BUILD ---
# Las recibimos como ARG desde docker-compose o CI
ARG SUPABASE_URL
ARG SUPABASE_ANON_KEY

# Las exponemos como ENV para que Next.js las use en tiempo de build
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

# Reutilizamos dependencias instaladas
COPY --from=deps /app/node_modules ./node_modules

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el build de Next.js con las variables ya disponibles
RUN npm run build


#############################################
# 3) Etapa de runtime
#############################################
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copiamos solo lo necesario para correr en producción
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Puerto default
ENV PORT=3000
EXPOSE 3000

# --- VARIABLES INYECTADAS EN RUNTIME ---
# Supabase: estas vendrán desde docker-compose o GitHub Actions
ENV SUPABASE_URL=""
ENV SUPABASE_ANON_KEY=""

# Comando de arranque
CMD ["npm", "start"]
