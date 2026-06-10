import { useMemo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { hackGame } from '../../constants/index.js';

const GARBAGE_CHARS = '{}[]()<>!@#$%^&*_-+=?/\\|;:,.';
const ROWS = 16;
const COLS = 2;
const CELL_CHARS = 12;

const Wrap = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    max-width: 920px;
    margin: 0 auto;
    align-items: start;
`;

const GridBlock = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem 1.2rem;
    font-family: 'VT323', Menlo, Consolas, monospace;
    font-size: 1.05rem;
    line-height: 1.4;
`;

const Row = styled.div`
    display: flex;
    gap: 0.7rem;
    white-space: pre;
`;

const Addr = styled.span`
    color: var(--dim);
`;

const Dump = styled.span`
    color: var(--phosphor);
`;

const WordButton = styled.button`
    background: transparent;
    border: none;
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0 2px;
    cursor: pointer;
    text-transform: uppercase;

    &:hover:not(:disabled), &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    &:disabled {
        color: var(--dim);
        cursor: not-allowed;
        text-decoration: line-through;
    }
`;

const SidePanel = styled.aside`
    border-left: 1px solid var(--dim);
    padding-left: 1.2rem;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const AttemptsLine = styled.div`
    letter-spacing: 0.15em;
    color: var(--phosphor);
`;

const Log = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    font-family: 'VT323', Menlo, Consolas, monospace;
    color: var(--phosphor);
`;

const LogLine = styled.div`
    white-space: pre;
`;

const Flash = styled.div`
    color: var(--phosphor);
    font-size: 1.2rem;
    letter-spacing: 0.2em;
    padding: 1rem 0;
    text-align: center;
    animation: hack-flash 0.4s steps(2) infinite;

    @keyframes hack-flash {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
    }
`;

// PRNG-ish helpers using Math.random (mockable in tests)
const randInt = (max) => Math.floor(Math.random() * max);
const randomChar = () => GARBAGE_CHARS[randInt(GARBAGE_CHARS.length)];
const randomGarbage = (n) => {
    let out = '';
    for (let i = 0; i < n; i += 1) out += randomChar();
    return out;
};

const likeness = (guess, secret) => {
    let count = 0;
    for (let i = 0; i < guess.length && i < secret.length; i += 1) {
        if (guess[i] === secret[i]) count += 1;
    }
    return count;
};

const buildBoard = (words) => {
    const totalCells = ROWS * COLS;
    const cells = new Array(totalCells).fill(null).map(() => ({ tokens: [] }));

    // Pick one secret deterministically off Math.random for testability
    const secretIdx = randInt(words.length);
    const secret = words[secretIdx];

    // Pre-fill garbage strings per cell
    cells.forEach((c) => { c.garbage = randomGarbage(CELL_CHARS); });

    // Place each word once across cells; track which cells already have a word
    const cellHasWord = new Array(totalCells).fill(false);
    const placements = words.map((w) => {
        // find an open cell
        let cellIdx = randInt(totalCells);
        let safety = 0;
        while (cellHasWord[cellIdx] && safety < totalCells * 2) {
            cellIdx = (cellIdx + 1) % totalCells;
            safety += 1;
        }
        cellHasWord[cellIdx] = true;
        // pick a position inside the cell so the word fits
        const maxStart = Math.max(0, CELL_CHARS - w.length);
        const pos = randInt(maxStart + 1);
        return { cellIdx, pos, word: w };
    });

    // Build token list per cell: alternating garbage / word button
    cells.forEach((c, idx) => {
        const placement = placements.find((p) => p.cellIdx === idx);
        if (!placement) {
            c.tokens = [{ type: 'garbage', text: c.garbage }];
            return;
        }
        const before = c.garbage.slice(0, placement.pos);
        const after = randomGarbage(Math.max(0, CELL_CHARS - placement.pos - placement.word.length));
        c.tokens = [
            { type: 'garbage', text: before },
            { type: 'word', word: placement.word },
            { type: 'garbage', text: after },
        ];
    });

    // address column: pick a base hex address that increments per cell
    const base = 0xF4A0 + randInt(0x100);
    const addrs = cells.map((_, i) => `0x${(base + i * 12).toString(16).toUpperCase().padStart(4, '0')}`);

    return { cells, addrs, secret };
};

const HackMinigame = ({ onWin, onLockout }) => {
    const { cells, addrs, secret } = useMemo(() => buildBoard(hackGame.words), []);
    const [attemptsLeft, setAttemptsLeft] = useState(hackGame.attempts);
    const [guesses, setGuesses] = useState([]); // [{ word, likeness }]
    const [granted, setGranted] = useState(false);
    const winFiredRef = useRef(false);
    const lockoutFiredRef = useRef(false);

    useEffect(() => {
        if (granted && !winFiredRef.current) {
            winFiredRef.current = true;
            onWin();
        }
    }, [granted, onWin]);

    useEffect(() => {
        if (attemptsLeft <= 0 && !granted && !lockoutFiredRef.current) {
            lockoutFiredRef.current = true;
            if (onLockout) onLockout();
        }
    }, [attemptsLeft, granted, onLockout]);

    const handleGuess = (word) => {
        if (granted || attemptsLeft <= 0) return;
        if (guesses.some((g) => g.word === word)) return;
        if (word === secret) {
            setGranted(true);
            setGuesses((prev) => [...prev, { word, likeness: word.length, correct: true }]);
            return;
        }
        const score = likeness(word, secret);
        setGuesses((prev) => [...prev, { word, likeness: score, correct: false }]);
        setAttemptsLeft((n) => Math.max(0, n - 1));
    };

    const attemptsBlocks = Array.from({ length: hackGame.attempts }, (_, i) => (i < attemptsLeft ? '▮' : '▯')).join(' ');

    if (attemptsLeft <= 0 && !granted) {
        // Render nothing — parent shows lockout UI via onLockout.
        return null;
    }

    return (
        <Wrap>
            <GridBlock aria-label="hack-dump">
                {cells.map((cell, idx) => (
                    <Row key={addrs[idx]}>
                        <Addr>{addrs[idx]}</Addr>
                        <Dump>
                            {cell.tokens.map((tok, i) => {
                                if (tok.type === 'garbage') {
                                    return <span key={`g-${idx}-${i}`}>{tok.text}</span>;
                                }
                                const used = guesses.some((g) => g.word === tok.word);
                                return (
                                    <WordButton
                                        key={`w-${idx}-${i}`}
                                        type="button"
                                        onClick={() => handleGuess(tok.word)}
                                        disabled={used || granted}
                                    >
                                        {tok.word}
                                    </WordButton>
                                );
                            })}
                        </Dump>
                    </Row>
                ))}
            </GridBlock>
            <SidePanel>
                <AttemptsLine>ATTEMPTS REMAINING: {attemptsBlocks}</AttemptsLine>
                {granted && <Flash>ACCESS GRANTED</Flash>}
                <Log aria-label="hack-log">
                    {guesses.map((g, i) => (
                        <div key={`${g.word}-${i}`}>
                            <LogLine>{`> ${g.word}`}</LogLine>
                            {g.correct ? (
                                <LogLine>{'> ACCESS GRANTED'}</LogLine>
                            ) : (
                                <>
                                    <LogLine>{'> ENTRY DENIED'}</LogLine>
                                    <LogLine>{`> LIKENESS=${g.likeness}`}</LogLine>
                                </>
                            )}
                        </div>
                    ))}
                </Log>
            </SidePanel>
        </Wrap>
    );
};

HackMinigame.propTypes = {
    onWin: PropTypes.func.isRequired,
    onLockout: PropTypes.func,
};

HackMinigame.defaultProps = {
    onLockout: undefined,
};

export default HackMinigame;
