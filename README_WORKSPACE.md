# Workspace: Yor Smriti

Open the workspace file `Yor Smriti.code-workspace` in VS Code to use the provided settings and tasks.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

## Available VS Code tasks

- `npm: dev` — start the dev server
- `npm: build` — create a production build
- `npm: lint` — run ESLint
- `npm: type-check` — run TypeScript checks

Notes:
- `editor.formatOnSave` is enabled and ESLint fixes run on save.
- The `.next` folder and `node_modules` are excluded from file watching.
