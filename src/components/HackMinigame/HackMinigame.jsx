import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hackGame } from '../../constants/index.js';

// ---------------------------------------------------------------------------
// Fallout-style "ICE BREACH" password hack.
// A block of garbage memory hides a handful of equal-length candidate words —
// one is the password. Testing a word reveals its LIKENESS (how many letters
// sit in the correct position). Matching bracket pairs are bonuses: they either
// remove a dud or restore your attempts. Clear, learnable, and on-theme.
// ---------------------------------------------------------------------------

const WORD_LEN = 5;
const ROWS = 11;          // lines per column
const COLS = 2;
const LINE_W = 12;        // garbage+token chars per line
const CANDIDATES = 7;     // how many words appear
const BRACKETS = 3;       // how many bonus bracket tokens appear

const WORD_POOL = [
    'VAULT', 'CODES', 'LOCKS', 'BYTES', 'CORES', 'TOKEN', 'NODES', 'RELAY',
    'PROXY', 'GHOST', 'AGENT', 'LOGIC', 'STACK', 'QUERY', 'CACHE', 'CRYPT',
    'MODEM', 'PATCH', 'SHELL', 'DEBUG', 'ARRAY', 'BREAK', 'ROGUE', 'CYBER',
    'VIRUS', 'TRACE', 'SPOOF', 'DRONE', 'WAGES', 'HEIST',
];
const GARBAGE = '.,:;!?@#$%^&*-_+=/|~';
const BRACKET_PAIRS = [['<', '>'], ['(', ')'], ['[', ']'], ['{', '}']];

const rnd = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rnd(arr.length)];
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i -= 1) {
        const j = rnd(i + 1);
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};
const junk = (n) => Array.from({ length: n }, () => GARBAGE[rnd(GARBAGE.length)]).join('');
const hex = (n) => `0x${(n & 0xffff).toString(16).toUpperCase().padStart(4, '0')}`;

const likeness = (guess, password) => {
    let m = 0;
    for (let i = 0; i < password.length; i += 1) {
        if (guess[i] === password[i]) m += 1;
    }
    return m;
};

const buildPuzzle = () => {
    const words = shuffle(WORD_POOL)
        .slice(0, CANDIDATES)
        .map((text, i) => ({ id: `w${i}`, text }));
    const password = pick(words).text;

    const replenishIdx = rnd(BRACKETS);
    const brackets = Array.from({ length: BRACKETS }, (unused, i) => {
        const [open, close] = pick(BRACKET_PAIRS);
        return {
            id: `b${i}`,
            text: `${open}${junk(1 + rnd(3))}${close}`,
            effect: i === replenishIdx ? 'replenish' : 'dud',
        };
    });

    const specials = shuffle([
        ...words.map((w) => ({ type: 'word', id: w.id, text: w.text })),
        ...brackets.map((b) => ({ type: 'bracket', id: b.id, text: b.text, effect: b.effect })),
    ]);

    const total = ROWS * COLS;
    const slots = shuffle(Array.from({ length: total }, (unused, i) => i)).slice(0, specials.length);
    const lineSpecial = {};
    specials.forEach((s, i) => { lineSpecial[slots[i]] = s; });

    const base = 0x8000 + rnd(0x6000);
    const lines = [];
    for (let i = 0; i < total; i += 1) {
        const addr = hex(base + i * LINE_W);
        const s = lineSpecial[i];
        const segs = [];
        if (s) {
            const len = s.text.length;
            const before = rnd(Math.max(1, LINE_W - len));
            const after = Math.max(0, LINE_W - len - before);
            if (before > 0) segs.push({ type: 'junk', text: junk(before) });
            segs.push(s);
            if (after > 0) segs.push({ type: 'junk', text: junk(after) });
        } else {
            segs.push({ type: 'junk', text: junk(LINE_W) });
        }
        lines.push({ addr, segs });
    }

    const columns = [];
    for (let c = 0; c < COLS; c += 1) columns.push(lines.slice(c * ROWS, (c + 1) * ROWS));
    return { password, words, columns };
};

// --- styling ---------------------------------------------------------------

const Wrap = styled.div`
    width: 100%;
    max-width: 780px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    box-sizing: border-box;
`;

const Rules = styled.div`
    border: 1px solid var(--dim);
    padding: 0.9rem 1.1rem;
    color: var(--dim);
    font-size: 1.15rem;
    line-height: 1.55;
    letter-spacing: 0.03em;
`;

const RuleHead = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.18em;
    font-size: 1.25rem;
    margin-bottom: 0.55rem;
`;

const RuleList = styled.ul`
    list-style: none;
    margin: 0.4rem 0 0;
    padding: 0;

    li {
        padding: 0.1rem 0;
    }

    li::before {
        content: '> ';
        color: var(--phosphor);
    }
`;

const Attempts = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.2em;
    font-size: 1.15rem;
`;

const Board = styled.div`
    display: flex;
    gap: 1.4rem;
    align-items: stretch;

    @media (max-width: 680px) {
        flex-direction: column;
    }
`;

const Dump = styled.div`
    display: flex;
    gap: 1.6rem;
    font-family: 'VT323', Menlo, Consolas, monospace;
    font-size: 1.1rem;
    line-height: 1.35;
`;

const DumpCol = styled.div`
    display: flex;
    flex-direction: column;
`;

const Line = styled.div`
    white-space: pre;
`;

const Addr = styled.span`
    color: var(--dim);
`;

const Junk = styled.span`
    color: var(--dim);
`;

const WordBtn = styled.button`
    display: inline;
    font: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
    color: var(--phosphor);
    text-shadow: 0 0 6px var(--glow);
    cursor: pointer;
    white-space: pre;

    &:hover:not(:disabled),
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    &:disabled {
        color: var(--dim);
        text-decoration: line-through;
        text-shadow: none;
        cursor: default;
    }
`;

const BracketBtn = styled.button`
    display: inline;
    font: inherit;
    padding: 0;
    margin: 0;
    border: 0;
    background: none;
    color: var(--phosphor);
    cursor: pointer;
    white-space: pre;

    &:hover:not(:disabled),
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
    }

    &:disabled {
        color: var(--dim);
        cursor: default;
    }
`;

const LogBox = styled.div`
    flex: 1;
    min-width: 190px;
    border: 1px solid var(--dim);
    padding: 0.6rem 0.7rem;
    height: 15rem;
    overflow-y: auto;
    font-family: 'VT323', Menlo, Consolas, monospace;
    font-size: 1rem;
    line-height: 1.4;
    color: var(--phosphor);

    @media (max-width: 680px) {
        height: 9rem;
    }
`;

const LogLine = styled.div`
    white-space: pre-wrap;
`;

const Banner = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.25em;
    font-size: 1.3rem;
    text-align: center;
    padding: 0.8rem 0;
    text-shadow: 0 0 12px var(--glow);
`;

// --- component -------------------------------------------------------------

const HackMinigame = ({ onWin, onLockout, initialPuzzle }) => {
    const maxAttempts = (hackGame && hackGame.attempts) || 4;
    const [puzzle] = useState(() => initialPuzzle || buildPuzzle());
    const [attempts, setAttempts] = useState(maxAttempts);
    const [guessed, setGuessed] = useState(() => new Set());
    const [removed, setRemoved] = useState(() => new Set());
    const [usedBrackets, setUsedBrackets] = useState(() => new Set());
    const [log, setLog] = useState(() => ['> ROBCO TERMLINK PROTOCOL', '> ICE ACTIVE — AWAITING INPUT']);
    const [phase, setPhase] = useState('playing'); // 'playing' | 'granted' | 'locked'

    const winRef = useRef(false);
    const lockRef = useRef(false);
    const logRef = useRef(null);

    const pushLog = (...entries) => setLog((prev) => [...prev, ...entries].slice(-10));

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [log]);

    useEffect(() => {
        if (phase === 'granted' && !winRef.current) {
            winRef.current = true;
            onWin();
        }
    }, [phase, onWin]);

    useEffect(() => {
        if (phase === 'locked' && !lockRef.current) {
            lockRef.current = true;
            if (onLockout) onLockout();
        }
    }, [phase, onLockout]);

    const guessWord = (seg) => {
        if (phase !== 'playing' || guessed.has(seg.id) || removed.has(seg.id)) return;
        if (seg.text === puzzle.password) {
            pushLog(`> ${seg.text}`, '> EXACT MATCH', '> ACCESS GRANTED');
            setPhase('granted');
            return;
        }
        const lk = likeness(seg.text, puzzle.password);
        setGuessed((prev) => new Set(prev).add(seg.id));
        pushLog(`> ${seg.text}`, `> ENTRY DENIED · LIKENESS ${lk}/${WORD_LEN}`);
        const next = attempts - 1;
        setAttempts(next);
        if (next <= 0) {
            pushLog('> ALLOWANCE DEPLETED — TERMINAL LOCKED');
            setPhase('locked');
        }
    };

    const activateBracket = (seg) => {
        if (phase !== 'playing' || usedBrackets.has(seg.id)) return;
        setUsedBrackets((prev) => new Set(prev).add(seg.id));
        if (seg.effect === 'replenish') {
            setAttempts(maxAttempts);
            pushLog(`> ${seg.text}`, '> ALLOWANCE REPLENISHED');
            return;
        }
        const duds = puzzle.words.filter(
            (w) => w.text !== puzzle.password && !removed.has(w.id) && !guessed.has(w.id),
        );
        if (duds.length > 0) {
            const victim = pick(duds);
            setRemoved((prev) => new Set(prev).add(victim.id));
            pushLog(`> ${seg.text}`, '> DUD REMOVED');
        } else {
            pushLog(`> ${seg.text}`, '> NO DUDS REMAIN');
        }
    };

    const renderSeg = (seg, key) => {
        if (seg.type === 'word') {
            if (removed.has(seg.id)) {
                return <Junk key={key}>{'.'.repeat(seg.text.length)}</Junk>;
            }
            const isGuessed = guessed.has(seg.id);
            return (
                <WordBtn
                    key={key}
                    type="button"
                    disabled={isGuessed || phase !== 'playing'}
                    onClick={() => guessWord(seg)}
                >
                    {seg.text}
                </WordBtn>
            );
        }
        if (seg.type === 'bracket') {
            return (
                <BracketBtn
                    key={key}
                    type="button"
                    disabled={usedBrackets.has(seg.id) || phase !== 'playing'}
                    onClick={() => activateBracket(seg)}
                    aria-label="bonus bracket"
                >
                    {seg.text}
                </BracketBtn>
            );
        }
        return <Junk key={key}>{seg.text}</Junk>;
    };

    const blocks = Array.from({ length: maxAttempts }, (unused, i) => (i < attempts ? '▮' : '▯')).join(' ');

    return (
        <Wrap>
            <Rules>
                <RuleHead>{'// ICE BREACH PROTOCOL'}</RuleHead>
                {`ONE WORD IN MEMORY IS THE PASSWORD. ALL ${CANDIDATES} CANDIDATES ARE ${WORD_LEN} LETTERS.`}
                <RuleList>
                    <li>CLICK A WORD TO TEST IT.</li>
                    <li>{`LIKENESS = LETTERS THAT SIT IN THE CORRECT POSITION (MATCH ALL ${WORD_LEN} TO WIN).`}</li>
                    <li>{'MATCHING BRACKET PAIRS  < >  ( )  [ ]  { }  REMOVE A DUD OR RESTORE ATTEMPTS.'}</li>
                    <li>{`${maxAttempts} WRONG GUESSES AND THE TERMINAL LOCKS.`}</li>
                </RuleList>
            </Rules>

            <Attempts>{`ATTEMPTS: ${blocks}`}</Attempts>

            {phase === 'granted' && <Banner>ACCESS GRANTED</Banner>}
            {phase === 'locked' && <Banner>TERMINAL LOCKED</Banner>}

            <Board>
                <Dump aria-label="memory dump">
                    {puzzle.columns.map((col, ci) => (
                        <DumpCol key={`col-${ci}`}>
                            {col.map((line) => (
                                <Line key={line.addr}>
                                    <Addr>{`${line.addr} `}</Addr>
                                    {line.segs.map((seg, si) => renderSeg(seg, `${line.addr}-${si}`))}
                                </Line>
                            ))}
                        </DumpCol>
                    ))}
                </Dump>
                <LogBox ref={logRef} aria-label="breach log">
                    {log.map((entry, i) => (
                        <LogLine key={`${i}-${entry}`}>{entry}</LogLine>
                    ))}
                </LogBox>
            </Board>
        </Wrap>
    );
};

HackMinigame.propTypes = {
    onWin: PropTypes.func.isRequired,
    onLockout: PropTypes.func,
    // optional injected puzzle (used by tests for determinism)
    initialPuzzle: PropTypes.shape({
        password: PropTypes.string,
        words: PropTypes.array,
        columns: PropTypes.array,
    }),
};

HackMinigame.defaultProps = {
    onLockout: undefined,
    initialPuzzle: undefined,
};

export default HackMinigame;
