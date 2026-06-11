# TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL

[**Live site →**](https://metanmai.com)

The personal site of Tanmai Niranjan, built as a Fallout-style CRT terminal.
It's deliberately not a plain résumé — it's a place you *operate*: boot in,
work the numbered menu, bypass a security gate, and read the dossier on the
"subject." React 18 + Vite, deployed on Netlify. Fully keyboard-operable and
responsive at every size; honors `prefers-reduced-motion` throughout.

## Commands

```bash
npm run dev         # Vite dev server (also serves the Netlify functions locally)
npm run build       # production build → dist/
npm run preview     # preview the production build
npm run lint        # ESLint (zero-warnings policy)
npm test            # Vitest (happy-dom)
npm run test:watch  # Vitest watch mode
```

## How it works

- **Boot + login on every visit.** A login screen (rotating ASCII globe,
  `OPERATOR NAME`, and a small security challenge) gates entry. Solving it plays
  an unlock animation, then a ~4s boot with a live visitor report (public IP via
  `api.ipify.org`, region from your timezone, browser/CPU/memory/display/GPU
  from browser APIs) before landing on the main menu.
- **Numbered menu = navigation.** Each screen is a real route. Number keys or
  `↑/↓ + Enter` select; `Esc` returns to the menu; `Ctrl+K` (or typing `>`)
  opens a command prompt (`help`, `open <screen>`, `theme`, `sound`, `whoami`,
  `hack`, `logout`, …). Unknown routes render `404: FILE CORRUPTED`.

  | # | Screen | Route | What's there |
  |---|--------|-------|--------------|
  | 01 | CAREER DOSSIER | `/career` | Service record (experience), current loadout (skills), field commendations (testimonials), résumé link |
  | 02 | FIELD OPERATIONS | `/projects` | Project card grid — CRT thumbnails, tech tags, source links |
  | 03 | PERSONNEL FILE | `/personnel` | Locked: a Fallout-style hack ("ICE BREACH") gates a life-timeline of photo "captures" |
  | 04 | SUBJECT SURVEILLANCE | `/monitor` | Live vitals/ECG, last-known position, GitHub + LeetCode telemetry, intercepted game + music feeds |
  | 05 | OPEN COMMS CHANNEL | `/comms` | Contact form (Netlify Forms) |

- **Theme:** the `[PHOSPHOR]` switch cycles phosphor colors (amber / green / ice
  / white / alert), persisted in `localStorage`; CSS custom properties
  (`--phosphor`, `--dim`, `--bg`, `--glow`) drive every color.
- **Sound:** WebAudio keystroke/blip SFX, toggled via `[♪]` or the `sound`
  command (persisted).
- **CRT effects** (scanlines, vignette, sweep, occasional glitch) are pure CSS.

## Content lives in one place

All copy and data is in **`src/constants/index.js`** — `personal`, `experience`,
`skills`, `projects`, `testimonials`, `journey` (the personnel timeline),
`recreation`, `surveillance`, `fallback`, `socials`, `menuItems`, `commands`,
`hackGame`, `monitor`, `asciiBanner`, `diagnostics`.

### Assets to add (in `public/`)

- `img/timeline-1.png … timeline-5.png` — the five Personnel File "captures"
  (each falls back to `personal.portrait` until added). Darker images read best
  under the phosphor duotone.
- Project thumbnails referenced by `projects[].thumbnail`.
- `resume.pdf` for the Career Dossier résumé link.

## Live data (Netlify functions)

The Subject Surveillance screen pulls live feeds. GitHub contributions are
fetched directly in the browser; the rest go through serverless functions:

| Function | Source | Env required | Cache |
|----------|--------|--------------|-------|
| `get-leetcode-stats.js` | LeetCode GraphQL | none (`LEETCODE_USERNAME` optional) | 1h |
| `get-steam-games.js` | Steam recently-played | `STEAM_API_KEY`, `STEAM_ID64` | 5m |
| `get-recent-tracks.js` | Last.fm recent tracks | `LASTFM_API_KEY`, `LASTFM_USERNAME` | 5m |

Missing env → `500 NOT CONFIGURED`; unreachable upstream → `502 UPSTREAM
FAILURE`. The UI degrades in-fiction (`RELAY OFFLINE · LAST KNOWN READOUT`) using
the `fallback` data in constants. `vite dev` serves these functions locally via
a small plugin in `vite.config.js`, so they work in development too.

## Contact form (Netlify Forms)

The form posts to **Netlify Forms** — no API keys, no SMTP. A hidden static
`<form name="comms" data-netlify="true">` in `index.html` lets Netlify detect
the form at build time; the React form posts URL-encoded data (with
`form-name: comms`) to `/`.

To receive submissions: deploy, then in the Netlify dashboard go to
**Forms → comms → form notifications** and add an email notification to your
inbox. Note: Netlify Forms only works on the deployed site, not under
`vite dev`.

## Deploy

Netlify, configured by `netlify.toml` (functions dir, SPA catch-all redirect).
Set the function env vars above in **Site settings → Environment variables**.

## Architecture notes

See [`AGENTS.md`](./AGENTS.md) for the component map, boot-sequence contract,
hooks, and non-obvious gotchas.
