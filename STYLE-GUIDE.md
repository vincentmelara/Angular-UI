# Style Guide

How styling works in this app. Read this before writing any CSS.

## TL;DR for everyday work

1. **Use Material components as-is.** They already look right — Layers 1 and 2 handle it.
2. **Need an exception?** Add **one variant class** from the list below. No CSS.
3. **Need page layout?** Write it in your component's own `.scss`, using `--app-*` tokens for spacing and `--mat-sys-*` for colors/type.
4. **Never:** inline `style=""`, Bootstrap/utility classes, `!important`, hex/px colors, `::ng-deep`, or selectors targeting `.mdc-*` / `.mat-mdc-*`.

## The three layers

| Layer | File | What it does | Who edits it |
|---|---|---|---|
| 0 · Tokens | `src/styles/_tokens.scss` | Spacing, radius, layout sizes, success/warning colors | Leads, rarely |
| 1 · Theme | `src/styles/_theme.scss` | `mat.theme()` — palette, typography, density. One change updates the whole app | Leads, rarely |
| 2 · Overrides | `src/styles/_overrides.scss` | Default look per component *type* via `mat.<component>-overrides()` | Leads, when the design system changes |
| 3 · Variants | `src/styles/_variants.scss` | Opt-in classes for one-off exceptions | Anyone, via PR |

`src/styles.scss` only `@use`s these files. Nothing else goes in it.

## Variant classes

| Class | Use on | Purpose |
|---|---|---|
| `btn-danger` | any `mat-*-button` | Destructive actions (delete, archive, revoke) |
| `btn-success` | any `mat-*-button` | Positive confirms (approve, complete) |
| `btn-tertiary` | any `mat-*-button` | Secondary emphasis |
| `btn-block` | any button | Full width |
| `field-compact` | `mat-form-field` | Dense field for filters/toolbars |
| `field-block` | `mat-form-field` | Full width |
| `chip-success` / `-warning` / `-danger` / `-info` / `-neutral` | `mat-chip` | Status pills |
| `progress-success` / `-warning` / `-danger` | `mat-progress-bar` | Status-colored progress |
| `card-tonal` | `mat-card` | Tinted callout card |

```html
<button mat-flat-button class="btn-danger">Delete</button>
<mat-form-field appearance="outline" class="field-compact">…</mat-form-field>
<mat-chip class="chip-warning">At risk</mat-chip>
```

**Mapping data → variants:** keep it in TypeScript (see `STATUS_UI` in `dashboard.ts`), so templates never decide colors.

## Adding a new variant

1. Confirm the need recurs (2+ places). One-offs are a design conversation first.
2. Add it to `_variants.scss` using only `mat.<component>-overrides(...)` with `--mat-sys-*` / `--app-*` values.
3. Name it `<component>-<intent>`.
4. Add a row to the table above.

Token names for each component: material.angular.dev → component → **Styling** tab.

## Light / dark

`mat.theme()` emits `light-dark()` colors. `ThemeService` toggles `.light-theme` / `.dark-theme` on `<html>` (no class = follow OS). If you only use `--mat-sys-*` and `--app-*` values, dark mode works automatically.

## Useful system variables

- Surfaces: `--mat-sys-surface`, `-surface-container(-low|-high|-highest)`
- Text: `--mat-sys-on-surface`, `--mat-sys-on-surface-variant`
- Roles: `--mat-sys-primary`, `-primary-container`, `-tertiary`, `-error` (+ `on-*` pairs)
- Lines: `--mat-sys-outline`, `--mat-sys-outline-variant`
- Type: `font: var(--mat-sys-headline-medium)`, `-title-large`, `-body-medium`, `-label-large`…
