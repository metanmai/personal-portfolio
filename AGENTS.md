# AGENTS.md

## Project Overview

Personal site built with **React 18 + Vite 8**, deployed on **Netlify**. The
site is a **Fallout-style CRT terminal**: a login boot sequence, a numbered main
menu, and paged screens with real URLs. It is deliberately NOT a résumé site —
work lives in two sections; the rest treats the owner as a contained "test
subject." Multi-theme phosphor cycle (amber/green/ice/white/alert). Fully
keyboard-operable; honors `prefers-reduced-motion`.

Design spec + amendment log: `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`

## Essential Commands

```bash
npm run dev / build / preview
npm run lint       # ESLint, zero-warnings policy
npm test           # Vitest, happy-dom environment
```

## Architecture

```
App.jsx                       boot gate (boots EVERY visit) + logout handler + routes
├── BootSequence/             stages: login (operator name + security challenge)
│   │                         → unlock animation → loading boot + visitor report → WELCOME
│   └── AsciiGlobe.jsx        rotating <pre> wireframe sphere
├── LogoutSequence.jsx        full-screen shutdown animation (window 'termlink-logout' event)
└── BrowserRouter
    └── Terminal/             CRT shell: scanlines, vignette, sweep, random glitch
        ├── PhosphorSwitch    in-flow theme cycle + [♪] sound toggle (NOT fixed — would cover [ESC])
        ├── EscToMenu         global Esc → navigate('/')
        ├── RouteRedraw       keyed clip-path wipe on every navigation
        ├── SystemFault.jsx   error boundary
        │   ├── /             MainMenu/ (ascii banner, roving-tabindex menu, StatusPanel)
        │   ├── /career       screens/CareerDossier   [01] (experience, skills loadout, testimonials, résumé link)
        │   ├── /projects     screens/FieldOperations [02] (project card grid: CRT thumbnails, tech tags, links)
        │   ├── /personnel    screens/PersonnelFile   [03, locked] (HackMinigame gate → LockReveal → life-timeline of photo captures; re-locks every visit)
        │   ├── /monitor      screens/SystemMonitor   [04] (live vitals/ECG, last-known position, GitHub + LeetCode + Steam + Last.fm feeds, offline fallbacks)
        │   ├── /comms        screens/OpenComms       [05] (contact form → Netlify Forms)
        │   └── *             screens/FileCorrupted   (404)
        ├── StatusBar/        fixed footer: path · socials · [LOGOUT] · clock
        ├── CommandPrompt/    Ctrl+K or '>' summonable prompt (help/open/theme/sound/whoami/hack/logout/clear)
        └── SoundLayer        WebAudio keystroke/blip SFX when settings.sound (no ambient hum)
```

Shared: `screens/ScreenFrame.jsx` (scramble-decode title + back link),
`HackMinigame/` (Fallout-style "ICE BREACH" password hack: find the password
among candidate words via likeness feedback; bracket bonuses; `onWin`/`onLockout`
props, accepts an `initialPuzzle` test seam), `LockReveal.jsx` (3D padlock open
shown after a successful bypass).

### Boot sequence contract

`BootSequence({ onDone })`, default export. Stages: **login** (HEADER_LINES +
AsciiGlobe; `OPERATOR NAME` is force-uppercased; a rotating security challenge
from `utils/loginPuzzle.js` must be solved) → **unlock** (brief ACCESS GRANTED
flourish) → **boot** (`padLine`-formatted visitor report from
`utils/deviceSpecs.js` + progress bar; IP from `api.ipify.org` with a 3s
AbortController timeout, fallback `UNTRACEABLE`) → **granted** → `onDone`. Boots
on every visit by design — don't add sessionStorage gating to skip it.

### Theming & settings

- `src/theme.js` — phosphor palettes → CSS custom properties (`--phosphor`,
  `--dim`, `--bg`, `--glow`) + `data-theme`.
- `src/settings.jsx` — context persisting `{ theme, sound }` (localStorage
  `termlink-settings`). Controls: top-right PhosphorSwitch + `[♪]` in StatusBar,
  plus the `theme`/`sound` prompt commands.
- styled-components consume `var(--...)`; never hard-code colors.

### Hooks & shared utils

- `useTypewriter` — rAF `{ output, done, skip }`; don't change shape.
- `useScramble` — heading decode effect (returns string).
- `useClock` — ticking HH:MM:SS.
- `usePageMeta` — per-route title/description.
- `useRemoteData` — fetch wrapper returning `{ status, data }` (loading/ready/failed).
- `utils/reducedMotion.js` — single throw-proof `reducedMotion()` check; import
  it rather than re-defining the matchMedia helper.

### Data flow

- ALL content in `src/constants/index.js`: `personal`, `experience`, `skills`,
  `projects`, `testimonials`, `journey` (personnel timeline), `recreation`,
  `surveillance`, `fallback` (offline-readout data for the monitor), `socials`,
  `menuItems`, `commands`, `hackGame`, `monitor`, `asciiBanner`, `diagnostics`.
- Contact form: posts URL-encoded data (`form-name: comms`) to `/` for **Netlify
  Forms**. Detection relies on the hidden static `<form name="comms"
  data-netlify="true">` in `index.html`. Configure the email notification in the
  Netlify dashboard (Forms → comms). Only works on the deployed site.
- Surveillance feeds: `functions/get-leetcode-stats.js` (no key),
  `get-steam-games.js` (`STEAM_API_KEY`/`STEAM_ID64`), `get-recent-tracks.js`
  (`LASTFM_API_KEY`/`LASTFM_USERNAME`). Served locally by the
  `netlify-functions-dev` plugin in `vite.config.js`.
- Routing: react-router-dom; SPA catch-all in `netlify.toml`.

## Code Patterns & Conventions

- styled-components everywhere; the only CSS file is `src/index.css`.
- Default exports for components; named for hooks/utils. PropTypes on components
  with props. Explicit `.jsx` imports.
- Tests beside source, **happy-dom** (corporate proxy blocks jsdom);
  `src/test/setup.js` shims matchMedia + localStorage.
- JSX text starting with `//` must be `{'// LIKE THIS'}` (else
  `react/jsx-no-comment-textnodes` fails the zero-warnings lint).
- ASCII art `<pre>`/block-glyph art must NOT use VT323 (missing box-drawing
  glyphs) — use the Menlo/Consolas/Courier stack (see MainMenu Banner, the ECG,
  the FIGlet name banner).

## Gotchas & Non-Obvious Details

1. **Boot plays on every full page load**, including deep links. Tests must get
   through login before asserting page content.
2. **EscToMenu reads `window.location.pathname` at event time** (stale-closure
   fix); the command prompt's Esc uses a capture-phase listener + stopPropagation.
   Don't "simplify" either.
3. **Roving tabindex on MainMenu**: arrow selection and DOM focus are the same
   element; highlight comes only from `data-active`.
4. **Image swaps must reserve their box** (fixed aspect-ratio / `object-fit:
   cover`) — a collapsing image clamps page scroll to the top (see PersonnelFile,
   FieldOperations).
5. **Bright images wash out** under the duotone multiply — prefer darker imagery.
6. **GPU renderer strings are truncated** in deviceSpecs — headless browsers
   report huge ANGLE/SwiftShader strings.
7. Netlify functions are CommonJS; env inlined by
   `netlify-plugin-inline-functions-env`.
8. **Vite 8 uses rolldown with a platform-native binary** — the dev server and
   Vitest only run where that binary is installed (e.g. macOS arm64). Lint
   (pure JS) always runs.

## Known dead code (remove with `git rm`)

`functions/get-artist-image.js` is unreferenced — its Deezer lookup was inlined
into `get-lastfm-tops.js` (`deezerArtistImage`). The `nodemailer` dependency in
`package.json` is also unused now that the contact form posts to Netlify Forms;
remove it with `npm uninstall nodemailer`.
