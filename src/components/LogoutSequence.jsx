import { useEffect, useRef, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import PropTypes from 'prop-types';
import { reducedMotion } from '../utils/reducedMotion.js';

// Terminal-style shutdown shown when an operator logs out. Reveals a short
// teardown log line-by-line, holds, blinks the screen, then hands control
// back to the caller (which performs the actual reload).
const LINES = [
    'TERMINATING SESSION...',
    'REVOKING CLEARANCE ............. OK',
    'FLUSHING OPERATOR CACHE ........ OK',
    'CLOSING UPLINK ................. OK',
    'PURGING SESSION KEY ............ OK',
    '',
    'SIGNAL LOST.',
];

const LINE_INTERVAL_MS = 260;
const HOLD_MS = 650;
const BLINK_MS = 250;
const REDUCED_HOLD_MS = 500;

const screenBlink = keyframes`
    0%   { opacity: 1; }
    20%  { opacity: 0; }
    40%  { opacity: 1; }
    60%  { opacity: 0; }
    100% { opacity: 0; }
`;

const caretBlink = keyframes`
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
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

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: auto;
`;

const Line = styled.p`
    white-space: pre-wrap;
    min-height: 1em;
    margin: 0;
    visibility: ${({ $hidden }) => ($hidden ? 'hidden' : 'visible')};
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

const LogoutSequence = ({ onDone }) => {
    const [lineCount, setLineCount] = useState(0);
    const [blink, setBlink] = useState(false);
    const doneRef = useRef(false);

    useEffect(() => {
        const finish = () => {
            if (doneRef.current) return;
            doneRef.current = true;
            onDone();
        };

        if (reducedMotion()) {
            setLineCount(LINES.length);
            const t = setTimeout(finish, REDUCED_HOLD_MS);
            return () => clearTimeout(t);
        }

        const timers = [];
        const lineId = setInterval(() => {
            setLineCount((n) => {
                if (n >= LINES.length) {
                    clearInterval(lineId);
                    return n;
                }
                return n + 1;
            });
        }, LINE_INTERVAL_MS);
        timers.push(lineId);

        const revealDone = LINES.length * LINE_INTERVAL_MS;
        timers.push(setTimeout(() => setBlink(true), revealDone + HOLD_MS));
        timers.push(setTimeout(finish, revealDone + HOLD_MS + BLINK_MS));

        return () => {
            clearInterval(lineId);
            timers.forEach(clearTimeout);
        };
    }, [onDone]);

    return (
        <Screen role="status" aria-label="Logging out" $blink={blink}>
            <Column>
                {LINES.map((line, i) => (
                    <Line key={`logout-${i}`} $hidden={i >= lineCount}>
                        {line || ' '}
                    </Line>
                ))}
                <Line aria-hidden="true">
                    <Caret>█</Caret>
                </Line>
            </Column>
        </Screen>
    );
};

LogoutSequence.propTypes = {
    onDone: PropTypes.func.isRequired,
};

export default LogoutSequence;
