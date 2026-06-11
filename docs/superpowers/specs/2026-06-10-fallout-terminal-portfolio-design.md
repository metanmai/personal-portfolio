# Design: "TANMAI INDUSTRIES TERMLINK" — Fallout-Terminal Portfolio Revamp

**Date:** 2026-06-10
**Status:** Approved by Tanmai (pending written-spec review)

## 1. Goal & Concept

Complete overhaul of the personal portfolio (Vite + React, Netlify). Primary job: **personal brand / showcase** — a creative statement demonstrating engineering and design taste.

The site is a **Fallout-style CRT terminal** (Fallout: New Vegas amber phosphor by default, Fallout 3/4 green as a toggle). Visitors operate it like a real RobCo-style terminal: boot sequence → numbered main menu → paged screens. The fiction is consistent everywhere: section names, error states, form feedback, and settings are all in-universe.

Explicitly **cut** from earlier ideation: parallax, liquid glass, particles — off-theme for a terminal.

## 2. Decisions Log

| Decision | Choice |
|---|---|
| Purpose | Showcase / personal brand |
| Visual direction | CRT phosphor / Fallout terminal |
| Default palette | Amber (New Vegas), green toggle, persisted in localStorage |
| Navigation | Paged terminal screens — menu IS the navigation; no long scroll |
| Entry | Full boot sequence on first visit per session (sessionStorage), skippable; quick flicker afterwards |
| Keyboard | Site fully operable by keyboard alone |
| Mobile | Same fiction, touch-adapted; responsive at every display size |
| Stack | Approach 1: keep Vite + React + Netlify; strip heavy deps |
| Styling | Keep styled-components (user familiarity); theming via CSS custom properties |
| Code structure | Mirror existing conventions: `src/components/`, all content in `src/constants/index.js`, PropTypes |

## 3. Architecture

```
src/
├── App.jsx                  — top level: boot state, current screen, routing
├── constants/index.js       — ALL content: bio, experience, skills, projects,
│                              testimonials, holotape entries, boot lines,
│                              command definitions, hack-game word lists
├── theme.js                 — amber/green palettes as CSS custom properties
├── hooks/                   — useTypewriter, useKeyboardNav, useSound
└── components/
    ├── Terminal/            — CRT shell: scanlines, vignette, sweep, flicker
    ├── BootSequence/        — POST-style boot text, skippable
    ├── MainMenu/            — numbered menu ("home")
    ├── screens/
    │   ├── PersonnelFile    — about + experience timeline + skills readout
    │   ├── ProjectArchives  — projects as expandable declassified file entries
    │   ├── Commendations    — testimonials as recovered logs
    │   ├── SystemMonitor    — live GitHub/LeetCode stats dashboard
    │   ├── HolotapeLogs     — blog/notes entries styled as log transcripts
    │   ├── Guestbook        — visitor registry (Phase 3)
    │   ├── OpenComms        — contact form + socials + resume "EXPORT DOSSIER"
    │   └── Calibration      — settings: phosphor, scanline intensity, sound
    ├── CommandPrompt/       — always-available `>` prompt
    └── HackMinigame/        — Fallout word-guess game → hidden VAULT screen
```

Each screen is a single-purpose styled-components React component in the same authoring style as the current codebase.

### Navigation model
- **URL routes** per screen (`/`, `/personnel`, `/archives`, `/comms`, …) — shareable, back-button works. Router: **React Router** (standard, well-documented, handles the 404 route).
- **Keyboard**: number keys / arrows + Enter on menus; `Esc` returns to menu; `?` opens key-help overlay; `>` or `Ctrl+K` focuses command prompt. Real focus management — Tab order always works (accessibility, not just theatrics).
- **Touch/mouse**: menu lines are large tap targets; command prompt opens via a `[CMD]` button on small screens.
- **Transitions**: terminal "redraw" — outgoing screen wipes, incoming renders/types in fast (~300ms), skippable by interacting.

## 4. Theming & CRT Effects

- `theme.js` defines two palettes (amber `#ffb000`, green `#41ff7e`, plus dim/background variants) applied as CSS custom properties on `<html>`. styled-components reference `var(--phosphor)` etc. Toggling swaps one attribute; choice persists in localStorage.
- CRT layer in `Terminal/`: scanlines, vignette, slow sweep, subtle flicker — pure CSS. Intensity adjustable in CALIBRATION (off / low / full).
- `prefers-reduced-motion`: effects minimize, typewriter text renders instantly.

## 5. Content & Data

- `src/constants/index.js` remains the single content source. New shape adds: experience timeline, holotape entries, boot lines, command definitions, hack-game words.
- **Content debt:** current data is college-era (4 old projects, internship testimonials). User must supply updated bio, current role, and last-3-years projects; until then the structure ships with existing data clearly marked as placeholder.
- Resume PDF in `public/`, linked as `EXPORT DOSSIER`.

## 6. Feature Specs

### Boot sequence
POST-style self-test lines (~2–3s), then menu renders. Plays only on first visit per session (sessionStorage); afterwards a 200–400ms CRT power-on flicker. Always skippable via click/keypress.

### Command prompt
Commands defined as data in constants: `help`, `ls`, `open <screen>`, `theme`, `whoami`, `clear`, plus jokes (`sudo`, `exit`, `rm -rf /` → `PERMISSION DENIED: NICE TRY`). Unknown input gets fuzzy "did you mean". One handler powers desktop keyboard and mobile `[CMD]`.

### Hack minigame
Faithful Fallout mechanic: grid of garbage characters + candidate words, 4 attempts, likeness feedback on wrong guesses. Entry points: hidden menu item `[##] ◼◼REDACTED◼◼` and `hack` command. Winning unlocks a hidden VAULT screen rendering `vaultEntries` from constants (off-resume facts/playlist; ships with placeholder entries until the user supplies content). Pure frontend.

### System Monitor
- GitHub stats: public REST API, client-side.
- LeetCode stats: Netlify function proxying LeetCode GraphQL, cached ~1h.
- Static flavor: "uptime since 2002", local time at user's location.
- Any fetch failure renders an in-fiction `SIGNAL LOST — RETRY` panel.

### Guestbook (Phase 3)
Netlify function + Netlify Blobs storage. Submissions pass honeypot + rate limit + length cap, then hold for owner approval (simple admin-token flow) before display. Fallback if moderation proves annoying: read-only registry seeded from GitHub activity.

### Sound
`useSound` hook on WebAudio with synthesized clicks/hum (no audio assets). **Off by default**; toggle in CALIBRATION + status-bar `[♪]` indicator; persisted.

### Contact form
Reuses existing `functions/send-email.js` (ElasticEmail SMTP), restyled as "TRANSMIT MESSAGE". Result rendered as terminal output: `TRANSMISSION SENT ✓` / `RELAY FAILURE — RETRY`.

### Images & media
- In-fiction rendering by default: images (project screenshots, photo) are tinted to the active phosphor via CSS filters (grayscale → hue tint, contrast crush) with a scanline overlay — they re-tint live on theme toggle. No pre-edited assets.
- Load reveal: interlaced "DECRYPTING IMAGE..." wipe (horizontal bands) instead of browser pop-in.
- `[VIEW RAW]` action on every image: opens the full-color original in a lightbox framed as "output to external display" — the work is still viewable un-tinted.
- Formats: WebP with width-based `srcset`, lazy-loaded per screen.

### Animation approach
- No animation library. CSS keyframes/transitions plus two hooks: `useTypewriter` (rAF-driven text) and the screen-redraw transition. CRT sweep/flicker/cursor-blink are pure CSS; staggered line render-in via CSS animation delays; hack-minigame grid scramble is React state + rAF.
- Everything respects `prefers-reduced-motion` and CALIBRATION intensity settings.

### SEO & meta
Prerendered per-route meta (title, description, OG tags, OG image styled as a terminal screenshot) at build time. Replaces current bare `<title>metanmai</title>`.

## 7. Removals

- Dependencies: `@react-three/drei`, `@react-three/fiber`, `react-particles`, `tsparticles`, `swiper`, `react-scroll`, `gsap` (was never used), `styled-components` stays. Server-only deps (`express`, `nodemailer`, `body-parser`, `cors`, `nodemon`, `dotenv`) move out of frontend `dependencies` (nodemailer stays available to Netlify functions).
- Components: `Balls/`, `Backgrounds/` (Particles, Video), `TypingAnimation/` (replaced by `useTypewriter`), `TestimonialSlider/`.
- Assets: `public/img/blue-blur.mp4` (12 MB, unused).
- Misc: console.logs, commented-out code, dead `<video>` tag in index.html.

## 8. Error Handling

- Unknown route → in-fiction `404: FILE CORRUPTED` screen with link back to menu.
- API failures → themed degraded panels (`SIGNAL LOST`), never broken UI.
- React error boundary around screens → `SYSTEM FAULT — REBOOT TERMINAL` with reload link.

## 9. Testing

- **Vitest + React Testing Library** for logic-heavy units: command parser, hack-game rules, keyboard navigation, screen state machine, theme persistence.
- Manual browser verification for visuals/CRT effects at desktop, tablet, and phone widths (dev server + real interaction).
- Accessibility pass: keyboard-only walkthrough, focus order, reduced-motion behavior.

## 10. Build Order

1. **Phase 1 — Core shell (launchable):** Terminal chrome, boot sequence, main menu, routing, keyboard nav, theming + Calibration, PersonnelFile, ProjectArchives, Commendations, OpenComms, content migration, dependency purge, SEO meta.
2. **Phase 2 — Delight:** CommandPrompt, HackMinigame, sound design, SystemMonitor, HolotapeLogs, transition polish.
3. **Phase 3 — Guestbook:** backend, moderation flow, screen.

Each phase ends in a deployable site.

---

## Amendment Log

**2026-06-10 (post-launch owner feedback, round 1):** Boot plays every visit (faster, skippable). ASCII banner hero, SYSTEM STATUS panel, persistent bottom status bar, route redraw transitions, scramble-decode headings, ambient flicker.

**2026-06-10 (round 2):** Readability bump; socials in status bar; roving-tabindex menu focus (single highlight); larger project imagery; real device specs in boot; expanded Calibration.

**2026-06-10 (round 3 — supersedes parts of rounds 1–2 and the original spec):**
- **Calibration screen REMOVED** ("settings are pointless") — only control is a phosphor toggle in the status bar; settings persist `{ theme }` only.
- **Boot v2:** login fiction replaces timed boot — uplink stage with rotating ASCII globe + live IP fetch (api.ipify.org), visitor report (region/browser/device), then HOLDS at `IDENTIFY USER:` until keypress (no skip, no timeout, plays every visit).
- **IA restructure ("not a resume website"):** menu is now [01] PERSONNEL FILE (life journey), [02] CAREER DOSSIER (ALL work merged: experience + projects + testimonials + resume), [03] RECREATION WING (games/music/photography/side quests), [04] OPEN COMMS. ProjectArchives, Commendations, Calibration screens removed/merged accordingly.
