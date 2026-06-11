import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import {
    getDeviceSpecLines,
    getRegion,
    getBrowserName,
    padLine,
} from '../../utils/deviceSpecs.js';
import { useClock } from '../../hooks/useClock.js';
import { generatePuzzle } from '../../utils/loginPuzzle.js';
import { reducedMotion } from '../../utils/reducedMotion.js';
import AsciiGlobe from './AsciiGlobe.jsx';

// Static lines shown on the LOGIN screen and at the top of BOOT screen.
const HEADER_LINES = [
    'TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL',
    'COPYRIGHT 2026 TANMAI INDUSTRIES',
    '',
    'RESTRICTED ACCESS — AUTHENTICATION REQUIRED',
];

// Stage timings.
const BOOT_TOTAL_MS = 4000;
const BOOT_LINE_INTERVAL_MS = 270;
const GRANTED_HOLD_MS = 900;
const BLINK_MS = 250;
const REDUCED_GRANTED_HOLD_MS = 600;
const IP_TIMEOUT_MS = 3000;
const BAR_CELLS = 20;

const SESSION_KEY = 'termlink-operator';

const fetchIp = (signal) => fetch('https://api.ipify.org?format=json', { signal })
    .then((r) => r.json())
    .then((j) => (j && typeof j.ip === 'string' && j.ip.length > 0 ? j.ip : 'UNTRACEABLE'))
    .catch(() => 'UNTRACEABLE');

const buildBar = (pct) => {
    const clamped = Math.max(0, Math.min(100, pct));
    const filled = Math.round((clamped / 100) * BAR_CELLS);
    const empty = BAR_CELLS - filled;
    // Both cells use the "Block Elements" range (U+2588 / U+2591) so they share a
    // single font fallback and render at one fixed advance width — otherwise the
    // bar grows as cells fill in on machines that substitute the glyphs to fonts
    // of differing widths.
    return `[${'█'.repeat(filled)}${'░'.repeat(empty)}] ${String(clamped).padStart(3, ' ')}%`;
};

const caretBlink = keyframes`
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
`;

const screenBlink = keyframes`
    0%   { opacity: 1; }
    20%  { opacity: 0; }
    40%  { opacity: 1; }
    60%  { opacity: 0; }
    100% { opacity: 0; }
`;

const Screen = styled.div`
    min-height: 100dvh;
    background-color: var(--bg);
    color: var(--phosphor);
    font-family: 'VT323', 'Courier New', monospace;
    font-size: clamp(15px, 2.2vmin, 20px);
    text-shadow: 0 0 7px var(--glow);
    padding: calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-top, 0px))
        calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-right, 0px))
        calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-bottom, 0px))
        calc(clamp(14px, 4vw, 56px) + env(safe-area-inset-left, 0px));
    display: flex;
    flex-direction: column;

    ${({ $blink }) => $blink && css`
        animation: ${screenBlink} ${BLINK_MS}ms steps(2, end) forwards;

        @media (prefers-reduced-motion: reduce) {
            animation: none;
            opacity: 1;
        }
    `}
`;

// Wraps the centered login column so the header text + form + hint share a
// common left edge in the middle of the viewport. `margin: auto` centers like
// justify/align center but degrades safely when content overflows small screens.
const LoginColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: min(560px, 92vw);
    margin: auto;
`;

// Fixed width (matching the login column) so the block is centered on a stable
// measure rather than on whatever the widest diagnostic line happens to be
// (e.g. a long GPU string would otherwise drag the whole block off-center).
// Children are capped to the column width and wrap instead of stretching it.
const BootColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: min(560px, 92vw);
    margin: auto;

    & > * {
        max-width: 100%;
    }
`;

const Line = styled.p`
    white-space: pre-wrap;
    min-height: 1em;
    margin: 0;
    visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
`;

const Bright = styled(Line)`
    color: var(--phosphor);
    filter: brightness(1.35);
    text-shadow: 0 0 10px var(--glow), 0 0 18px var(--glow);
`;

const Caret = styled.span`
    display: inline-block;
    width: 0.6em;
    animation: ${caretBlink} 1s steps(1) infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 1;
    }
`;

const GlobeWrap = styled.div`
    margin: 0.75rem 0;
    align-self: center;
`;

const Form = styled.form`
    display: grid;
    grid-template-columns: minmax(9rem, max-content) 1fr;
    gap: 0.75rem 1rem;
    align-items: center;
    width: 100%;
    margin: 1.5rem 0 0;

    /* phones: labels stack above full-width inputs — the two-column grid
       (label ~9rem + 80vw input) is wider than the viewport */
    @media (max-width: 700px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 0.35rem;
    }
`;

const Label = styled.label`
    color: var(--dim);
    letter-spacing: 0.05em;
`;

const Field = styled.input`
    background: transparent;
    border: 1px solid var(--dim);
    color: var(--phosphor);
    font-family: inherit;
    font-size: 1.1em;
    text-shadow: inherit;
    padding: 0.7rem 0.9rem;
    width: min(420px, 80vw);
    outline: none;

    @media (max-width: 700px) {
        width: 100%;
        margin-bottom: 0.5rem;
    }
    caret-color: var(--phosphor);

    &:focus, &:focus-visible {
        border-color: var(--phosphor);
        box-shadow: 0 0 0 1px var(--phosphor);
    }
`;

const Submit = styled.button`
    grid-column: 1 / -1;
    justify-self: start;
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font-family: inherit;
    font-size: 1.1em;
    text-shadow: inherit;
    padding: 0.7rem 1.4rem;
    margin-top: 0.75rem;
    cursor: pointer;

    &:hover, &:focus, &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }
`;

const Hint = styled.p`
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.05em;
    margin: 1.1rem 0 0;
    opacity: 0.85;
`;

// Stacked label + bright phosphor prompt for the rotating security challenge.
// The prompt sits on its own line directly beneath the "SECURITY CHALLENGE:"
// caption rather than running inline beside it.
const ChallengeLabel = styled.span`
    display: block;
    color: var(--dim);
    letter-spacing: 0.05em;
`;

const ChallengePrompt = styled.span`
    display: block;
    color: var(--phosphor);
    text-shadow: 0 0 8px var(--glow);
    margin-top: 0.3rem;
`;

// Same family as --phosphor but dimmed — reads as a soft warning without
// introducing a new red color into the palette.
const ErrorLine = styled(Line)`
    color: var(--dim);
    margin-top: 0.6rem;
    letter-spacing: 0.05em;
    opacity: 0.95;
`;

const Bar = styled(Line)`
    margin-top: 0.75rem;
    letter-spacing: 0.05em;
    /* keep the bar a single, unwrapping line of fixed-width cells */
    white-space: pre;
    font-variant-numeric: tabular-nums;
`;

// "ACCESS GRANTED" flourish shown the instant the challenge is solved, just
// before the boot diagnostics begin.
const unlockPop = keyframes`
    0%   { opacity: 0; transform: scale(0.94); filter: brightness(0.5); }
    55%  { opacity: 1; transform: scale(1.05); filter: brightness(1.7); }
    100% { opacity: 1; transform: scale(1); filter: brightness(1.3); }
`;

const UnlockBanner = styled.p`
    margin: 1.4rem 0 0;
    color: var(--phosphor);
    letter-spacing: 0.14em;
    text-shadow: 0 0 10px var(--glow), 0 0 18px var(--glow);
    animation: ${unlockPop} 0.6s ease-out 0.25s both;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 1;
    }
`;

const BootSequence = ({ onDone }) => {
    const [stage, setStage] = useState('login'); // 'login' | 'unlock' | 'boot' | 'granted'
    const [operatorId, setOperatorId] = useState('');
    const [challengeInput, setChallengeInput] = useState('');
    const [puzzle, setPuzzle] = useState(() => generatePuzzle());
    const [challengeError, setChallengeError] = useState(false);
    const [operator, setOperator] = useState('GUEST');
    const [ip, setIp] = useState(null); // null while pending
    const [bootLineCount, setBootLineCount] = useState(0);
    const [progress, setProgress] = useState(0);
    const [blink, setBlink] = useState(false);

    const clock = useClock();
    const doneRef = useRef(false);
    const operatorIdRef = useRef(null);
    const challengeRef = useRef(null);
    const submitRef = useRef(null);

    // ArrowDown: OPERATOR NAME → CHALLENGE → AUTHENTICATE; ArrowUp reverses.
    // preventDefault keeps the caret from jumping to start/end of the input.
    const handleFormKeyDown = (event) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        const order = [operatorIdRef.current, challengeRef.current, submitRef.current];
        const idx = order.indexOf(event.target);
        if (idx === -1) return;
        const next = event.key === 'ArrowDown' ? idx + 1 : idx - 1;
        if (next < 0 || next >= order.length) return;
        event.preventDefault();
        order[next]?.focus();
    };

    // Start the IP fetch at MOUNT so it usually resolves before BOOT starts.
    useEffect(() => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), IP_TIMEOUT_MS);
        fetchIp(controller.signal).then((result) => {
            clearTimeout(timeoutId);
            setIp(result);
        });
        return () => {
            controller.abort();
            clearTimeout(timeoutId);
        };
    }, []);

    // Autofocus OPERATOR ID on mount (autoFocus prop covers most cases, but
    // some browsers ignore it inside transformed/animated trees — be explicit).
    useEffect(() => {
        if (stage === 'login' && operatorIdRef.current) {
            operatorIdRef.current.focus();
        }
    }, [stage]);

    // UNLOCK stage: hold the "access granted" flourish briefly, then kick off
    // the boot diagnostics.
    useEffect(() => {
        if (stage !== 'unlock') return undefined;
        const delay = reducedMotion() ? 350 : 1000;
        const t = setTimeout(() => setStage('boot'), delay);
        return () => clearTimeout(t);
    }, [stage]);

    // Build the boot lines once we are on the BOOT stage. IP may still be
    // pending — fall through with 'UNTRACEABLE' if it never settles in time.
    const bootLines = useMemo(() => {
        if (stage !== 'boot' && stage !== 'granted') return [];
        return [
            padLine('NODE ADDR', ip || 'UNTRACEABLE'),
            padLine('REGION', getRegion()),
            padLine('BROWSER', getBrowserName()),
            ...getDeviceSpecLines(),
            // LOCAL TIME is rendered specially (live clock) — we still reserve
            // a slot in the list so the typewriter timing covers it.
            'LOCAL_TIME_PLACEHOLDER',
        ];
    }, [stage, ip]);

    // BOOT stage: tick lines + drive the progress bar for ~4s.
    useEffect(() => {
        if (stage !== 'boot') return undefined;
        const reduce = reducedMotion();
        const total = bootLines.length;

        if (reduce) {
            setBootLineCount(total);
            setProgress(100);
            const t = setTimeout(() => setStage('granted'), 200);
            return () => clearTimeout(t);
        }

        setBootLineCount(0);
        setProgress(0);
        const started = Date.now();

        const lineId = setInterval(() => {
            setBootLineCount((n) => {
                if (n >= total) {
                    clearInterval(lineId);
                    return n;
                }
                return n + 1;
            });
        }, BOOT_LINE_INTERVAL_MS);

        const barId = setInterval(() => {
            const elapsed = Date.now() - started;
            const pct = Math.min(100, Math.round((elapsed / BOOT_TOTAL_MS) * 100));
            setProgress(pct);
        }, 60);

        const advance = setTimeout(() => {
            setBootLineCount(total);
            setProgress(100);
            setStage('granted');
        }, BOOT_TOTAL_MS);

        return () => {
            clearInterval(lineId);
            clearInterval(barId);
            clearTimeout(advance);
        };
    }, [stage, bootLines.length]);

    // GRANTED stage: hold briefly, blink, finish.
    useEffect(() => {
        if (stage !== 'granted') return undefined;
        const reduce = reducedMotion();

        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            onDone();
        };

        if (reduce) {
            const t = setTimeout(finish, REDUCED_GRANTED_HOLD_MS);
            return () => clearTimeout(t);
        }

        const blinkAt = setTimeout(() => setBlink(true), GRANTED_HOLD_MS);
        const finishAt = setTimeout(finish, GRANTED_HOLD_MS + BLINK_MS);
        return () => {
            clearTimeout(blinkAt);
            clearTimeout(finishAt);
        };
    }, [stage, onDone]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (challengeInput.trim() !== puzzle.answer) {
            // Wrong answer: rotate the puzzle, surface a soft error, refocus.
            setPuzzle(generatePuzzle());
            setChallengeInput('');
            setChallengeError(true);
            if (challengeRef.current) challengeRef.current.focus();
            return;
        }
        const cleaned = (operatorId.trim() || 'GUEST').toUpperCase();
        try {
            sessionStorage.setItem(SESSION_KEY, cleaned);
        } catch {
            // sessionStorage can throw in privacy modes — never block boot.
        }
        setOperator(cleaned);
        setChallengeError(false);
        setStage('unlock');
    };

    // Render boot lines, intercepting the LOCAL TIME placeholder so the live
    // clock value can be slotted in as JSX (seconds visibly advance). Untyped
    // lines render invisible to reserve their height — the centered column
    // would otherwise re-center (jiggle) on every typed line.
    const renderBootLine = (line, i, hidden) => {
        if (line === 'LOCAL_TIME_PLACEHOLDER') {
            // Mirror padLine layout: "LOCAL TIME .................. <value>"
            const prefix = padLine('LOCAL TIME', '');
            return (
                <Line key={`b-${i}`} $hidden={hidden}>
                    {prefix}
                    {clock}
                </Line>
            );
        }
        return <Line key={`b-${i}`} $hidden={hidden}>{line || ' '}</Line>;
    };

    return (
        <Screen
            role="status"
            aria-label="Terminal login sequence"
            $blink={blink}
        >
            {stage === 'login' ? (
                <LoginColumn>
                    {HEADER_LINES.map((line, i) => (
                        <Line key={`h-${i}`}>{line || ' '}</Line>
                    ))}
                    <Form
                        onSubmit={handleSubmit}
                        onKeyDown={handleFormKeyDown}
                        aria-label="Authentication"
                    >
                        <Label htmlFor="operator-id">OPERATOR NAME:</Label>
                        <Field
                            id="operator-id"
                            name="operator-id"
                            type="text"
                            value={operatorId}
                            onChange={(e) => setOperatorId(e.target.value.toUpperCase())}
                            autoComplete="off"
                            autoCapitalize="characters"
                            spellCheck={false}
                            style={{ textTransform: 'uppercase' }}
                            ref={operatorIdRef}
                            autoFocus
                        />

                        <Label htmlFor="challenge">
                            <ChallengeLabel>SECURITY CHALLENGE:</ChallengeLabel>
                            <ChallengePrompt>{puzzle.prompt}</ChallengePrompt>
                        </Label>
                        <Field
                            id="challenge"
                            name="challenge"
                            type="text"
                            inputMode="numeric"
                            value={challengeInput}
                            onChange={(e) => setChallengeInput(e.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                            ref={challengeRef}
                            aria-label={`Security challenge: ${puzzle.prompt}`}
                        />

                        <Submit type="submit" ref={submitRef}>[ AUTHENTICATE ]</Submit>
                    </Form>
                    {challengeError && (
                        <ErrorLine role="alert">
                            {'> VERIFICATION FAILED — CHALLENGE ROTATED'}
                        </ErrorLine>
                    )}
                    <Hint>COGNITION CHECK REQUIRED. ALL OPERATORS WELCOME.</Hint>
                </LoginColumn>
            ) : stage === 'unlock' ? (
                <LoginColumn>
                    {HEADER_LINES.map((line, i) => (
                        <Line key={`h-${i}`}>{line || ' '}</Line>
                    ))}
                    <Line>{'> SECURITY CHALLENGE VERIFIED'}</Line>
                    <Line>{'> DISENGAGING TERMINAL LOCKS...'}</Line>
                    <UnlockBanner>[ ACCESS GRANTED ]</UnlockBanner>
                </LoginColumn>
            ) : (
                <BootColumn>
                    {HEADER_LINES.map((line, i) => (
                        <Line key={`h-${i}`}>{line || ' '}</Line>
                    ))}
                    <GlobeWrap>
                        <AsciiGlobe />
                    </GlobeWrap>
                    {bootLines.map((line, i) => renderBootLine(line, i, i >= bootLineCount))}
                    <Bar aria-label="Boot progress">
                        {buildBar(progress)}
                        <Caret>█</Caret>
                    </Bar>
                    {/* GRANTED lines reserve their space during boot so the
                        centered column doesn't shift when they appear */}
                    <Line $hidden={stage !== 'granted'}>{' '}</Line>
                    <Line $hidden={stage !== 'granted'}>{'ACCESS LEVEL: VISITOR ......... GRANTED'}</Line>
                    <Bright $hidden={stage !== 'granted'}>{`WELCOME, ${operator}`}</Bright>
                </BootColumn>
            )}
        </Screen>
    );
};

BootSequence.propTypes = {
    onDone: PropTypes.func.isRequired,
};

export default BootSequence;
