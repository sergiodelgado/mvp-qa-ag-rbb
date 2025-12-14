# Security Policy

## Reporting a Vulnerability

Si encuentras una vulnerabilidad, por favor evita abrir un issue público con detalles explotables.
Reporta el hallazgo vía mensaje privado al mantenedor del repo.

## Secrets

- No se aceptan secretos en el repositorio.
- Se deben usar GitHub Secrets / Supabase / Vercel para credenciales y claves.
- `.env.example` puede incluir placeholders, nunca valores reales.

## Dependency Updates

Este repositorio usa Dependabot para mantener dependencias actualizadas.
Las alertas de `npm audit` se registran como issues con labels `security` y `tech-debt`.
