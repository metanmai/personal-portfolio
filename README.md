# TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL

[**Website Link**](https://metanmai.netlify.app)

Personal portfolio of Tanmai Nuthi, rebuilt as a Fallout-style CRT terminal.
Amber phosphor by default (New Vegas), green toggle (Fallout 3/4), fully
keyboard-operable, responsive at every display size.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # ESLint, zero-warnings policy
npm test           # Vitest (happy-dom)
npm run test:watch # Vitest watch mode
```

## How it works

- **Paged terminal screens** — the numbered main menu IS the navigation.
  Each screen has a real URL (React Router): `/personnel`, `/archives`,
  `/commendations`, `/comms`, `/calibration`. Unknown routes render an
  in-fiction `404: FILE CORRUPTED` screen.
- **Boot sequence** plays once per browser session (sessionStorage gate),
  skippable with any key or tap.
- **Keyboard**: number keys or ↑/↓ + Enter on the menu, `Esc` returns to
  the menu, Tab reaches everything.
- **Theming**: `src/theme.js` palettes are applied as CSS custom properties
  on `<html>`; styled-components consume `var(--phosphor)` etc. The
  CALIBRATION screen toggles phosphor color and scanline intensity,
  persisted in localStorage.
- **CRT effects** (scanlines, vignette, sweep, power-on flicker) are pure
  CSS in `src/components/Terminal/Terminal.jsx` and respect
  `prefers-reduced-motion`.
- **Contact form** posts to the Netlify function `functions/send-email.js`
  (ElasticEmail SMTP; needs `EMAIL_USERNAME`/`EMAIL_PASSWORD` env vars in
  Netlify).

## Content lives in one place

All copy and data: `src/constants/index.js` — bio, experience timeline,
skills, projects, testimonials, socials, boot lines, menu items.

### PLACEHOLDERS the owner must update

- `personal.bio` and the `experience` array are marked `PLACEHOLDER` /
  `UPDATE ME` — fill in the current role and history.
- Projects are still the college-era four; refresh when ready (darker
  screenshots look best under the phosphor tint).
- Drop `resume.pdf` into `public/` to make the `EXPORT DOSSIER` link work.

## Phase 2/3 (planned, not built)

Command prompt, hacking minigame + hidden VAULT screen, sound design,
SYSTEM MONITOR (live GitHub/LeetCode), HOLOTAPE LOGS, guestbook.
Spec: `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`.
