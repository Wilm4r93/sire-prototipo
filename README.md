# SIRE — Sistema de Registro de Estudiantes (v1.0 / v2.0 conmutables)

Prototipo funcional del taller **"Implementación del Plan de Pruebas de Software"** — Ingeniería de Software II. Incluye **dos versiones en una sola aplicación**, seleccionables desde el conmutador del encabezado:

- **v1.0 · Original** — reproduce con fidelidad la versión evaluada en la primera ronda, con los 4 defectos reales: acepta identificaciones duplicadas y las persiste (DEF01), admite correos con formato inválido (DEF02), muestra un error 500 TypeError al consultar una identificación inexistente (DEF03) y permite guardar actualizaciones con campos vacíos perdiendo la información (DEF04).
- **v2.0 · Corregida** — la versión con las correcciones aplicadas, sobre la que se ejecutó la regresión completa (12/12 casos aprobados).

Aplicación web con Next.js 16 + TypeScript + Prisma (SQLite) + Tailwind CSS 4 + shadcn/ui, con interfaz en español que cubre los requisitos RF01-RF07:

- **Registrar** estudiantes con validación de campos obligatorios, unicidad de identificación (RF03) y formato de correo (RF04).
- **Consultar** por identificación con mensaje informativo cuando no existe (RF05).
- **Actualizar** datos con las mismas validaciones (RF06).
- **Listado** de todos los estudiantes registrados (RF01) con mensajes de confirmación/error (RF07).

## Arranque rápido

```bash
npm install          # instalar dependencias
npx prisma generate  # compilar el cliente de base de datos
npm run dev          # arrancar en http://localhost:3000
```

La app arranca en **v1.0**; usa el conmutador del encabezado para pasar a la **v2.0** y comparar el comportamiento con los mismos casos de prueba.

> 📘 La guía completa paso a paso para Visual Studio Code (incluido el guion de demostración defecto por defecto) está en **[GUIA_VSCODE.md](./GUIA_VSCODE.md)**.

## Requisitos

- Node.js ≥ 20.9 (recomendado 22 LTS)
- npm ≥ 10

## Estado

| Versión | Estado | Dónde verla |
|---|---|---|
| v1.0 | Con 4 defectos (DEF01-DEF04) implementados de verdad | Conmutador **v1.0 · Original** de esta aplicación |
| **v2.0** | **Corregida — 12/12 casos de prueba aprobados** | Conmutador **v2.0 · Corregida** de esta aplicación |
| — | Evidencia estática adicional | Mockups HTML en `public/mockups-v1/` |
