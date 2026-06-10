# AGENTS.md

## Project Overview

Personal site built with **React 18 + Vite 8**, deployed on **Netlify**. The site is a **Fallout-style CRT terminal**: a login-style boot sequence, a numbered main menu, and paged screens with real URLs. It is deliberately NOT a resume site — work lives in one section; the rest is the owner's journey and hobbies. Green phosphor default, 5-theme cycle (green/amber/ice/white/alert) with theme-tinted pixel cursors. Fully keyboard-operable.

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
App.jsx                       boot gate (plain useState, boots EVERY visit: credentials login → 4s loading boot) + routes
├── BootSequence/             stage machine: login form → loading bar + visitor report → WELCOME <name>
│   ├── AsciiGlobe.jsx        rotating <pre> wireframe sphere
│   └── (uses utils/deviceSpecs.js + api.ipify.org; writes sessionStorage 'termlink-operator')
└── BrowserRouter
    └── Terminal/             CRT shell: scanlines, vignette, sweep, flicker, ~20s random glitch
        ├── PhosphorSwitch    in-flow right-aligned row at top of shell: phosphor cycle + [♪] sound toggle (blobs on mobile); NOT fixed — fixed positioning overlapped the [ESC] back link
        ├── EscToMenu         global Esc → navigate('/')
        ├── RouteRedraw       keyed clip-path wipe on every navigation
        ├── SystemFault.jsx   error boundary
        │   ├── /             MainMenu/  (ascii banner, roving-tabindex menu, StatusPanel)
        │   ├── /career       screens/CareerDossier    [01] (ALL work: experience+loadout, projects, testimonials, resume link)
        │   ├── /recreation   screens/RecreationWing   [02] (live Steam + Last.fm feeds, photos, side quests)
        │   ├── /personnel    screens/PersonnelFile    [03, locked] (HackMinigame gate → journey accordion + portrait; re-locks every visit)
        │   ├── /monitor      screens/SystemMonitor    [04] (live GitHub + LeetCode telemetry)
        │   ├── /comms        screens/OpenComms        [05] (contact form, JS-validated in-fiction)
        │   └── *             screens/FileCorrupted    (404)
        ├── StatusBar/        fixed footer: path · socials · [LOGOUT] · clock (hints hidden <900px)
        ├── CommandPrompt/    Ctrl+K or '>' summonable prompt; commands data in constants; [CMD] button all sizes
        └── SoundLayer        WebAudio key clicks + hum when settings.sound (ON by default)
```

Shared: `screens/ScreenFrame.jsx` (scramble-decode title + back link), `PhosphorImage/` (duotone image + VIEW RAW lightbox), `HackMinigame/` (CODE INTERCEPT memory game: memorize a 5-digit code in 4s, 3 attempts; props onWin/onLockout).

### Boot sequence contract
`BootSequence({ onDone })`, default export. Stages: (1) uplink — local header lines + AsciiGlobe + IP fetch (api.ipify.org, 3s AbortController timeout, fallback 'UNTRACEABLE'); (2) report — padLine-formatted visitor lines from `utils/deviceSpecs.js` (`getDeviceSpecLines`, `getRegion`, `getBrowserName` — all throw-proof with in-fiction fallbacks); (3) login — holds at `IDENTIFY USER:` until any key/click, fake-types GUEST, then onDone. **There is intentionally no skip** — the owner wants it user-paced. Don't reintroduce sessionStorage gating.

### Theming & settings
- `src/theme.js` — amber/green palettes → CSS custom properties (`--phosphor`, `--dim`, `--bg`, `--glow`) + `data-theme`.
- `src/settings.jsx` — context persisting `{ theme, sound }` (localStorage `termlink-settings`). The owner explicitly killed all other toggles (scanlines/text-size/sweep/boot were removed). Controls: top-right PhosphorSwitch + `[♪]` in StatusBar.
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
