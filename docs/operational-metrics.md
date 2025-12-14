# Métricas operativas mínimas

## 1) CI duration

- Definición: tiempo total del workflow CI en GitHub Actions.
- Objetivo: mantenerlo estable y reducirlo cuando crezca.

## 2) Flaky tests

- Definición: tests que fallan sin cambios de código.
- Registro: Issue con label `flaky`.
- Objetivo: 0 flaky en main.

## 3) PR lead time

- Definición: días desde PR abierto hasta merge.
- Objetivo: PRs pequeños y rápidos (ideal < 2 días).
