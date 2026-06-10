# AGENTS.md

## Project Overview

Personal site built with **React 18 + Vite 8**, deployed on **Netlify**. The site is a **Fallout-style CRT terminal**: a login-style boot sequence, a numbered main menu, and paged screens with real URLs. It is deliberately NOT a resume site — work lives in one section; the rest is the owner's journey and hobbies. Amber phosphor default, green toggle. Fully keyboard-operable.

Design spec + amendment log: `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`

## Essential Commands

```bash
npm run dev / build / preview
npm run lint       # ESLint, zero-warnings policy
npm test           # Vitest, happy-dom environment
```

## Architecture

### App Structure

```
App.jsx                       boot gate (plain useState, boots EVERY visit) + providers + routes
├── BootSequence/             stage machine: uplink → visitor report → login (user-paced)
│   ├── AsciiGlobe.jsx        rotating <pre> wireframe sphere
│   └── (uses utils/deviceSpecs.js + api.ipify.org for the live report)
└── BrowserRouter
    └── Terminal/             CRT shell: scanlines, vignette, sweep, flicker (no settings dep)
        ├── EscToMenu         global Esc → navigate('/')
        ├── RouteRedraw       keyed clip-path wipe on every navigation
        ├── SystemFault.jsx   error boundary
        │   ├── /             MainMenu/  (ascii banner, roving-tabindex menu, StatusPanel)
        │   ├── /personnel    screens/PersonnelFile    (journey timeline, NOT a CV)
        │   ├── /career       screens/CareerDossier    (ALL work: experience, projects, testimonials, resume)
        │   ├── /recreation   screens/RecreationWing   (games, music, photography, side quests)
        │   ├── /comms        screens/OpenComms        (contact form + socials)
        │   └── *             screens/FileCorrupted    (404)
        └── StatusBar/        fixed footer: path · socials · [PHOSPHOR] toggle · clock
```

Shared: `screens/ScreenFrame.jsx` (scramble-decode title + back link), `PhosphorImage/` (duotone image + VIEW RAW lightbox).

### Boot sequence contract
`BootSequence({ onDone })`, default export. Stages: (1) uplink — local header lines + AsciiGlobe + IP fetch (api.ipify.org, 3s AbortController timeout, fallback 'UNTRACEABLE'); (2) report — padLine-formatted visitor lines from `utils/deviceSpecs.js` (`getDeviceSpecLines`, `getRegion`, `getBrowserName` — all throw-proof with in-fiction fallbacks); (3) login — holds at `IDENTIFY USER:` until any key/click, fake-types GUEST, then onDone. **There is intentionally no skip** — the owner wants it user-paced. Don't reintroduce sessionStorage gating.

### Theming & settings
- `src/theme.js` — amber/green palettes → CSS custom properties (`--phosphor`, `--dim`, `--bg`, `--glow`) + `data-theme`.
- `src/settings.jsx` — context persisting `{ theme }` ONLY (localStorage `termlink-settings`). The owner explicitly killed all other toggles (scanlines/text-size/sweep/boot were removed). The only control is the `[PHOSPHOR]` button in StatusBar.
- styled-components consume `var(--...)`; never hard-code colors.

### Hooks
- `useTypewriter` — rAF `{ output, done, skip }`; contract, don't change shape.
- `useScramble` — heading decode effect (returns string).
- `useClock` — ticking HH:MM:SS.
- `usePageMeta` — per-route title/description.

### Data Flow
- ALL content in `src/constants/index.js`: `personal`, `journey`, `experience`, `skills`, `projects`, `testimonials`, `recreation`, `socials`, `menuItems`, `asciiBanner`, `diagnostics`, `bootLines` (legacy export, no longer imported by BootSequence). Many entries are `UPDATE ME` placeholders pending owner content.
- Contact form: fetch POST to `/.netlify/functions/send-email` (nodemailer + ElasticEmail; env from Netlify).
- Routing: react-router-dom; SPA catch-all in `netlify.toml`; function calls must use `/.netlify/functions/...`.

## Code Patterns & Conventions
- styled-components everywhere; only CSS file is `src/index.css`.
- Default exports for components; named for hooks/utils. PropTypes on components with props. Explicit `.jsx` imports.
- Tests beside source, **happy-dom** (corporate proxy blocks jsdom); `src/test/setup.js` shims matchMedia + localStorage.
- JSX text starting with `//` must be `{'// LIKE THIS'}` or `react/jsx-no-comment-textnodes` fails the zero-warnings lint.
- ASCII art `<pre>`s must NOT use VT323 (missing box-drawing glyphs) — use Menlo/Consolas stack (see MainMenu Banner).

## Gotchas & Non-Obvious Details
1. **Boot plays on every full page load** — including deep links. E2E tests must get through the login hold (press a key) before asserting page content.
2. **EscToMenu reads `window.location.pathname` at event time** (stale-closure fix). PhosphorImage's lightbox Esc uses a capture-phase listener + stopPropagation. Don't "simplify" either.
3. **Roving tabindex on MainMenu**: arrow selection and DOM focus are the same element; highlight comes only from `data-active` — don't add `:focus-visible` backgrounds back (that recreates the double-highlight bug).
4. **Bright/white images wash out** under the duotone multiply — prefer darker imagery.
5. **api.ipify.org** is the only external runtime dependency; it fails soft to 'UNTRACEABLE'.
6. **GPU renderer strings are truncated at 48 chars** in deviceSpecs — headless browsers report huge ANGLE/SwiftShader strings.
7. Netlify function is CJS; env inlined by `netlify-plugin-inline-functions-env`; no dotenv.
8. Phase 2/3 (command prompt, hack minigame, sound, system monitor, holotapes, guestbook) are specced but unbuilt.
