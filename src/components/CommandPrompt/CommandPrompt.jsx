import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { commands, menuItems } from '../../constants/index.js';
import { useSettings } from '../../settings.jsx';
import { THEME_ORDER, DEFAULT_THEME } from '../../theme.js';

const MAX_SCROLLBACK = 40;

// tiny Levenshtein — used only for did-you-mean against a fixed command list
const levenshtein = (a, b) => {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const prev = new Array(b.length + 1);
    for (let i = 0; i <= b.length; i += 1) prev[i] = i;
    for (let i = 1; i <= a.length; i += 1) {
        let curr = i;
        for (let j = 1; j <= b.length; j += 1) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            const next = Math.min(
                prev[j] + 1,        // deletion
                curr + 1,           // insertion
                prev[j - 1] + cost, // substitution
            );
            prev[j - 1] = curr;
            curr = next;
        }
        prev[b.length] = curr;
    }
    return prev[b.length];
};

const nearestCommand = (input) => {
    let best = null;
    let bestDist = Infinity;
    commands.forEach(({ name }) => {
        const d = levenshtein(input, name);
        if (d < bestDist) {
            bestDist = d;
            best = name;
        }
    });
    return bestDist <= 2 ? best : null;
};

// Fuzzy-match a query against menuItems by label words, hint, and path segment
const matchMenuItem = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return null;
    // 1. exact path segment / label / hint match wins
    for (const item of menuItems) {
        const seg = item.path.replace(/^\//, '').toLowerCase();
        if (seg === q) return item;
    }
    // 2. starts-with on label word or path segment
    for (const item of menuItems) {
        const seg = item.path.replace(/^\//, '').toLowerCase();
        const label = item.label.toLowerCase();
        const hint = (item.hint || '').toLowerCase();
        if (seg.startsWith(q)) return item;
        if (label.split(/\s+/).some((word) => word.startsWith(q))) return item;
        if (hint.split(/\s+/).some((word) => word.startsWith(q))) return item;
    }
    // 3. substring includes anywhere
    for (const item of menuItems) {
        const hay = `${item.label} ${item.hint || ''} ${item.path}`.toLowerCase();
        if (hay.includes(q)) return item;
    }
    return null;
};

const padRight = (text, len) => {
    if (text.length >= len) return text;
    return text + ' '.repeat(len - text.length);
};

const Overlay = styled.div`
    position: fixed;
    /* anchor for the absolutely-positioned close button */
    left: 50%;
    transform: translateX(-50%);
    bottom: calc(2.2rem + env(safe-area-inset-bottom, 0px));
    width: calc(100% - 2rem);
    max-width: 760px;
    z-index: 80;
    background: var(--bg);
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font: inherit;
    padding: 0.6rem 0.8rem;
    box-shadow: 0 0 0 1px var(--bg), 0 0 18px var(--glow);
`;

const CloseButton = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    min-width: 44px;
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 0;
    font: inherit;
    color: var(--dim);
    cursor: pointer;
    padding: 0 0.6rem;
    letter-spacing: 0.04em;

    &:hover,
    &:focus-visible {
        color: var(--bg);
        background: var(--phosphor);
        outline: none;
    }
`;

const Output = styled.div`
    max-height: 40vh;
    overflow-y: auto;
    white-space: pre-wrap;
    line-height: 1.3;
    margin-bottom: 0.4rem;
    color: var(--phosphor);
`;

const Line = styled.div`
    color: ${(props) => (props.$dim ? 'var(--dim)' : 'var(--phosphor)')};
`;

const InputRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.4rem;
`;

const Prompt = styled.span`
    color: var(--phosphor);
`;

const Input = styled.input`
    flex: 1;
    background: transparent;
    border: 0;
    outline: 0;
    font: inherit;
    color: var(--phosphor);
    caret-color: var(--phosphor);
    padding: 0;
`;

const FloatingButton = styled.button`
    position: fixed;
    bottom: calc(2.4rem + env(safe-area-inset-bottom, 0px));
    right: max(14px, env(safe-area-inset-right, 0px));
    /* Above the overlay (z=80) so tapping [CMD] while open can close it on mobile. */
    z-index: 90;
    font: inherit;
    background: color-mix(in srgb, var(--bg) 85%, var(--phosphor));
    color: var(--phosphor);
    border: 1px solid var(--dim);
    padding: 0.3rem 0.7rem;
    cursor: pointer;
    text-shadow: none;
    letter-spacing: 0.04em;

    &:hover, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
    }
`;

const CommandPrompt = () => {
    const navigate = useNavigate();
    const { settings, update } = useSettings();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('');
    const [scrollback, setScrollback] = useState([]);
    const [history, setHistory] = useState([]);
    const [historyIdx, setHistoryIdx] = useState(-1);
    const inputRef = useRef(null);
    const outputRef = useRef(null);

    // Keep latest theme in a ref so the `theme` command always reads current
    const themeRef = useRef(settings.theme);
    useEffect(() => {
        themeRef.current = settings.theme;
    }, [settings.theme]);

    // Global open: Ctrl+K or plain `>` (when not typing in another input)
    useEffect(() => {
        const onKey = (event) => {
            if (open) return;
            // Ctrl+K (or Cmd+K)
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen(true);
                return;
            }
            // plain `>` — but only when the user isn't typing somewhere else
            if (event.key === '>' && !event.ctrlKey && !event.metaKey && !event.altKey) {
                const t = event.target;
                if (t && typeof t.closest === 'function' && t.closest('input, textarea')) {
                    return;
                }
                event.preventDefault();
                setOpen(true);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [open]);

    // Esc closes the prompt WITHOUT bubbling to EscToMenu (capture-phase, like PhosphorImage)
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                event.preventDefault();
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKey, true);
        return () => window.removeEventListener('keydown', onKey, true);
    }, [open]);

    // Autofocus the input when opened; scroll output to bottom on new lines
    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [scrollback]);

    const pushLines = useCallback((lines) => {
        setScrollback((prev) => {
            const next = [...prev, ...lines];
            return next.length > MAX_SCROLLBACK ? next.slice(next.length - MAX_SCROLLBACK) : next;
        });
    }, []);

    const close = useCallback(() => {
        setOpen(false);
    }, []);

    const execute = useCallback((raw) => {
        const input = raw.trim();
        const echo = `> ${input}`;
        if (!input) {
            pushLines([echo]);
            return;
        }
        const lower = input.toLowerCase();
        const [head, ...rest] = lower.split(/\s+/);
        const arg = rest.join(' ');

        // easter eggs first
        if (head === 'sudo') {
            pushLines([echo, 'PERMISSION DENIED: NICE TRY.']);
            return;
        }
        if (head === 'rm') {
            pushLines([echo, 'FILESYSTEM PROTECTED BY TANMAI INDUSTRIES EULA §7.3']);
            return;
        }
        if (lower === 'exit') {
            pushLines([echo, 'THERE IS NO EXIT. ONLY LOGOUT.']);
            return;
        }
        if (lower === 'vault') {
            pushLines([echo, 'THAT FILE DOES NOT EXIST. STOP ASKING.']);
            return;
        }
        if (lower === 'close') {
            close();
            return;
        }

        if (head === 'help') {
            const longest = commands.reduce((acc, c) => Math.max(acc, c.name.length), 0);
            const lines = commands.map((c) => `  ${padRight(c.name.toUpperCase(), longest + 2)}— ${c.desc}`);
            pushLines([echo, 'AVAILABLE COMMANDS:', ...lines]);
            return;
        }
        if (head === 'ls') {
            const lines = menuItems.map((m) => `  [${m.num}] ${m.label} → ${m.path}`);
            pushLines([echo, 'TERMINAL SCREENS:', ...lines]);
            return;
        }
        if (head === 'open') {
            if (!arg) {
                pushLines([echo, 'USAGE: OPEN <SCREEN>']);
                return;
            }
            const match = matchMenuItem(arg);
            if (match) {
                pushLines([echo, `OPENING ${match.label} → ${match.path}`]);
                navigate(match.path);
                close();
                return;
            }
            pushLines([echo, `NO SUCH RECORD: ${arg}`]);
            return;
        }
        if (lower === 'theme') {
            const current = THEME_ORDER.includes(themeRef.current) ? themeRef.current : DEFAULT_THEME;
            const idx = THEME_ORDER.indexOf(current);
            const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
            update({ theme: next });
            pushLines([echo, `PHOSPHOR → ${next.toUpperCase()}`]);
            return;
        }
        if (lower === 'whoami') {
            let operator = 'GUEST';
            try {
                operator = sessionStorage.getItem('termlink-operator') || 'GUEST';
            } catch {
                operator = 'GUEST';
            }
            pushLines([echo, `OPERATOR: ${operator} · CLEARANCE: VISITOR`]);
            return;
        }
        if (lower === 'clear') {
            setScrollback([]);
            return;
        }
        if (lower === 'hack') {
            pushLines([echo, 'INITIATING SECURITY BYPASS…']);
            navigate('/personnel');
            close();
            return;
        }
        if (lower === 'logout') {
            try { sessionStorage.removeItem('termlink-operator'); } catch { /* noop */ }
            pushLines([echo, 'SESSION TERMINATED.']);
            window.location.assign('/');
            return;
        }

        // Unknown — did you mean?
        const guess = nearestCommand(head);
        const lines = [echo, `UNRECOGNIZED COMMAND: ${input}`];
        if (guess) lines.push(`DID YOU MEAN: ${guess.toUpperCase()}?`);
        pushLines(lines);
    }, [pushLines, navigate, update, close]);

    const onInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const submitted = value;
            setValue('');
            if (submitted.trim()) {
                setHistory((prev) => [...prev, submitted]);
            }
            setHistoryIdx(-1);
            execute(submitted);
            return;
        }
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (!history.length) return;
            const nextIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
            setHistoryIdx(nextIdx);
            setValue(history[nextIdx] ?? '');
            return;
        }
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (historyIdx < 0) return;
            const nextIdx = historyIdx + 1;
            if (nextIdx >= history.length) {
                setHistoryIdx(-1);
                setValue('');
            } else {
                setHistoryIdx(nextIdx);
                setValue(history[nextIdx] ?? '');
            }
        }
    };

    return (
        <>
            <FloatingButton
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-label={open ? 'close command prompt' : 'open command prompt'}
                aria-expanded={open}
            >
                [CMD]
            </FloatingButton>
            {open && (
                <Overlay role="dialog" aria-label="command prompt">
                    <CloseButton
                        type="button"
                        onClick={close}
                        aria-label="close prompt"
                        data-testid="cmd-close"
                    >
                        [X]
                    </CloseButton>
                    <Output ref={outputRef} data-testid="cmd-output">
                        {scrollback.length === 0 ? (
                            <Line $dim>TYPE HELP FOR AVAILABLE COMMANDS · ESC TO CLOSE</Line>
                        ) : (
                            scrollback.map((line, i) => (
                                <Line key={`${i}-${line}`}>{line || ' '}</Line>
                            ))
                        )}
                    </Output>
                    <InputRow>
                        <Prompt>{'>'}</Prompt>
                        <Input
                            ref={inputRef}
                            value={value}
                            onChange={(event) => setValue(event.target.value)}
                            onKeyDown={onInputKeyDown}
                            autoFocus
                            spellCheck={false}
                            autoCapitalize="off"
                            autoCorrect="off"
                            aria-label="command input"
                            data-testid="cmd-input"
                        />
                    </InputRow>
                </Overlay>
            )}
        </>
    );
};

export default CommandPrompt;
