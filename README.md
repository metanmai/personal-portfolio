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
- **Theme**: `[PHOSPHOR]` switch at the top right cycles 5 colors
  (green default → amber → ice → white → alert), persisted in localStorage.
  CSS custom properties drive every color.
- **CRT effects** (scanlines, vignette, sweep, flicker) are pure CSS and
  respect `prefers-reduced-motion`.
- **Contact form** posts to the Netlify function `functions/send-email.js`
  (needs `EMAIL_USERNAME`/`EMAIL_PASSWORD` env vars in Netlify).

### Live data

The RECREATION WING pulls two live feeds via Netlify functions, each cached
for 5 minutes (`Cache-Control: public, max-age=300`):

- `functions/get-recent-tracks.js` — Last.fm recent tracks. Requires
  `LASTFM_API_KEY` and `LASTFM_USERNAME`.
- `functions/get-steam-games.js` — Steam recently-played (last 14 days).
  Requires `STEAM_API_KEY` and `STEAM_ID64`.
- `functions/get-leetcode-stats.js` — LeetCode solved counts via GraphQL proxy, no key required (`LEETCODE_USERNAME` env optional override), cached 1h.

If env vars are missing the function returns `500 NOT CONFIGURED`; if the
upstream is unreachable it returns `502 UPSTREAM FAILURE`. The UI degrades
in-fiction to `SIGNAL LOST — <RELAY> UNREACHABLE`. Functions don't run under
`vite dev`, so locally you'll always see the SIGNAL LOST state.

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
