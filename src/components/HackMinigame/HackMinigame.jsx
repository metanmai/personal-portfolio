import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const CODE_LENGTH = 5;
const MEMORIZE_SECONDS = 4;
const TOTAL_ATTEMPTS = 3;

const Wrap = styled.div`
    max-width: 540px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1.4rem;
    align-items: center;
    text-align: center;
    width: 100%;
    box-sizing: border-box;
`;

const Caption = styled.div`
    color: var(--dim);
    letter-spacing: 0.18em;
    font-size: 0.95rem;
`;

const CodeDisplay = styled.div`
    color: var(--phosphor);
    font-family: 'VT323', Menlo, Consolas, monospace;
    font-size: clamp(2.4rem, 12vw, 4.2rem);
    letter-spacing: clamp(0.3rem, 3vw, 0.9rem);
    text-shadow: 0 0 14px var(--glow);
    padding: 0.4rem 0;
    word-break: keep-all;
    line-height: 1.1;
`;

const Countdown = styled.div`
    color: var(--dim);
    letter-spacing: 0.15em;
    font-size: 0.95rem;
    min-height: 1.2em;
`;

const EntryForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    width: 100%;
    max-width: 360px;
`;

const Prompt = styled.label`
    color: var(--phosphor);
    letter-spacing: 0.18em;
    font-size: 1rem;
`;

const CodeInput = styled.input`
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font-family: 'VT323', Menlo, Consolas, monospace;
    font-size: clamp(1.6rem, 7vw, 2.4rem);
    letter-spacing: clamp(0.4rem, 3vw, 0.8rem);
    text-align: center;
    text-shadow: 0 0 8px var(--glow);
    padding: 0.4rem 0.8rem;
    width: 100%;
    max-width: 280px;
    box-sizing: border-box;
    outline: none;

    &:focus-visible {
        box-shadow: 0 0 0 2px var(--glow);
    }
`;

const TransmitButton = styled.button`
    background: transparent;
    border: 1px solid var(--phosphor);
    color: var(--phosphor);
    font: inherit;
    text-shadow: inherit;
    padding: 0.5rem 1.4rem;
    letter-spacing: 0.15em;
    cursor: pointer;

    &:hover:not(:disabled), &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
        outline: none;
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const AttemptsLine = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.2em;
    font-size: 0.95rem;
`;

const Mismatch = styled.div`
    color: var(--dim);
    letter-spacing: 0.12em;
    min-height: 1.2em;
    font-size: 0.95rem;
`;

const Granted = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.25em;
    font-size: 1.4rem;
    padding: 0.6rem 0;
    text-shadow: 0 0 12px var(--glow);
`;

const generateCode = () => {
    let code = '';
    for (let i = 0; i < CODE_LENGTH; i += 1) {
        code += String(Math.floor(Math.random() * 10));
    }
    return code;
};

const HackMinigame = ({ onWin, onLockout }) => {
    const [code, setCode] = useState(generateCode);
    const [phase, setPhase] = useState('memorize'); // 'memorize' | 'entry' | 'granted'
    const [secondsLeft, setSecondsLeft] = useState(MEMORIZE_SECONDS);
    const [attemptsLeft, setAttemptsLeft] = useState(TOTAL_ATTEMPTS);
    const [entry, setEntry] = useState('');
    const [mismatch, setMismatch] = useState(false);

    const winFiredRef = useRef(false);
    const lockoutFiredRef = useRef(false);
    const inputRef = useRef(null);

    // Memorize countdown — ticks once per second, switches to entry at 0.
    useEffect(() => {
        if (phase !== 'memorize') return undefined;
        const id = setInterval(() => {
            setSecondsLeft((n) => {
                if (n <= 1) {
                    clearInterval(id);
                    setPhase('entry');
                    return 0;
                }
                return n - 1;
            });
        }, 1000);
        return () => clearInterval(id);
    }, [phase]);

    // Autofocus the input when entering the entry phase.
    useEffect(() => {
        if (phase === 'entry' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [phase]);

    // Fire onWin once when the access is granted.
    useEffect(() => {
        if (phase === 'granted' && !winFiredRef.current) {
            winFiredRef.current = true;
            onWin();
        }
    }, [phase, onWin]);

    // Fire onLockout once when attempts are exhausted.
    useEffect(() => {
        if (attemptsLeft <= 0 && phase !== 'granted' && !lockoutFiredRef.current) {
            lockoutFiredRef.current = true;
            if (onLockout) onLockout();
        }
    }, [attemptsLeft, phase, onLockout]);

    const handleSubmit = useCallback((e) => {
        if (e && typeof e.preventDefault === 'function') e.preventDefault();
        if (phase !== 'entry') return;
        if (entry.length !== CODE_LENGTH) return;
        if (entry === code) {
            setPhase('granted');
            return;
        }
        // Wrong: consume an attempt, refresh the code, go back to memorize.
        const nextAttempts = attemptsLeft - 1;
        setAttemptsLeft(nextAttempts);
        setEntry('');
        setMismatch(true);
        if (nextAttempts > 0) {
            setCode(generateCode());
            setSecondsLeft(MEMORIZE_SECONDS);
            setPhase('memorize');
        }
    }, [phase, entry, code, attemptsLeft]);

    const handleChange = (e) => {
        const next = e.target.value.replace(/\D/g, '').slice(0, CODE_LENGTH);
        setEntry(next);
    };

    // Out of attempts and not granted — Vault renders the lockout UI.
    if (attemptsLeft <= 0 && phase !== 'granted') {
        return null;
    }

    const attemptsBlocks = Array.from({ length: TOTAL_ATTEMPTS }, (_, i) => (i < attemptsLeft ? '▮' : '▯')).join(' ');
    const masked = Array.from({ length: CODE_LENGTH }, () => '█').join(' ');
    const codeDisplay = phase === 'memorize'
        ? code.split('').join(' ')
        : masked;

    return (
        <Wrap>
            <AttemptsLine>{`ATTEMPTS REMAINING: ${attemptsBlocks}`}</AttemptsLine>
            <Caption>INTERCEPTED ACCESS CODE</Caption>
            <CodeDisplay aria-label="intercepted-code">{codeDisplay}</CodeDisplay>
            {phase === 'memorize' && (
                <>
                    <Countdown>{`MEMORIZE — BURNS IN ${secondsLeft} SECONDS`}</Countdown>
                    {mismatch && (
                        <Mismatch>{'> CODE MISMATCH — NEW CODE INTERCEPTED'}</Mismatch>
                    )}
                </>
            )}
            {phase === 'entry' && (
                <EntryForm onSubmit={handleSubmit}>
                    <Prompt htmlFor="access-code-input">ENTER ACCESS CODE:</Prompt>
                    <CodeInput
                        id="access-code-input"
                        ref={inputRef}
                        type="text"
                        inputMode="numeric"
                        autoComplete="off"
                        maxLength={CODE_LENGTH}
                        value={entry}
                        onChange={handleChange}
                        aria-label="access-code"
                    />
                    <TransmitButton
                        type="submit"
                        disabled={entry.length !== CODE_LENGTH}
                    >
                        [ TRANSMIT ]
                    </TransmitButton>
                </EntryForm>
            )}
            {phase === 'granted' && <Granted>ACCESS GRANTED</Granted>}
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
