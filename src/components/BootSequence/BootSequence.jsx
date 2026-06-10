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
        }, 110);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (lineCount >= bootLines.length) {
            const t = setTimeout(finish, 400);
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
                <Line key={i}>{line || ' '}</Line>
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
