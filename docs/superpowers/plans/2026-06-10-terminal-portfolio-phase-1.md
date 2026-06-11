# Fallout-Terminal Portfolio — Phase 1 (Core Shell) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current portfolio with a launchable Fallout-style CRT terminal: boot sequence, paged menu navigation, amber/green theming, four content screens + calibration, full keyboard operability.

**Architecture:** Vite + React 18 SPA on Netlify. React Router gives each screen a URL. A `SettingsProvider` (localStorage) drives CSS custom properties for theming; all chrome (scanlines/vignette/flicker) is pure CSS inside a `Terminal` shell component. All content lives in `src/constants/index.js`. styled-components everywhere, matching existing code style.

**Tech Stack:** React 18, react-router-dom, styled-components, Vitest + React Testing Library, Netlify Functions (existing `send-email`).

**Spec:** `docs/superpowers/specs/2026-06-10-fallout-terminal-portfolio-design.md`

**Conventions for every task:** PropTypes on components with props. Run commands from repo root. Dev server: `npm run dev`. Tests: `npx vitest run`.

---

## File Structure (end state of Phase 1)

```
index.html                      — rewritten head (VT323 font, SEO/OG meta), no video div
netlify.toml                    — + SPA redirect
vite.config.js                  — + vitest config
package.json                    — purged deps, new dev deps
src/
├── main.jsx                    — unchanged
├── index.css                   — rewritten: reset, themed scrollbar/selection/focus
├── App.jsx                     — rewritten: providers, boot gate, routes, Esc handler
├── theme.js                    — palettes + applyTheme()           [unit tested]
├── settings.jsx                — SettingsProvider + useSettings    [unit tested]
├── constants/index.js          — restructured content
├── test/setup.js               — jest-dom + matchMedia mock
├── hooks/
│   ├── useTypewriter.js        — rAF typewriter                    [unit tested]
│   └── usePageMeta.js          — document.title + meta description
└── components/
    ├── Terminal/Terminal.jsx   — CRT shell + overlays + power-on flicker
    ├── BootSequence/BootSequence.jsx
    ├── MainMenu/MainMenu.jsx   — numbered menu + keyboard nav      [unit tested]
    ├── SystemFault.jsx         — error boundary
    ├── PhosphorImage/PhosphorImage.jsx — duotone img + VIEW RAW lightbox
    └── screens/
        ├── ScreenFrame.jsx     — shared header/back-link wrapper
        ├── PersonnelFile.jsx
        ├── ProjectArchives.jsx
        ├── Commendations.jsx
        ├── OpenComms.jsx       — contact form                      [unit tested]
        ├── Calibration.jsx
        └── FileCorrupted.jsx   — 404
DELETED: src/components/{Home,Skills,Projects,Project,Contact,Testimonials,Navbar,FormSubmitPopup}.jsx,
         src/components/{Balls,Backgrounds,TypingAnimation,TestimonialSlider}/, src/App.css,
         public/img/blue-blur.mp4
```

---

### Task 1: Purge dependencies, dead code, and scaffold testing

**Files:**
- Modify: `package.json`, `index.html`, `netlify.toml`, `vite.config.js`, `src/App.jsx`
- Create: `src/test/setup.js`
- Delete: old components, `src/App.css`, `public/img/blue-blur.mp4`

- [ ] **Step 1: Remove old deps, add new ones**

```bash
npm uninstall @react-three/drei @react-three/fiber react-particles tsparticles swiper react-scroll gsap axios express body-parser cors nodemon dotenv
npm install react-router-dom
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Note: `nodemailer` stays in `dependencies` — `functions/send-email.js` needs it at deploy time.

- [ ] **Step 2: Delete dead files**

```bash
git rm -r src/components/Balls src/components/Backgrounds src/components/TypingAnimation src/components/TestimonialSlider
git rm src/components/Home.jsx src/components/Skills.jsx src/components/Projects.jsx src/components/Project.jsx src/components/Contact.jsx src/components/Testimonials.jsx src/components/Navbar.jsx src/components/FormSubmitPopup.jsx src/App.css
git rm public/img/blue-blur.mp4
```

(If any of those filenames differ slightly, `ls src/components` first and adjust.)

- [ ] **Step 3: Rewrite `index.html`** (full replacement)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TANMAI NIRANJAN — TERMLINK</title>
    <meta name="description" content="Tanmai Niranjan — software engineer. Operate the terminal to browse projects, experience, and comms." />
    <meta property="og:title" content="TANMAI NIRANJAN — TERMLINK" />
    <meta property="og:description" content="A Fallout-style terminal portfolio. Boot it up." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/img/og-terminal.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="img/metanmai-favicon.svg" type="image/x-icon" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

(`/img/og-terminal.png` is produced in Task 16.)

- [ ] **Step 4: Replace `src/App.jsx` with a minimal booting placeholder** so the build stays green:

```jsx
function App() {
    return <div>TERMLINK ONLINE</div>;
}

export default App;
```

- [ ] **Step 5: Add SPA redirect to `netlify.toml`** (append at end)

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

- [ ] **Step 6: Add vitest config to `vite.config.js`** (full replacement)

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: './src/test/setup.js',
    },
});
```

- [ ] **Step 7: Create `src/test/setup.js`**

```js
import '@testing-library/jest-dom';

// jsdom has no matchMedia; components query prefers-reduced-motion
window.matchMedia = window.matchMedia || ((query) => ({
    matches: false,
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
}));
```

- [ ] **Step 8: Verify build and dev server**

Run: `npm run build`
Expected: builds with no errors. Then `npm run dev`, open the URL, see "TERMLINK ONLINE".

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore: purge legacy deps/components, scaffold vitest, SPA redirect"
```

---

### Task 2: Theme palettes + settings provider

**Files:**
- Create: `src/theme.js`, `src/settings.jsx`
- Test: `src/theme.test.js`, `src/settings.test.jsx`

- [ ] **Step 1: Write failing tests `src/theme.test.js`**

```js
import { describe, it, expect } from 'vitest';
import { THEMES, DEFAULT_THEME, applyTheme } from './theme.js';

describe('applyTheme', () => {
    it('sets CSS custom properties for the amber theme', () => {
        applyTheme('amber');
        const root = document.documentElement;
        expect(root.style.getPropertyValue('--phosphor')).toBe(THEMES.amber.phosphor);
        expect(root.style.getPropertyValue('--bg')).toBe(THEMES.amber.bg);
        expect(root.dataset.theme).toBe('amber');
    });

    it('falls back to the default theme for unknown names', () => {
        applyTheme('plasma');
        expect(document.documentElement.style.getPropertyValue('--phosphor'))
            .toBe(THEMES[DEFAULT_THEME].phosphor);
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/theme.test.js`
Expected: FAIL — cannot resolve `./theme.js`

- [ ] **Step 3: Create `src/theme.js`**

```js
export const THEMES = {
    amber: {
        phosphor: '#ffb000',
        dim: '#8a6200',
        bg: '#160f01',
        glow: 'rgba(255, 176, 0, 0.55)',
    },
    green: {
        phosphor: '#41ff7e',
        dim: '#1d8a44',
        bg: '#061206',
        glow: 'rgba(65, 255, 126, 0.55)',
    },
};

export const DEFAULT_THEME = 'amber';

export function applyTheme(name) {
    const theme = THEMES[name] ?? THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    root.style.setProperty('--phosphor', theme.phosphor);
    root.style.setProperty('--dim', theme.dim);
    root.style.setProperty('--bg', theme.bg);
    root.style.setProperty('--glow', theme.glow);
    root.dataset.theme = THEMES[name] ? name : DEFAULT_THEME;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/theme.test.js`
Expected: PASS (2 tests)

- [ ] **Step 5: Write failing tests `src/settings.test.jsx`**

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsProvider, useSettings } from './settings.jsx';

const Probe = () => {
    const { settings, update } = useSettings();
    return (
        <div>
            <span data-testid="theme">{settings.theme}</span>
            <span data-testid="scanlines">{settings.scanlines}</span>
            <button onClick={() => update({ theme: 'green' })}>go green</button>
        </div>
    );
};

describe('SettingsProvider', () => {
    beforeEach(() => localStorage.clear());

    it('defaults to amber theme with full scanlines', () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('amber');
        expect(screen.getByTestId('scanlines')).toHaveTextContent('full');
    });

    it('updates and persists to localStorage', async () => {
        render(<SettingsProvider><Probe /></SettingsProvider>);
        await userEvent.click(screen.getByText('go green'));
        expect(screen.getByTestId('theme')).toHaveTextContent('green');
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('green');
    });

    it('hydrates from localStorage', () => {
        localStorage.setItem('termlink-settings', JSON.stringify({ theme: 'green' }));
        render(<SettingsProvider><Probe /></SettingsProvider>);
        expect(screen.getByTestId('theme')).toHaveTextContent('green');
    });
});
```

- [ ] **Step 6: Run to verify failure**

Run: `npx vitest run src/settings.test.jsx`
Expected: FAIL — cannot resolve `./settings.jsx`

- [ ] **Step 7: Create `src/settings.jsx`**

```jsx
import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { applyTheme, DEFAULT_THEME } from './theme.js';

const STORAGE_KEY = 'termlink-settings';
const DEFAULT_SETTINGS = { theme: DEFAULT_THEME, scanlines: 'full' };

const SettingsContext = createContext(null);

const loadSettings = () => {
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
};

const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applyTheme(settings.theme);
    }, [settings]);

    const update = (patch) => setSettings((prev) => ({ ...prev, ...patch }));

    return (
        <SettingsContext.Provider value={{ settings, update }}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

const useSettings = () => useContext(SettingsContext);

export { SettingsProvider, useSettings };
```

- [ ] **Step 8: Run tests**

Run: `npx vitest run src/settings.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 9: Rewrite `src/index.css`** (full replacement)

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    /* applyTheme() overwrites these; amber defaults prevent a flash */
    --phosphor: #ffb000;
    --dim: #8a6200;
    --bg: #160f01;
    --glow: rgba(255, 176, 0, 0.55);
}

body {
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
}

::selection {
    background: var(--phosphor);
    color: var(--bg);
}

:focus-visible {
    outline: 2px solid var(--phosphor);
    outline-offset: 2px;
}

::-webkit-scrollbar {
    width: 10px;
}

::-webkit-scrollbar-track {
    background: var(--bg);
}

::-webkit-scrollbar-thumb {
    background: var(--dim);
}

a {
    color: var(--phosphor);
}
```

- [ ] **Step 10: Commit**

```bash
git add src/theme.js src/theme.test.js src/settings.jsx src/settings.test.jsx src/index.css
git commit -m "feat: theme palettes, settings provider, themed global styles"
```

---

### Task 3: useTypewriter hook

**Files:**
- Create: `src/hooks/useTypewriter.js`
- Test: `src/hooks/useTypewriter.test.jsx`

- [ ] **Step 1: Write failing test `src/hooks/useTypewriter.test.jsx`**

```jsx
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useTypewriter } from './useTypewriter.js';

afterEach(() => vi.restoreAllMocks());

describe('useTypewriter', () => {
    it('types text progressively and reports done', async () => {
        const { result } = renderHook(() => useTypewriter('ABCDE', 1000));
        await waitFor(() => expect(result.current.done).toBe(true));
        expect(result.current.output).toBe('ABCDE');
    });

    it('skip() reveals the full text immediately', () => {
        const { result } = renderHook(() => useTypewriter('LONG TEXT HERE', 1));
        expect(result.current.done).toBe(false);
        act(() => result.current.skip());
        expect(result.current.output).toBe('LONG TEXT HERE');
        expect(result.current.done).toBe(true);
    });

    it('renders instantly when prefers-reduced-motion', () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({ matches: true });
        const { result } = renderHook(() => useTypewriter('FAST', 1));
        expect(result.current.output).toBe('FAST');
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/hooks/useTypewriter.test.jsx`
Expected: FAIL — cannot resolve `./useTypewriter.js`

- [ ] **Step 3: Create `src/hooks/useTypewriter.js`**

```js
import { useEffect, useRef, useState } from 'react';

const useTypewriter = (text, charsPerSecond = 60) => {
    const [count, setCount] = useState(0);
    const startRef = useRef(null);

    useEffect(() => {
        setCount(0);
        startRef.current = null;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setCount(text.length);
            return undefined;
        }

        let frame;
        const tick = (now) => {
            if (startRef.current === null) startRef.current = now;
            const elapsed = (now - startRef.current) / 1000;
            const next = Math.min(text.length, Math.floor(elapsed * charsPerSecond));
            setCount(next);
            if (next < text.length) frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [text, charsPerSecond]);

    return {
        output: text.slice(0, count),
        done: count >= text.length,
        skip: () => setCount(text.length),
    };
};

export { useTypewriter };
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/hooks/useTypewriter.test.jsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useTypewriter.js src/hooks/useTypewriter.test.jsx
git commit -m "feat: rAF-driven useTypewriter hook with reduced-motion support"
```

---

### Task 4: Restructure constants (content source)

**Files:**
- Modify: `src/constants/index.js` (full replacement)

- [ ] **Step 1: Replace `src/constants/index.js`**

Port the existing `projects`, `testimonials`, and `socials` data verbatim into the new shape. `PLACEHOLDER` markers flag content the owner must update.

```js
const personal = {
    name: 'TANMAI NIRANJAN',
    handle: 'tanmai.n',
    role: 'SOFTWARE ENGINEER',
    established: 2002,
    // PLACEHOLDER — owner must update bio to current role
    bio: 'Software engineer. Builder of systems and interfaces. This dossier is being updated — entries below may reference the college era.',
};

const bootLines = [
    'TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL',
    'COPYRIGHT 2026 TANMAI INDUSTRIES',
    'INITIALIZING BOOT SEQUENCE...',
    'CPU: MOTOROLA 68000 @ 8MHZ ............ OK',
    'MEMORY CHECK: 64K RAM ................. OK',
    'PHOSPHOR CALIBRATION .................. OK',
    'LOADING PERSONNEL DATABASE ............ OK',
    'MOUNTING /dev/career .................. OK',
    'ESTABLISHING UPLINK ................... OK',
    '',
    'WELCOME, VISITOR.',
];

const menuItems = [
    { num: '01', label: 'PERSONNEL FILE', hint: 'about', path: '/personnel' },
    { num: '02', label: 'PROJECT ARCHIVES', hint: 'work', path: '/archives' },
    { num: '03', label: 'FIELD COMMENDATIONS', hint: 'testimonials', path: '/commendations' },
    { num: '04', label: 'OPEN COMMS CHANNEL', hint: 'contact', path: '/comms' },
    { num: '05', label: 'TERMINAL CALIBRATION', hint: 'settings', path: '/calibration' },
];

// PLACEHOLDER — owner must replace with real experience timeline
const experience = [
    {
        period: '2023 — PRESENT',
        title: 'SOFTWARE ENGINEER',
        org: 'UPDATE ME',
        summary: 'Current role — details pending declassification.',
    },
    {
        period: '2019 — 2023',
        title: 'B.TECH, COMPUTER SCIENCE',
        org: 'UPDATE ME (university)',
        summary: 'Built the original version of this terminal, among other things.',
    },
];

const skills = [
    { name: 'python', level: 90 },
    { name: 'react', level: 85 },
    { name: 'c++', level: 80 },
    { name: 'fastapi', level: 80 },
    { name: 'docker', level: 75 },
    { name: 'aws', level: 70 },
    { name: 'tensorflow', level: 65 },
    { name: 'git', level: 90 },
];

const projects = [
    {
        id: 1,
        name: 'BLOCKTOPIA',
        description: 'Dive into a pixelated universe, build, explore, and embark on your own unique adventures in this virtual sandbox.',
        thumbnail: 'img/blocktopia.png',
        link: 'https://github.com/metanmai/blocktopia',
        tech: ['react', 'vite', 'threejs'],
    },
    {
        id: 2,
        name: 'FAKE NEWS DETECTION',
        description: 'Using advanced algorithms and ML techniques, this project helps users distinguish between credible and unreliable information sources.',
        thumbnail: 'img/fake-news-detection.jpeg',
        link: 'https://github.com/metanmai/fake-news-detection',
        tech: ['python', 'tensorflow', 'networkx'],
    },
    {
        id: 3,
        name: 'GRAPH FUNCTIONALITIES',
        description: 'The Graph Functionalities project showcases a collection of custom-built functions for handling and analyzing complex networks.',
        thumbnail: 'img/graph-functionalities.webp',
        link: 'https://github.com/metanmai/Graph_Functionalities',
        tech: ['C++', 'pybind'],
    },
    {
        id: 4,
        name: 'CHATTERBOX',
        description: 'Chatterbox is a versatile blogging platform where users can share their thoughts, stories, and ideas with a global audience.',
        thumbnail: 'img/chatterbox.png',
        link: 'https://github.com/metanmai/chatterbox',
        tech: ['flask', 'bootstrap-css'],
    },
];

const testimonials = [
    {
        text: 'He has a natural talent for breaking down complex topics into easily digestible components, which not only benefits him in his own learning but also makes him an excellent resource for his peers.',
        person: 'Avinash Tiwari',
        company: 'pCloudy',
        role: 'CEO',
    },
    {
        text: "Tanmai's work ethic extends beyond the classroom, as he willingly takes on challenging projects and consistently meets deadlines with high-quality results.",
        person: 'Shibu Prasad Panda',
        company: 'pCloudy',
        role: 'Senior Lead Software Developer',
    },
    {
        text: "Tanmai's commitment to his work is truly impressive, and his ability to tackle challenges with a positive mindset is an asset to any team.",
        person: 'Kofi Opoku',
        company: 'Dosh',
        role: 'Director',
    },
    {
        text: 'Tanmai is not only a dedicated and hardworking student but also a team player who consistently brings a positive attitude to every project.',
        person: 'Vishnu Athreya',
        company: 'OPIN Tech',
        role: 'Head Of Logistics',
    },
];

const socials = [
    { name: 'GITHUB', link: 'https://github.com/metanmai/' },
    { name: 'LINKEDIN', link: 'https://www.linkedin.com/in/tanmai-niranjan-76326b288/' },
    { name: 'LEETCODE', link: 'https://leetcode.com/metanmai/' },
];

export { personal, bootLines, menuItems, experience, skills, projects, testimonials, socials };
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: success (nothing imports the removed `technologies` export anymore after Task 1).

- [ ] **Step 3: Commit**

```bash
git add src/constants/index.js
git commit -m "feat: restructure constants for terminal content model"
```

---

### Task 5: Terminal chrome (CRT shell)

**Files:**
- Create: `src/components/Terminal/Terminal.jsx`

- [ ] **Step 1: Create `src/components/Terminal/Terminal.jsx`**

```jsx
import styled, { css, keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { useSettings } from '../../settings.jsx';

const powerOn = keyframes`
    0% { opacity: 0; }
    10% { opacity: 0.8; }
    20% { opacity: 0.2; }
    40% { opacity: 0.9; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
`;

const sweep = keyframes`
    from { top: -120px; }
    to { top: 110%; }
`;

const Shell = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(17px, 2.2vmin, 22px);
    text-shadow: 0 0 7px var(--glow);
    position: relative;
    padding: clamp(14px, 4vw, 56px);
    animation: ${powerOn} 0.35s ease-out;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 100;
`;

const Scanlines = styled(Overlay)`
    ${({ $intensity }) =>
        $intensity === 'off'
            ? css`display: none;`
            : css`
                background: repeating-linear-gradient(
                    0deg,
                    transparent 0 3px,
                    rgba(0, 0, 0, ${$intensity === 'low' ? 0.12 : 0.25}) 3px 5px
                );
            `}
`;

const Vignette = styled(Overlay)`
    background: radial-gradient(ellipse at center, transparent 45%, rgba(0, 0, 0, 0.55) 100%);
`;

const Sweep = styled(Overlay)`
    inset: auto 0;
    height: 110px;
    background: linear-gradient(to bottom, transparent, var(--glow), transparent);
    opacity: 0.07;
    animation: ${sweep} 8s linear infinite;

    @media (prefers-reduced-motion: reduce) {
        display: none;
    }
`;

const Terminal = ({ children }) => {
    const { settings } = useSettings();

    return (
        <Shell>
            {children}
            <Scanlines $intensity={settings.scanlines} data-testid="scanlines" />
            <Vignette />
            {settings.scanlines !== 'off' && <Sweep />}
        </Shell>
    );
};

Terminal.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Terminal;
```

- [ ] **Step 2: Wire into the placeholder App to eyeball it** — replace `src/App.jsx`:

```jsx
import { SettingsProvider } from './settings.jsx';
import Terminal from './components/Terminal/Terminal.jsx';

function App() {
    return (
        <SettingsProvider>
            <Terminal>
                <h1>TERMLINK ONLINE</h1>
                <p>&gt; SYSTEM NOMINAL█</p>
            </Terminal>
        </SettingsProvider>
    );
}

export default App;
```

- [ ] **Step 3: Verify in browser**

Run: `npm run dev`, open the URL.
Expected: dark amber screen, glowing VT323 text, scanlines, vignette, a slow light sweep, brief power-on flicker on reload.

- [ ] **Step 4: Commit**

```bash
git add src/components/Terminal/Terminal.jsx src/App.jsx
git commit -m "feat: CRT terminal shell with scanlines, vignette, sweep, power-on flicker"
```

---

### Task 6: Routing skeleton + MainMenu with keyboard nav

**Files:**
- Create: `src/components/MainMenu/MainMenu.jsx`, `src/hooks/usePageMeta.js`, `src/components/screens/ScreenFrame.jsx`
- Modify: `src/App.jsx`
- Test: `src/components/MainMenu/MainMenu.test.jsx`

- [ ] **Step 1: Create `src/hooks/usePageMeta.js`**

```js
import { useEffect } from 'react';

const usePageMeta = (title, description) => {
    useEffect(() => {
        document.title = `${title} — TANMAI NIRANJAN TERMLINK`;
        if (description) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute('content', description);
        }
    }, [title, description]);
};

export { usePageMeta };
```

- [ ] **Step 2: Create `src/components/screens/ScreenFrame.jsx`** (shared wrapper every screen uses)

```jsx
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Frame = styled.section`
    max-width: 920px;
    margin: 0 auto;
`;

const Bar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.5rem;
    margin-bottom: 1.5rem;
`;

const Title = styled.h2`
    font-size: clamp(1.4rem, 4vw, 2rem);
    letter-spacing: 0.06em;
`;

const BackLink = styled(Link)`
    color: var(--dim);
    text-decoration: none;
    padding: 0.4rem 0.5rem;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

const ScreenFrame = ({ title, children }) => (
    <Frame>
        <Bar>
            <Title>▸ {title}</Title>
            <BackLink to="/">[ESC] MAIN MENU</BackLink>
        </Bar>
        {children}
    </Frame>
);

ScreenFrame.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default ScreenFrame;
```

- [ ] **Step 3: Write failing test `src/components/MainMenu/MainMenu.test.jsx`**

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainMenu from './MainMenu.jsx';
import { menuItems } from '../../constants/index.js';

const LocationProbe = () => <div data-testid="loc">{useLocation().pathname}</div>;

const renderMenu = () =>
    render(
        <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<MainMenu />} />
                <Route path="*" element={<LocationProbe />} />
            </Routes>
        </MemoryRouter>
    );

describe('MainMenu', () => {
    it('renders every menu item', () => {
        renderMenu();
        menuItems.forEach(({ label }) => {
            expect(screen.getByText(new RegExp(label))).toBeInTheDocument();
        });
    });

    it('navigates when a number key is pressed', async () => {
        renderMenu();
        await userEvent.keyboard('2');
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[1].path);
    });

    it('navigates with arrow keys + Enter', async () => {
        renderMenu();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[2].path);
    });

    it('navigates on click', async () => {
        renderMenu();
        await userEvent.click(screen.getByText(new RegExp(menuItems[3].label)));
        expect(screen.getByTestId('loc')).toHaveTextContent(menuItems[3].path);
    });
});
```

- [ ] **Step 4: Run to verify failure**

Run: `npx vitest run src/components/MainMenu/MainMenu.test.jsx`
Expected: FAIL — cannot resolve `./MainMenu.jsx`

- [ ] **Step 5: Create `src/components/MainMenu/MainMenu.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { menuItems, personal } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Header = styled.header`
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.6rem;
    margin-bottom: 1.6rem;
    color: var(--dim);
    font-size: 0.9em;
`;

const Name = styled.h1`
    font-size: clamp(2.2rem, 8vw, 4rem);
    letter-spacing: 0.04em;
    margin-bottom: 0.2rem;
`;

const Tagline = styled.p`
    color: var(--dim);
    margin-bottom: 2rem;
`;

const Menu = styled.ul`
    list-style: none;
`;

const Row = styled.button`
    display: block;
    width: 100%;
    max-width: 640px;
    min-height: 44px;
    background: none;
    border: none;
    font: inherit;
    color: var(--phosphor);
    text-shadow: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0.4rem 0.6rem;

    &:hover, &:focus-visible, &[data-active='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }
`;

const Hint = styled.span`
    opacity: 0.6;
`;

const Cursor = styled.span`
    animation: blink 1s steps(1) infinite;

    @keyframes blink {
        50% { opacity: 0; }
    }
`;

const MainMenu = () => {
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    usePageMeta('MAIN MENU', 'Operate the terminal: projects, experience, comms.');

    useEffect(() => {
        const onKey = (event) => {
            if (event.target.closest('input, textarea')) return;
            const digit = Number(event.key);
            if (digit >= 1 && digit <= menuItems.length) {
                navigate(menuItems[digit - 1].path);
            } else if (event.key === 'ArrowDown') {
                setSelected((s) => (s + 1) % menuItems.length);
            } else if (event.key === 'ArrowUp') {
                setSelected((s) => (s - 1 + menuItems.length) % menuItems.length);
            } else if (event.key === 'Enter' && event.target.tagName !== 'BUTTON' && event.target.tagName !== 'A') {
                navigate(menuItems[selected].path);
            }
        };

        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, selected]);

    return (
        <main>
            <Header>
                TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL
                <br />
                ENTER PASSWORD NOW — ACCESS GRANTED
            </Header>
            <Name>{personal.name}</Name>
            <Tagline>
                {personal.role} · EST. {personal.established} · STATUS: ONLINE
            </Tagline>
            <Menu>
                {menuItems.map((item, index) => (
                    <li key={item.path}>
                        <Row
                            data-active={index === selected}
                            onMouseEnter={() => setSelected(index)}
                            onClick={() => navigate(item.path)}
                        >
                            &gt; [{item.num}] {item.label} <Hint>...... {item.hint}</Hint>
                        </Row>
                    </li>
                ))}
            </Menu>
            <p style={{ marginTop: '1.5rem' }}>
                &gt; <Cursor>█</Cursor>
            </p>
        </main>
    );
};

export default MainMenu;
```

- [ ] **Step 6: Run tests**

Run: `npx vitest run src/components/MainMenu/MainMenu.test.jsx`
Expected: PASS (4 tests)

- [ ] **Step 7: Rewrite `src/App.jsx` with real routing** (screens arrive in later tasks as stubs-then-real; create the four stub screens in this step so the app compiles)

`src/App.jsx`:

```jsx
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { SettingsProvider } from './settings.jsx';
import Terminal from './components/Terminal/Terminal.jsx';
import MainMenu from './components/MainMenu/MainMenu.jsx';
import PersonnelFile from './components/screens/PersonnelFile.jsx';
import ProjectArchives from './components/screens/ProjectArchives.jsx';
import Commendations from './components/screens/Commendations.jsx';
import OpenComms from './components/screens/OpenComms.jsx';
import Calibration from './components/screens/Calibration.jsx';
import FileCorrupted from './components/screens/FileCorrupted.jsx';
import SystemFault from './components/SystemFault.jsx';

const EscToMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape' && location.pathname !== '/') {
                navigate('/');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, location.pathname]);

    return null;
};

function App() {
    return (
        <SettingsProvider>
            <BrowserRouter>
                <Terminal>
                    <EscToMenu />
                    <SystemFault>
                        <Routes>
                            <Route path="/" element={<MainMenu />} />
                            <Route path="/personnel" element={<PersonnelFile />} />
                            <Route path="/archives" element={<ProjectArchives />} />
                            <Route path="/commendations" element={<Commendations />} />
                            <Route path="/comms" element={<OpenComms />} />
                            <Route path="/calibration" element={<Calibration />} />
                            <Route path="*" element={<FileCorrupted />} />
                        </Routes>
                    </SystemFault>
                </Terminal>
            </BrowserRouter>
        </SettingsProvider>
    );
}

export default App;
```

Stub for each of `PersonnelFile.jsx`, `ProjectArchives.jsx`, `Commendations.jsx`, `OpenComms.jsx`, `Calibration.jsx`, `FileCorrupted.jsx` in `src/components/screens/` (replaced by real screens in Tasks 8–13 — same default-export name as the file):

```jsx
import ScreenFrame from './ScreenFrame.jsx';

const PersonnelFile = () => (
    <ScreenFrame title="PERSONNEL FILE">
        <p>LOADING...</p>
    </ScreenFrame>
);

export default PersonnelFile;
```

And a temporary pass-through `src/components/SystemFault.jsx` (real version in Task 7):

```jsx
import PropTypes from 'prop-types';

const SystemFault = ({ children }) => children;

SystemFault.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SystemFault;
```

- [ ] **Step 8: Verify in browser**

Run: `npm run dev`. Check: menu renders; pressing `2` opens `/archives` stub; `Esc` returns to menu; arrows + Enter work; clicking works; browser back works.

- [ ] **Step 9: Run full test suite and commit**

Run: `npx vitest run`
Expected: all green.

```bash
git add src/App.jsx src/components/MainMenu src/components/screens src/components/SystemFault.jsx src/hooks/usePageMeta.js
git commit -m "feat: routed terminal app with keyboard-navigable main menu"
```

---

### Task 7: 404 screen + error boundary

**Files:**
- Modify: `src/components/screens/FileCorrupted.jsx`, `src/components/SystemFault.jsx`

- [ ] **Step 1: Replace `src/components/screens/FileCorrupted.jsx`**

```jsx
import { Link } from 'react-router-dom';
import ScreenFrame from './ScreenFrame.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const FileCorrupted = () => {
    usePageMeta('404 — FILE CORRUPTED');

    return (
        <ScreenFrame title="ERROR 404">
            <pre>{`
!!! FILE CORRUPTED !!!

THE REQUESTED RECORD COULD NOT BE RECOVERED.
DATA INTEGRITY CHECK ............ FAILED
SECTOR SCAN ..................... NO CARRIER
            `}</pre>
            <p>
                &gt; <Link to="/">RETURN TO MAIN MENU</Link>
            </p>
        </ScreenFrame>
    );
};

export default FileCorrupted;
```

- [ ] **Step 2: Replace `src/components/SystemFault.jsx`** with a real error boundary

```jsx
import { Component } from 'react';
import PropTypes from 'prop-types';

class SystemFault extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <section>
                    <h2>!!! SYSTEM FAULT !!!</h2>
                    <p>AN UNRECOVERABLE EXCEPTION HALTED THIS TERMINAL.</p>
                    <p>
                        &gt; <a href="/">REBOOT TERMINAL</a>
                    </p>
                </section>
            );
        }
        return this.props.children;
    }
}

SystemFault.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SystemFault;
```

- [ ] **Step 3: Verify in browser**

Visit `http://localhost:5173/does-not-exist` → FILE CORRUPTED screen; link returns to menu.

- [ ] **Step 4: Commit**

```bash
git add src/components/screens/FileCorrupted.jsx src/components/SystemFault.jsx
git commit -m "feat: in-fiction 404 screen and SYSTEM FAULT error boundary"
```

---

### Task 8: Boot sequence

**Files:**
- Create: `src/components/BootSequence/BootSequence.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create `src/components/BootSequence/BootSequence.jsx`**

```jsx
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { bootLines } from '../../constants/index.js';

const Screen = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(15px, 2.2vmin, 20px);
    text-shadow: 0 0 7px var(--glow);
    padding: clamp(14px, 4vw, 56px);
    cursor: pointer;
`;

const Line = styled.p`
    white-space: pre-wrap;
    min-height: 1em;
`;

const SkipHint = styled.p`
    color: var(--dim);
    margin-top: 2rem;
`;

const BootSequence = ({ onDone }) => {
    const [lineCount, setLineCount] = useState(0);
    const doneRef = useRef(false);

    const finish = () => {
        if (!doneRef.current) {
            doneRef.current = true;
            onDone();
        }
    };

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setLineCount(bootLines.length);
            const t = setTimeout(finish, 400);
            return () => clearTimeout(t);
        }
        const id = setInterval(() => {
            setLineCount((n) => (n >= bootLines.length ? n : n + 1));
        }, 180);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lineCount >= bootLines.length) {
            const t = setTimeout(finish, 700);
            return () => clearTimeout(t);
        }
        return undefined;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lineCount]);

    useEffect(() => {
        const onKey = () => finish();
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Screen onClick={finish} role="status" aria-label="Terminal booting — press any key to skip">
            {bootLines.slice(0, lineCount).map((line, i) => (
                <Line key={i}>{line || ' '}</Line>
            ))}
            <Line>█</Line>
            <SkipHint>[ PRESS ANY KEY OR TAP TO SKIP ]</SkipHint>
        </Screen>
    );
};

BootSequence.propTypes = {
    onDone: PropTypes.func.isRequired,
};

export default BootSequence;
```

- [ ] **Step 2: Gate the app behind boot in `src/App.jsx`** — add to imports:

```jsx
import { useEffect, useState } from 'react';
import BootSequence from './components/BootSequence/BootSequence.jsx';
```

Replace the `App` function body:

```jsx
function App() {
    const [booted, setBooted] = useState(
        () => sessionStorage.getItem('termlink-booted') === 'true'
    );

    const handleBootDone = () => {
        sessionStorage.setItem('termlink-booted', 'true');
        setBooted(true);
    };

    return (
        <SettingsProvider>
            {!booted ? (
                <BootSequence onDone={handleBootDone} />
            ) : (
                <BrowserRouter>
                    <Terminal>
                        <EscToMenu />
                        <SystemFault>
                            <Routes>
                                <Route path="/" element={<MainMenu />} />
                                <Route path="/personnel" element={<PersonnelFile />} />
                                <Route path="/archives" element={<ProjectArchives />} />
                                <Route path="/commendations" element={<Commendations />} />
                                <Route path="/comms" element={<OpenComms />} />
                                <Route path="/calibration" element={<Calibration />} />
                                <Route path="*" element={<FileCorrupted />} />
                            </Routes>
                        </SystemFault>
                    </Terminal>
                </BrowserRouter>
            )}
        </SettingsProvider>
    );
}
```

- [ ] **Step 3: Verify in browser**

Hard-refresh in a fresh tab: boot lines type in; any key/tap skips; menu appears (with the Terminal power-on flicker); refreshing again skips boot (sessionStorage). Clear sessionStorage to re-test.

- [ ] **Step 4: Run suite and commit**

Run: `npx vitest run` — all green.

```bash
git add src/components/BootSequence src/App.jsx
git commit -m "feat: skippable boot sequence, once per session"
```

---

### Task 9: PhosphorImage (duotone image + VIEW RAW lightbox)

**Files:**
- Create: `src/components/PhosphorImage/PhosphorImage.jsx`

- [ ] **Step 1: Create `src/components/PhosphorImage/PhosphorImage.jsx`**

```jsx
import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const decrypt = keyframes`
    from { clip-path: inset(0 0 100% 0); }
    to { clip-path: inset(0 0 0% 0); }
`;

const Wrap = styled.figure`
    position: relative;
    background-color: var(--phosphor);
    max-width: 480px;
`;

const Img = styled.img`
    display: block;
    width: 100%;
    filter: grayscale(1) contrast(1.1);
    mix-blend-mode: multiply;
    animation: ${decrypt} 0.5s steps(10);

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Lines = styled.div`
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 2px, rgba(0, 0, 0, 0.25) 2px 4px);
    pointer-events: none;
`;

const RawButton = styled.button`
    position: absolute;
    bottom: 8px;
    right: 8px;
    font: inherit;
    font-size: 0.8em;
    background: var(--bg);
    color: var(--phosphor);
    border: 1px solid var(--dim);
    padding: 0.2rem 0.6rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
    }
`;

const Lightbox = styled.div`
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    cursor: pointer;

    img {
        max-width: 92vw;
        max-height: 82vh;
    }
`;

const PhosphorImage = ({ src, alt }) => {
    const [raw, setRaw] = useState(false);

    useEffect(() => {
        if (!raw) return undefined;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                setRaw(false);
            }
        };
        // capture phase so the app-level Esc handler doesn't also fire
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [raw]);

    return (
        <Wrap>
            <Img src={src} alt={alt} loading="lazy" />
            <Lines />
            <RawButton onClick={() => setRaw(true)}>[VIEW RAW]</RawButton>
            {raw && (
                <Lightbox onClick={() => setRaw(false)} role="dialog" aria-label={`${alt} — original image`}>
                    <p>OUTPUT TO EXTERNAL DISPLAY — CLICK OR [ESC] TO CLOSE</p>
                    <img src={src} alt={alt} />
                </Lightbox>
            )}
        </Wrap>
    );
};

PhosphorImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
};

export default PhosphorImage;
```

- [ ] **Step 2: Commit** (verified visually in Task 11 when ProjectArchives uses it)

```bash
git add src/components/PhosphorImage
git commit -m "feat: phosphor-tinted image with decrypt reveal and VIEW RAW lightbox"
```

---

### Task 10: PersonnelFile screen

**Files:**
- Modify: `src/components/screens/PersonnelFile.jsx` (replace stub)

- [ ] **Step 1: Replace `src/components/screens/PersonnelFile.jsx`**

```jsx
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { personal, experience, skills } from '../../constants/index.js';
import { useTypewriter } from '../../hooks/useTypewriter.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const SectionTitle = styled.h3`
    color: var(--dim);
    margin: 1.6rem 0 0.6rem;
    letter-spacing: 0.1em;
`;

const Bio = styled.p`
    max-width: 70ch;
    min-height: 3em;
`;

const Entry = styled.div`
    border-left: 2px solid var(--dim);
    padding-left: 1rem;
    margin-bottom: 1rem;
`;

const Period = styled.p`
    color: var(--dim);
`;

const SkillRow = styled.p`
    display: flex;
    gap: 1rem;
    max-width: 420px;
    justify-content: space-between;
`;

const renderBar = (level) => {
    const filled = Math.round(level / 10);
    return '▮'.repeat(filled) + '░'.repeat(10 - filled);
};

const PersonnelFile = () => {
    const { output } = useTypewriter(personal.bio, 90);
    usePageMeta('PERSONNEL FILE', 'About Tanmai Niranjan: experience and skills.');

    return (
        <ScreenFrame title="PERSONNEL FILE">
            <SectionTitle>// IDENTIFICATION</SectionTitle>
            <p>NAME: {personal.name} · ROLE: {personal.role} · EST. {personal.established}</p>
            <Bio>{output}█</Bio>

            <SectionTitle>// SERVICE RECORD</SectionTitle>
            {experience.map((job) => (
                <Entry key={job.period}>
                    <Period>{job.period}</Period>
                    <p>{job.title} — {job.org}</p>
                    <p>{job.summary}</p>
                </Entry>
            ))}

            <SectionTitle>// FIELD PROFICIENCIES</SectionTitle>
            {skills.map((skill) => (
                <SkillRow key={skill.name}>
                    <span>{skill.name}</span>
                    <span aria-label={`${skill.level} percent`}>{renderBar(skill.level)} {skill.level}</span>
                </SkillRow>
            ))}
        </ScreenFrame>
    );
};

export default PersonnelFile;
```

- [ ] **Step 2: Verify in browser** — `/personnel`: bio types in, timeline and text-character skill bars render, readable at phone width (DevTools responsive mode).

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/PersonnelFile.jsx
git commit -m "feat: personnel file screen with typed bio, service record, skill readout"
```

---

### Task 11: ProjectArchives screen

**Files:**
- Modify: `src/components/screens/ProjectArchives.jsx` (replace stub)

- [ ] **Step 1: Replace `src/components/screens/ProjectArchives.jsx`**

```jsx
import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import PhosphorImage from '../PhosphorImage/PhosphorImage.jsx';
import { projects } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const FileRow = styled.button`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    width: 100%;
    min-height: 44px;
    background: none;
    border: none;
    border-bottom: 1px dashed var(--dim);
    font: inherit;
    color: var(--phosphor);
    text-shadow: inherit;
    text-align: left;
    cursor: pointer;
    padding: 0.5rem 0.4rem;

    &:hover, &:focus-visible, &[aria-expanded='true'] {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }
`;

const Detail = styled.div`
    display: grid;
    grid-template-columns: minmax(220px, 1fr) 2fr;
    gap: 1.2rem;
    padding: 1rem 0.4rem 1.6rem;

    @media (max-width: 700px) {
        grid-template-columns: 1fr;
    }
`;

const Tech = styled.p`
    color: var(--dim);
    margin-top: 0.6rem;
`;

const ProjectArchives = () => {
    const [openId, setOpenId] = useState(null);
    usePageMeta('PROJECT ARCHIVES', 'Projects by Tanmai Niranjan.');

    return (
        <ScreenFrame title="PROJECT ARCHIVES">
            <p style={{ color: 'var(--dim)', marginBottom: '1rem' }}>
                {projects.length} RECORDS RECOVERED. SELECT A FILE TO DECRYPT.
            </p>
            {projects.map((project) => (
                <div key={project.id}>
                    <FileRow
                        aria-expanded={openId === project.id}
                        onClick={() => setOpenId(openId === project.id ? null : project.id)}
                    >
                        <span>&gt; FILE_{String(project.id).padStart(3, '0')}: {project.name}</span>
                        <span>{openId === project.id ? '[CLOSE]' : '[OPEN]'}</span>
                    </FileRow>
                    {openId === project.id && (
                        <Detail>
                            <PhosphorImage src={project.thumbnail} alt={`${project.name} screenshot`} />
                            <div>
                                <p>{project.description}</p>
                                <Tech>STACK: {project.tech.join(' · ')}</Tech>
                                <p style={{ marginTop: '0.6rem' }}>
                                    &gt; <a href={project.link} target="_blank" rel="noreferrer">ACCESS SOURCE [GITHUB]</a>
                                </p>
                            </div>
                        </Detail>
                    )}
                </div>
            ))}
        </ScreenFrame>
    );
};

export default ProjectArchives;
```

- [ ] **Step 2: Verify in browser** — `/archives`: rows expand/collapse, image renders phosphor-tinted with decrypt wipe, `[VIEW RAW]` lightbox opens full-color and closes via click/Esc (Esc must NOT also exit to menu — capture handler in PhosphorImage handles this), all keyboard reachable (Tab + Enter), grid stacks on narrow widths.

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/ProjectArchives.jsx
git commit -m "feat: project archives screen with expandable declassified files"
```

---

### Task 12: Commendations screen

**Files:**
- Modify: `src/components/screens/Commendations.jsx` (replace stub)

- [ ] **Step 1: Replace `src/components/screens/Commendations.jsx`**

```jsx
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { testimonials } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Log = styled.blockquote`
    border: 1px solid var(--dim);
    padding: 1rem 1.2rem;
    margin-bottom: 1.2rem;
    max-width: 75ch;
`;

const Meta = styled.footer`
    color: var(--dim);
    margin-top: 0.6rem;
`;

const Commendations = () => {
    usePageMeta('FIELD COMMENDATIONS', 'Testimonials and endorsements.');

    return (
        <ScreenFrame title="FIELD COMMENDATIONS">
            {testimonials.map((entry, index) => (
                <Log key={entry.person}>
                    <p style={{ color: 'var(--dim)' }}>RECOVERED LOG {String(index + 1).padStart(2, '0')}/{String(testimonials.length).padStart(2, '0')}</p>
                    <p>&ldquo;{entry.text}&rdquo;</p>
                    <Meta>— {entry.person}, {entry.role}, {entry.company}</Meta>
                </Log>
            ))}
        </ScreenFrame>
    );
};

export default Commendations;
```

- [ ] **Step 2: Verify in browser** — `/commendations` renders all four logs, readable on mobile width.

- [ ] **Step 3: Commit**

```bash
git add src/components/screens/Commendations.jsx
git commit -m "feat: commendations screen as recovered logs"
```

---

### Task 13: OpenComms screen (contact form)

**Files:**
- Modify: `src/components/screens/OpenComms.jsx` (replace stub)
- Test: `src/components/screens/OpenComms.test.jsx`

- [ ] **Step 1: Write failing test `src/components/screens/OpenComms.test.jsx`**

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import OpenComms from './OpenComms.jsx';

const fillAndSubmit = async () => {
    await userEvent.type(screen.getByLabelText(/CALLSIGN/i), 'Vault Dweller');
    await userEvent.type(screen.getByLabelText(/RETURN FREQUENCY/i), 'dweller@vault.com');
    await userEvent.type(screen.getByLabelText(/SUBJECT/i), 'Hello');
    await userEvent.type(screen.getByLabelText(/MESSAGE/i), 'GECK located.');
    await userEvent.click(screen.getByRole('button', { name: /TRANSMIT/i }));
};

describe('OpenComms', () => {
    beforeEach(() => vi.restoreAllMocks());

    it('posts the form and shows success output', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
        render(<MemoryRouter><OpenComms /></MemoryRouter>);
        await fillAndSubmit();
        expect(fetch).toHaveBeenCalledWith('/.netlify/functions/send-email', expect.objectContaining({
            method: 'POST',
        }));
        expect(await screen.findByText(/TRANSMISSION SENT/)).toBeInTheDocument();
    });

    it('shows relay failure output when the request fails', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));
        render(<MemoryRouter><OpenComms /></MemoryRouter>);
        await fillAndSubmit();
        expect(await screen.findByText(/RELAY FAILURE/)).toBeInTheDocument();
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/screens/OpenComms.test.jsx`
Expected: FAIL — stub has no form.

- [ ] **Step 3: Replace `src/components/screens/OpenComms.jsx`**

```jsx
import { useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { socials } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    max-width: 560px;
`;

const Field = styled.label`
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    color: var(--dim);
`;

const inputStyles = `
    background: transparent;
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem;

    &:focus {
        outline: 2px solid var(--phosphor);
        outline-offset: 1px;
    }
`;

const Input = styled.input`${inputStyles}`;

const TextArea = styled.textarea`
    ${inputStyles}
    min-height: 120px;
    resize: vertical;
`;

const Submit = styled.button`
    align-self: flex-start;
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem 1.4rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }

    &:disabled {
        opacity: 0.5;
        cursor: wait;
    }
`;

const Output = styled.p`
    min-height: 1.4em;
`;

const Links = styled.p`
    display: flex;
    gap: 1.4rem;
    flex-wrap: wrap;
    margin-top: 2rem;
`;

const OpenComms = () => {
    const [status, setStatus] = useState('idle');
    usePageMeta('OPEN COMMS CHANNEL', 'Contact Tanmai Niranjan.');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setStatus('sending');
        const data = Object.fromEntries(new FormData(event.target));

        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) throw new Error('relay failure');
            setStatus('sent');
            event.target.reset();
        } catch {
            setStatus('failed');
        }
    };

    return (
        <ScreenFrame title="OPEN COMMS CHANNEL">
            <Form id="form" onSubmit={handleSubmit}>
                <Field>
                    CALLSIGN (NAME)
                    <Input name="name" required autoComplete="name" />
                </Field>
                <Field>
                    RETURN FREQUENCY (EMAIL)
                    <Input name="email" type="email" required autoComplete="email" />
                </Field>
                <Field>
                    SUBJECT
                    <Input name="subject" required />
                </Field>
                <Field>
                    MESSAGE
                    <TextArea name="message" required />
                </Field>
                <Submit type="submit" disabled={status === 'sending'}>
                    {status === 'sending' ? 'TRANSMITTING...' : '[ TRANSMIT MESSAGE ]'}
                </Submit>
                <Output role="status">
                    {status === 'sent' && '> TRANSMISSION SENT ✓'}
                    {status === 'failed' && '> RELAY FAILURE — RETRY'}
                </Output>
            </Form>
            <Links>
                {socials.map((social) => (
                    <a key={social.name} href={social.link} target="_blank" rel="noreferrer">
                        [{social.name}]
                    </a>
                ))}
                <a href="/resume.pdf" download>[EXPORT DOSSIER — RESUME]</a>
            </Links>
        </ScreenFrame>
    );
};

export default OpenComms;
```

Note: the owner must drop `resume.pdf` into `public/` — until then the link 404s in dev (acceptable; flagged in final task).

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/screens/OpenComms.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Verify in browser** — `/comms`: form looks terminal-native, Tab order is sane, submit shows TRANSMITTING → output line (will fail locally without Netlify env; the failure path renders RELAY FAILURE correctly).

- [ ] **Step 6: Commit**

```bash
git add src/components/screens/OpenComms.jsx src/components/screens/OpenComms.test.jsx
git commit -m "feat: open comms contact screen with in-fiction transmit feedback"
```

---

### Task 14: Calibration screen (theme + scanlines)

**Files:**
- Modify: `src/components/screens/Calibration.jsx` (replace stub)
- Test: `src/components/screens/Calibration.test.jsx`

- [ ] **Step 1: Write failing test `src/components/screens/Calibration.test.jsx`**

```jsx
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { SettingsProvider } from '../../settings.jsx';
import Calibration from './Calibration.jsx';

const renderScreen = () =>
    render(
        <MemoryRouter>
            <SettingsProvider>
                <Calibration />
            </SettingsProvider>
        </MemoryRouter>
    );

describe('Calibration', () => {
    beforeEach(() => localStorage.clear());

    it('switches phosphor theme', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /GREEN/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).theme).toBe('green');
        expect(document.documentElement.dataset.theme).toBe('green');
    });

    it('switches scanline intensity', async () => {
        renderScreen();
        await userEvent.click(screen.getByRole('button', { name: /OFF/ }));
        expect(JSON.parse(localStorage.getItem('termlink-settings')).scanlines).toBe('off');
    });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/components/screens/Calibration.test.jsx`
Expected: FAIL — stub has no buttons.

- [ ] **Step 3: Replace `src/components/screens/Calibration.jsx`**

```jsx
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { useSettings } from '../../settings.jsx';
import { usePageMeta } from '../../hooks/usePageMeta.js';

const Group = styled.div`
    margin-bottom: 1.8rem;
`;

const GroupTitle = styled.h3`
    color: var(--dim);
    margin-bottom: 0.6rem;
    letter-spacing: 0.1em;
`;

const OptionButton = styled.button`
    background: transparent;
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    min-height: 44px;
    padding: 0.4rem 1.2rem;
    margin-right: 0.8rem;
    margin-bottom: 0.5rem;
    cursor: pointer;

    &[data-active='true'], &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

const Calibration = () => {
    const { settings, update } = useSettings();
    usePageMeta('TERMINAL CALIBRATION', 'Adjust phosphor and CRT settings.');

    return (
        <ScreenFrame title="TERMINAL CALIBRATION">
            <Group>
                <GroupTitle>// PHOSPHOR TYPE</GroupTitle>
                <OptionButton data-active={settings.theme === 'amber'} onClick={() => update({ theme: 'amber' })}>
                    AMBER (P3)
                </OptionButton>
                <OptionButton data-active={settings.theme === 'green'} onClick={() => update({ theme: 'green' })}>
                    GREEN (P1)
                </OptionButton>
            </Group>
            <Group>
                <GroupTitle>// SCANLINE EMITTER</GroupTitle>
                {['off', 'low', 'full'].map((level) => (
                    <OptionButton
                        key={level}
                        data-active={settings.scanlines === level}
                        onClick={() => update({ scanlines: level })}
                    >
                        {level.toUpperCase()}
                    </OptionButton>
                ))}
            </Group>
            <p style={{ color: 'var(--dim)' }}>
                // AUDIO EMITTER: INSTALLED IN A FUTURE FIRMWARE UPDATE (PHASE 2)
            </p>
        </ScreenFrame>
    );
};

export default Calibration;
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/components/screens/Calibration.test.jsx`
Expected: PASS (2 tests)

- [ ] **Step 5: Verify in browser** — `/calibration`: clicking GREEN recolors the whole site instantly; scanline OFF/LOW/FULL visibly changes the overlay; settings survive a refresh.

- [ ] **Step 6: Commit**

```bash
git add src/components/screens/Calibration.jsx src/components/screens/Calibration.test.jsx
git commit -m "feat: calibration screen for phosphor theme and scanline intensity"
```

---

### Task 15: Final verification pass + OG image + README

**Files:**
- Create: `public/img/og-terminal.png`
- Modify: `README.md`

- [ ] **Step 1: Full test suite + lint + build**

```bash
npx vitest run && npm run lint && npm run build
```
Expected: all pass. Fix anything that doesn't before proceeding.

- [ ] **Step 2: Manual keyboard-only walkthrough** (no mouse): boot → skip with key → menu via arrows/numbers → every screen → expand a project file → open/close VIEW RAW with Enter/Esc → submit comms form via Tab+Enter → toggle theme on calibration → Esc back to menu each time. Everything must be reachable.

- [ ] **Step 3: Responsive walkthrough** in DevTools at 375px, 768px, 1280px, 1920px: no horizontal scroll, menu rows are comfortably tappable, project detail grid stacks on mobile.

- [ ] **Step 4: Reduced-motion check** — enable "Emulate CSS prefers-reduced-motion" in DevTools rendering tab: boot completes quickly, typewriter renders instantly, sweep/flicker gone.

- [ ] **Step 5: OG image** — set viewport to 1200×630, screenshot the main menu, save as `public/img/og-terminal.png`.

- [ ] **Step 6: Update `README.md`** — replace stale content with: what the site is, `npm run dev` / `npm run build` / `npx vitest run`, where content lives (`src/constants/index.js`), the PLACEHOLDER markers the owner must fill (bio, experience, resume.pdf in `public/`).

- [ ] **Step 7: Commit**

```bash
git add public/img/og-terminal.png README.md
git commit -m "chore: OG image, README refresh, phase 1 verification complete"
```

---

## Out of scope (later phases)

- **Phase 2:** CommandPrompt, HackMinigame + VAULT screen, sound design (`useSound`), SystemMonitor (GitHub/LeetCode), HolotapeLogs, transition polish between routes.
- **Phase 3:** Guestbook (Netlify Blobs + moderation).
- Owner content updates: real bio, experience entries, new projects, `public/resume.pdf`.
- Image optimization (WebP conversion + width-based `srcset`): deferred until the owner supplies final project imagery — converting the college-era thumbnails now would be wasted work. PhosphorImage already lazy-loads.

