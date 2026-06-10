import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import {
    getDeviceSpecLines,
    getRegion,
    getBrowserName,
    padLine,
} from '../../utils/deviceSpecs.js';
import AsciiGlobe from './AsciiGlobe.jsx';

// Boot lines are defined locally — constants/index.js is being restructured
// by another agent. Header lines for stage 1 (UPLINK).
const HEADER_LINES = [
    'TANMAI INDUSTRIES (TM) TERMLINK PROTOCOL',
    'COPYRIGHT 2026 TANMAI INDUSTRIES',
    'ESTABLISHING UPLINK...',
];

const HEADER_INTERVAL_MS = 250;
const REPORT_INTERVAL_MS = 300;
const TYPE_CHAR_MS = 120;
const UPLINK_MIN_MS = 3000;
const IP_TIMEOUT_MS = 3000;
const LOGIN_GRANTED_HOLD_MS = 700;

const reducedMotion = () => {
    try {
        return typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
        return false;
    }
};

const localTime = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
};

const fetchIp = (signal) => fetch('https://api.ipify.org?format=json', { signal })
    .then((r) => r.json())
    .then((j) => (j && typeof j.ip === 'string' && j.ip.length > 0 ? j.ip : 'UNTRACEABLE'))
    .catch(() => 'UNTRACEABLE');

const blink = keyframes`
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
    padding: clamp(14px, 4vw, 56px);
    cursor: default;
`;

const Line = styled.p`
    white-space: pre-wrap;
    min-height: 1em;
    margin: 0;
`;

const Hint = styled.p`
    color: var(--dim);
    margin: 0;
    min-height: 1em;
`;

const Caret = styled.span`
    display: inline-block;
    width: 0.6em;
    animation: ${blink} 1s steps(1) infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        opacity: 1;
    }
`;

const GlobeWrap = styled.div`
    margin: 0.75rem 0;
`;

const GlobeCaption = styled.p`
    color: var(--dim);
    margin: 0.25rem 0 0;
`;

const BootSequence = ({ onDone }) => {
    const [stage, setStage] = useState('uplink'); // 'uplink' | 'report' | 'login' | 'granted'
    const [headerCount, setHeaderCount] = useState(0);
    const [ip, setIp] = useState(null); // null while pending; set when settled
    const [reportLines, setReportLines] = useState([]);
    const [reportCount, setReportCount] = useState(0);
    const [guestTyped, setGuestTyped] = useState('');
    const [grantedShown, setGrantedShown] = useState(false);

    const doneRef = useRef(false);
    const stageRef = useRef('uplink');
    stageRef.current = stage;

    const finish = () => {
        if (!doneRef.current) {
            doneRef.current = true;
            onDone();
        }
    };

    // --- Stage 1: UPLINK ---
    // Type header lines + start IP fetch + enforce 3s minimum.
    useEffect(() => {
        const reduce = reducedMotion();
        const controller = new AbortController();
        let elapsed = false;
        let ipSettled = false;
        let fetchedIp = 'UNTRACEABLE';

        const tryAdvance = () => {
            if (elapsed && ipSettled && stageRef.current === 'uplink') {
                setIp(fetchedIp);
                setStage('report');
            }
        };

        // Header typing
        if (reduce) {
            setHeaderCount(HEADER_LINES.length);
        } else {
            const id = setInterval(() => {
                setHeaderCount((n) => {
                    if (n >= HEADER_LINES.length) {
                        clearInterval(id);
                        return n;
                    }
                    return n + 1;
                });
            }, HEADER_INTERVAL_MS);
            // ensure cleanup on unmount
            // (the interval self-clears at completion, but we still cancel on unmount)
            // store id for cleanup below
            // We attach to controller via abort listener to keep cleanup simple.
            controller.signal.addEventListener('abort', () => clearInterval(id));
        }

        // Minimum stage-1 dwell
        const minTimer = setTimeout(() => {
            elapsed = true;
            tryAdvance();
        }, UPLINK_MIN_MS);

        // IP fetch with timeout
        const timeoutTimer = setTimeout(() => controller.abort(), IP_TIMEOUT_MS);
        fetchIp(controller.signal).then((result) => {
            fetchedIp = result;
            ipSettled = true;
            clearTimeout(timeoutTimer);
            tryAdvance();
        });

        return () => {
            controller.abort();
            clearTimeout(minTimer);
            clearTimeout(timeoutTimer);
        };
    }, []);

    // --- Stage 2: REPORT ---
    // Build the visitor report lines once IP is known, then type them out.
    useEffect(() => {
        if (stage !== 'report') return undefined;
        const lines = [
            padLine('NODE ADDR', ip || 'UNTRACEABLE'),
            padLine('REGION', getRegion()),
            padLine('BROWSER', getBrowserName()),
            ...getDeviceSpecLines(),
            padLine('LOCAL TIME', localTime()),
        ];
        setReportLines(lines);

        const reduce = reducedMotion();
        if (reduce) {
            setReportCount(lines.length);
            // brief beat then advance to login
            const t = setTimeout(() => setStage('login'), 300);
            return () => clearTimeout(t);
        }

        let i = 0;
        setReportCount(0);
        const id = setInterval(() => {
            i += 1;
            setReportCount(i);
            if (i >= lines.length) {
                clearInterval(id);
                // small beat after report finishes
                setTimeout(() => {
                    if (stageRef.current === 'report') setStage('login');
                }, 400);
            }
        }, REPORT_INTERVAL_MS);
        return () => clearInterval(id);
    }, [stage, ip]);

    // --- Stage 3: LOGIN ---
    // Any keydown or click/tap triggers the fake-type then grant.
    useEffect(() => {
        if (stage !== 'login') return undefined;

        const startLogin = () => {
            if (stageRef.current !== 'login') return;
            setStage('granted');
        };

        const onKey = () => startLogin();
        const onPointer = () => startLogin();

        window.addEventListener('keydown', onKey);
        window.addEventListener('click', onPointer);
        window.addEventListener('touchstart', onPointer);
        return () => {
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('click', onPointer);
            window.removeEventListener('touchstart', onPointer);
        };
    }, [stage]);

    // --- Stage 4 (granted): fake-type GUEST, then ACCESS LEVEL line, then onDone.
    useEffect(() => {
        if (stage !== 'granted') return undefined;
        const reduce = reducedMotion();
        const target = 'GUEST';
        setGuestTyped('');
        setGrantedShown(false);

        const timeouts = [];
        const intervals = [];

        const finishGranted = () => {
            setGrantedShown(true);
            const t = setTimeout(finish, LOGIN_GRANTED_HOLD_MS);
            timeouts.push(t);
        };

        if (reduce) {
            setGuestTyped(target);
            finishGranted();
        } else {
            let i = 0;
            const id = setInterval(() => {
                i += 1;
                setGuestTyped(target.slice(0, i));
                if (i >= target.length) {
                    clearInterval(id);
                    finishGranted();
                }
            }, TYPE_CHAR_MS);
            intervals.push(id);
        }

        return () => {
            intervals.forEach(clearInterval);
            timeouts.forEach(clearTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stage]);

    const renderedHeader = HEADER_LINES.slice(0, headerCount);
    const renderedReport = reportLines.slice(0, reportCount);

    return (
        <Screen role="status" aria-label="Terminal login sequence">
            {renderedHeader.map((line, i) => (
                <Line key={`h-${i}`}>{line || ' '}</Line>
            ))}

            {stage === 'uplink' && (
                <GlobeWrap>
                    <AsciiGlobe />
                    <GlobeCaption>ROUTING THROUGH RELAY GRID...</GlobeCaption>
                </GlobeWrap>
            )}

            {stage !== 'uplink' && (
                <>
                    {/* Globe stays visible at top once report begins (kept spinning) */}
                    <GlobeWrap>
                        <AsciiGlobe />
                    </GlobeWrap>
                    {renderedReport.map((line, i) => (
                        <Line key={`r-${i}`}>{line || ' '}</Line>
                    ))}
                </>
            )}

            {(stage === 'login' || stage === 'granted') && reportCount >= reportLines.length && (
                <>
                    <Line>{' '}</Line>
                    {stage === 'login' && (
                        <>
                            <Line>
                                {'IDENTIFY USER: '}
                                <Caret>█</Caret>
                            </Line>
                            <Hint>[ PRESS ANY KEY TO LOG IN AS GUEST ]</Hint>
                        </>
                    )}
                    {stage === 'granted' && (
                        <>
                            <Line>
                                {`IDENTIFY USER: ${guestTyped}`}
                                <Caret>█</Caret>
                            </Line>
                            {grantedShown && (
                                <Line>{'ACCESS LEVEL: VISITOR ......... GRANTED'}</Line>
                            )}
                        </>
                    )}
                </>
            )}
        </Screen>
    );
};

BootSequence.propTypes = {
    onDone: PropTypes.func.isRequired,
};

export default BootSequence;
