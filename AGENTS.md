# AGENTS.md

## Project Overview

Personal portfolio website built with **React 18 + Vite 4**, deployed on **Netlify**. Single-page app with full-viewport scroll-snap sections, 3D skill icons (Three.js), particle background, Swiper testimonial carousel, and a contact form backed by a Netlify serverless function.

## Essential Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview production build locally
npm run lint       # ESLint (js/jsx, zero warnings policy)
```

## Architecture

### App Structure

```
App.jsx
├── Navbar (fixed top bar, responsive dropdown at <900px)
├── Home          (hero + typing animation)
├── Skills        (3D ball icons + description)
├── Projects      (project cards + description)
├── Testimonials  (Swiper carousel + description)
└── Contact       (form + popup)
└── ParticlesBg   (z-index: -1000 particle layer)
```

All section components (`Home`, `Skills`, `Projects`, `Testimonials`, `Contact`) are full-viewport (`height: calc(100vh - 60px)`) with `scroll-snap-align: center`. The `.app-container` in `App.css` drives the scroll-snap behavior.

### Data Flow

- All content data (technologies, testimonials, projects, socials) lives in `src/constants/index.js` — this is the **single source of truth**.
- No routing library; navigation uses `element.scrollIntoView()` targeting section IDs (`"Home"`, `"Skills"`, `"Projects"`, `"Testimonials"`, `"Contact"`).
- Contact form POSTs to `/.netlify/functions/send-email` via **axios**. The serverless function uses **nodemailer** with Elastic Email SMTP.

### Key Dependencies

| Package | Purpose |
|---|---|
| `styled-components` | All component styling |
| `@react-three/fiber`, `@react-three/drei` | 3D skill icon balls (Canvas, Float, Decal) |
| `swiper` | Testimonial cards carousel (EffectCards + Autoplay) |
| `react-particles`, `tsparticles` | Animated particle background |
| `axios` | HTTP client for contact form |
| `gsap` | **Listed as dependency but unused in source code** |
| `express`, `cors`, `body-parser` | **Listed as dependencies but unused — Netlify functions don't use Express** |

### Netlify Serverless Function

`functions/send-email.js` — CommonJS (`exports.handler`) per Netlify convention. Uses `dotenv/config` for SMTP credentials. Node version pinned to `20.5.1` in `netlify.toml`.

## Code Patterns & Conventions

### Export Style — Inconsistent

Both default and named exports are used with no clear rule:

- **Default exports**: `Home`, `Contact`, `Skills`, `Projects`, `Navbar`, `FormSubmitPopup`, `BallCanvas`, `CanvasLoader`, `VideoBackground`, `Typing`
- **Named exports**: `Testimonials`, `Project`, `Testimonial`, `TestimonialSlideshow`, `ParticlesBg`
- Import accordingly: `import Foo from "./Foo.jsx"` vs `import { Bar } from "./Bar.jsx"`
- When adding a new component, **follow the style used by neighboring/sibling components**.

### Styling

- All styling uses `styled-components`. No CSS modules, no inline styles beyond dynamic values.
- CSS files (`App.css`, `index.css`, `Video.css`, `Typing.css`, `slideshow.css`) exist but are imported traditionally. **Multiple CSS files override `body` — style conflicts are likely**.
- Responsive breakpoints: `@media (max-width: 1200px)` for font scaling, `@media (max-aspect-ratio: 1/1)` for portrait/landscape layout switches.
- Dynamic responsive layouts pass `aspectratio` (lowercase) as a styled-component prop and use `${({aspectratio}) => ...}` template interpolation.

### Responsive Layout Pattern (Duplicated)

Every section component (`Home`, `Skills`, `Projects`, `Testimonials`, `Contact`) duplicates the same pattern:

```jsx
const [aspectRatio, setAspectRatio] = useState(window.innerWidth / window.innerHeight);
const handleResize = () => { setAspectRatio(window.innerWidth / window.innerHeight); };
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

This is copy-pasted 5 times. A custom hook or HOC would reduce duplication.

### PropTypes — Sporadic

Only some components use `prop-types`: `Project`, `FormSubmitPopup`, `Ball`, `BallCanvas`, `Testimonial`. Most components have no prop validation.

### File Extensions

All component imports use explicit `.jsx` extensions (e.g., `import Home from "./components/Home.jsx"`). This is Vite's convention.

### Image/Asset References

All public assets live in `public/img/`. They are referenced as root-relative paths (e.g., `"img/html.png"`) — Vite serves the `public/` directory at `/`.

## Gotchas & Non-Obvious Details

1. **Unused video background**: `index.html` has a `<video>` element with the `<source>` tag **commented out**. The `VideoBg` component in `src/components/Backgrounds/VideoBg.jsx` exists but is **never imported**. The video background feature is effectively dead code.

2. **GSAP and Express are zombie dependencies**: Listed in `package.json` but never imported. Don't add code that depends on them without verifying they're actually needed.

3. **Scroll-snap quirks**: The navbar applies `document.body.style.overflow = 'hidden'` on hover to prevent scroll during dropdown interaction. The `app-container` handles scroll-snap, but individual sections also have `scroll-snap-align: center`. Changing scroll behavior requires touching both `App.css` and per-section styled components.

4. **Casing inconsistency**: State variable is `aspectRatio` (camelCase), but the styled-component prop is `aspectratio` (lowercase). Both refer to the same concept (`width/height`).

5. **FormSubmitPopup prop type mismatch**: `PropTypes.number` is declared but semantically boolean values are passed as `status ? 1 : 0` and `showPopup ? 1 : 0`.

6. **Fonts loaded in `index.html`**: Google Fonts (`PT Sans`, `Merriweather Sans`, `IBM Plex Serif`, `Roboto Serif`) are loaded via `<link>` tags in the HTML, not through CSS `@import` or JS. The `Abyssinica SIL` font used in headings is referenced but **not loaded via link** — it may only render if the user has it installed locally.

7. **ESLint config uses `.cjs`**: The project has `"type": "module"` in `package.json`, so `.eslintrc.cjs` uses the `.cjs` extension to force CommonJS. The lint command targets `.js` and `.jsx` files only.

8. **`Ball.jsx` — missing dependency array in `useEffect`**: The resize listener `useEffect` in `Ball.jsx:19` has **no dependency array**, meaning it runs on every render. This is likely a bug (should be `[]`).

9. **`index.css` sets `background-color: #00154d`** but this is immediately overlaid by the particle background (`z-index: -1000`) and the app container, so it's only visible as a flash before JS loads or if particles fail.

10. **Netlify function uses CJS**: `functions/send-email.js` uses `exports.handler` (CommonJS) — this is the Netlify serverless function convention. The project's `"type": "module"` in `package.json` does NOT apply to files in the `functions/` directory per Netlify's build config.
