# LearnHub — Angular 22 + Material Scaffold

Base project demonstrating a three-layer Material design-token system, with a login page that routes to a learning-management dashboard.

## Run

```bash
npm install
npm start          # http://localhost:4200
npm run build
```

Requires Node ≥ 22.22.3 or ≥ 24.15. Login accepts any email + 8-character password (mock auth).

## Structure

```
src/
├── styles.scss               # entry — @use only, no rules
├── styles/
│   ├── _tokens.scss          # Layer 0: spacing, radius, success/warning
│   ├── _theme.scss           # Layer 1: mat.theme() + light/dark classes
│   ├── _overrides.scss       # Layer 2: per-component-type token overrides
│   ├── _variants.scss        # Layer 3: btn-danger, field-compact, chip-*…
│   └── _base.scss            # html/body reset
└── app/
    ├── core/                 # singletons: auth (service + guards), theme, data
    ├── layout/shell/         # sidenav + toolbar wrapper for signed-in routes
    ├── features/
    │   ├── login/
    │   └── dashboard/        # stat cards, sortable/filterable table, list, dialog
    └── shared/ui/            # reusable presentational components
```

## Notes

- **Fonts are self-hosted** (`@fontsource/roboto`, `material-symbols`) — no Google Fonts calls, works offline / on restricted networks.
- **Icons:** `<mat-icon>name</mat-icon>` renders Material Symbols Outlined (set globally in `app.config.ts`).
- **Standalone components, signals, new control flow, lazy routes** throughout. No NgModules.
- Swap `AuthService` and `LearningDataService` internals for real APIs — components only read their signals.

See **STYLE-GUIDE.md** for styling rules.
