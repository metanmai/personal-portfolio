# TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL

[**Website Link**](https://metanmai.netlify.app)

Personal site of Tanmai Nuthi, built as a Fallout-style CRT terminal. Not a
resume site — a place: the journey, the hobbies, the work (one section), and
a way to reach me. Amber phosphor by default (New Vegas), green toggle.
Fully keyboard-operable, responsive at every display size.

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

- **Login boot** on every visit: uplink + rotating ASCII globe, then a live
  visitor report (public IP via api.ipify.org, region from your timezone,
  browser/CPU/memory/display/GPU from browser APIs), then it **holds** at
  `IDENTIFY USER:` until any key/tap logs you in as GUEST. User-paced — no
  skip, no timeout.
- **Paged terminal screens** — the numbered menu IS the navigation. Real URLs:
  `/personnel` (the journey), `/career` (all work: experience, projects,
  testimonials, resume), `/recreation` (games, music, photography, side
  quests), `/comms` (contact). Unknown routes → `404: FILE CORRUPTED`.
- **Keyboard**: number keys or ↑/↓ + Enter on the menu, `Esc` back to menu,
  Tab reaches everything (roving tabindex on the menu).
- **Theme**: `[PHOSPHOR: AMBER/GREEN]` toggle in the bottom status bar,
  persisted in localStorage. CSS custom properties drive every color.
- **CRT effects** (scanlines, vignette, sweep, flicker) are pure CSS and
  respect `prefers-reduced-motion`.
- **Contact form** posts to the Netlify function `functions/send-email.js`
  (needs `EMAIL_USERNAME`/`EMAIL_PASSWORD` env vars in Netlify).

## Content lives in one place

All copy and data: `src/constants/index.js`.

### PLACEHOLDERS the owner must update

- `journey` — the life timeline (entries marked `UPDATE ME`)
- `recreation` — now playing / all-timer games, music rotation, photography
  blurb + real photos (drop them in `public/img/`, darker shots look best
  under the phosphor tint), side quests
- `personal.bio`, `experience` — bio and work history
- Projects are still the college-era four
- Drop `resume.pdf` into `public/` for the `EXPORT DOSSIER` link

## Planned (not built)

Phase 2: command prompt, hacking minigame + hidden VAULT screen, sound
design, SYSTEM MONITOR (live GitHub/LeetCode), HOLOTAPE LOGS.
Phase 3: guestbook.
Spec + amendments: `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`.
