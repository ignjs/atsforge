
# CV ATS Generator

Generador de CV minimalista y ATS-friendly hecho con Vite + React + TypeScript.

## Instalación y uso local

```bash
npm install
npm run dev
```

## Deploy en GitHub Pages

1. Edita `package.json` y reemplaza `TU-USUARIO` por tu usuario de GitHub en el campo `homepage`.
2. Ejecuta:

```bash
npm run deploy
```

Esto compilará y publicará el sitio en GitHub Pages.

## Estructura

- **src/components/**: Formularios y preview
- **src/stores/**: Zustand store
- **src/types/**: Tipos TypeScript

## Dependencias principales
- Vite, React, TypeScript
- Zustand
- react-hook-form
- jspdf, html2canvas
- docx
- lucide-react
- tailwindcss

## Scripts
- `dev`: desarrollo local
- `build`: build de producción
- `predeploy`: build previo a deploy
- `deploy`: deploy a GitHub Pages
