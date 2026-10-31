# SIRE — Sistema de Registro de Estudiantes (v2.0)

Prototipo funcional **sin defectos** del taller **"Implementación del Plan de Pruebas de Software"** — Ingeniería de Software II.

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

> 📘 La guía completa paso a paso para Visual Studio Code está en **[GUIA_VSCODE.md](./GUIA_VSCODE.md)**.

## Requisitos

- Node.js ≥ 20.9 (recomendado 22 LTS)
- npm ≥ 10

## Estado

| Versión | Estado | Dónde verla |
|---|---|---|
| v1.0 | Con 4 defectos (DEF01-DEF04) | Mockups HTML en `public/mockups-v1/` |
| **v2.0** | **Corregida — 12/12 casos de prueba aprobados** | Esta aplicación |
