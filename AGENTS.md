# AGENTS.md

## Project Overview

Personal portfolio built with **React 18 + Vite 8**, deployed on **Netlify**. The site is a **Fallout-style CRT terminal**: a boot sequence, a numbered main menu, and paged screens with real URLs. Amber phosphor by default, green as a toggle. Fully keyboard-operable.

Design spec: `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`
Phase 1 plan: `docs/superpowers/plans/2026-06-10-terminal-portfolio-phase-1.md`

## Essential Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview production build locally
npm run lint       # ESLint (js/jsx, zero warnings policy)
npm test           # Vitest, happy-dom environment
npm run test:watch # Vitest watch mode
```

## Architecture

### App Structure

```
App.jsx                       boot gate (sessionStorage) + providers + routes
├── BootSequence/             POST-style boot text, once per session, skippable
└── BrowserRouter
    └── Terminal/             CRT shell: scanlines, vignette, sweep, flicker
        ├── EscToMenu         global Esc → navigate('/')
        └── SystemFault.jsx   error boundary → "SYSTEM FAULT" screen
            ├── /             MainMenu/  (numbered menu, digit/arrow/Enter keys)
            ├── /personnel    screens/PersonnelFile    (typed bio, timeline, skill bars)
            ├── /archives     screens/ProjectArchives  (expandable files + PhosphorImage)
            ├── /commendations screens/Commendations   (testimonials as recovered logs)
            ├── /comms        screens/OpenComms        (contact form + socials + resume)
            ├── /calibration  screens/Calibration      (theme + scanline settings)
            └── *             screens/FileCorrupted    (404)
```

Shared pieces: `screens/ScreenFrame.jsx` (title bar + `[ESC] MAIN MENU` link wrapper used by every screen), `PhosphorImage/` (duotone-tinted image + `[VIEW RAW]` lightbox).

### Theming

- `src/theme.js` — amber/green palettes; `applyTheme()` writes CSS custom properties (`--phosphor`, `--dim`, `--bg`, `--glow`) onto `<html>` and sets `data-theme`.
- `src/settings.jsx` — `SettingsProvider` / `useSettings()` context; persists `{ theme, scanlines }` to localStorage key `termlink-settings`; memoized context value.
- styled-components consume the CSS variables (`var(--phosphor)`), so a theme swap recolors everything without re-rendering styles.
- `src/index.css` holds the global reset + amber fallback variables (prevents flash before JS).

### Hooks

- `src/hooks/useTypewriter.js` — rAF-driven `{ output, done, skip }`; instant under `prefers-reduced-motion`. The return shape is a contract — don't change it.
- `src/hooks/usePageMeta.js` — per-route `document.title` + meta description.

### Data Flow

- All content lives in `src/constants/index.js` — **single source of truth**: `personal`, `bootLines`, `menuItems`, `experience`, `skills`, `projects`, `testimonials`, `socials`. Several entries are marked `PLACEHOLDER` / `UPDATE ME` pending owner content.
- Contact form POSTs JSON to `/.netlify/functions/send-email` via **fetch** (no axios). The serverless function uses **nodemailer** with Elastic Email SMTP (`EMAIL_USERNAME`/`EMAIL_PASSWORD` env vars).
- Routing: **react-router-dom**; `netlify.toml` has the SPA catch-all redirect. Function calls must use the canonical `/.netlify/functions/...` path (served before redirects).

## Code Patterns & Conventions

- **styled-components for all styling**; the only CSS file is `src/index.css`. Components reference theme via `var(--...)` custom properties, never hard-coded colors.
- **Default exports** for components; named exports for hooks/utilities (`useTypewriter`, `useSettings`, `applyTheme`).
- **PropTypes** on every component that takes props.
- Explicit `.jsx` extensions in imports (Vite convention).
- Public assets in `public/img/`, referenced root-relative (`img/foo.png`).
- Tests sit next to source (`*.test.jsx`), run on **happy-dom** (NOT jsdom — the corporate npm proxy blocks a jsdom transitive dep). `src/test/setup.js` shims `matchMedia` and `localStorage`.
- JSX text starting with `//` must be wrapped as a string expression (`{'// TITLE'}`) or ESLint's `react/jsx-no-comment-textnodes` fails the zero-warnings build.

## Gotchas & Non-Obvious Details

1. **Boot plays once per session** — gated by `sessionStorage.termlink-booted`. Clear it to re-test the boot.
2. **EscToMenu reads `window.location.pathname` at event time**, not from a React closure — a closure goes stale in the gap between navigation and effect re-registration. Don't "simplify" it back.
3. **PhosphorImage Esc handling uses a capture-phase listener + stopPropagation** so closing the lightbox doesn't also trigger EscToMenu. Same caution.
4. **Bright/white source images look flat under the duotone** (multiply blend over phosphor). Prefer darker screenshots for project thumbnails.
5. **Netlify function is CJS** (`exports.handler`) with an ESM-style nodemailer import inlined by `netlify-plugin-inline-functions-env`; env vars come from Netlify, there is no dotenv.
6. **`npm test` exits 1 if no test files match** — fine in isolation, but don't "fix" it by adding `--passWithNoTests` without checking CI expectations.
7. **Phase 2/3 features are specced but unbuilt** (command prompt, hack minigame, sound, SYSTEM MONITOR, HOLOTAPE LOGS, guestbook). Check the spec before inventing structure for them.
