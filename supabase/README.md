# Supabase · Arquitectura de Base de Datos · MVP QA · AG RBB

Este directorio contiene todo lo relacionado con la base de datos del proyecto:

- Migraciones versionadas (`migrations/`)
- Datos de ejemplo para pruebas (`seeds/`)
- Documentación técnica de BD (`docs/`)
- Scripts de prueba (`tests/`)
- Scripts utilitarios (`utils/`)

La idea es que cualquier cambio de esquema quede registrado aquí y sea reproducible en otros entornos (local, QA, CI/CD).

---

## Estructura

```text
supabase/
├── README.md
├── migrations/      # Cambios de esquema (DDL, RLS, constraints)
├── seeds/           # Datos de prueba / inicialización
├── docs/            # Documentación de BD
├── tests/           # Pruebas SQL de consultas y RLS
└── utils/           # Scripts de mantenimiento
