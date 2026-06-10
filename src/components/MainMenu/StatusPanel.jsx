import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { diagnostics } from '../../constants/index.js';
import { useSettings } from '../../settings.jsx';

const Panel = styled.aside`
    border: 1px solid var(--dim);
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
`;

const Title = styled.div`
    color: var(--dim);
    letter-spacing: 0.18em;
    border-bottom: 1px solid var(--dim);
    padding-bottom: 0.4rem;
    margin-bottom: 0.4rem;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    font-size: 0.95em;
`;

const Label = styled.span`
    color: var(--dim);
`;

const Value = styled.span`
    color: var(--phosphor);
`;

const Dot = styled.span`
    color: var(--phosphor);
    margin-right: 0.4rem;
    animation: dot-blink 1s steps(1) infinite;

    @keyframes dot-blink {
        50% { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Ticker = styled.div`
    margin-top: 0.8rem;
    padding-top: 0.6rem;
    border-top: 1px solid var(--dim);
    color: var(--phosphor);
    min-height: 1.4em;
    font-size: 0.95em;
`;

const TickerLabel = styled.div`
    color: var(--dim);
    letter-spacing: 0.18em;
    margin-bottom: 0.3rem;
    font-size: 0.85em;
`;

const EPOCH = new Date('2001-01-01T00:00:00Z').getTime();
const pad = (n) => String(n).padStart(2, '0');

const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const formatUptime = (now) => {
    let diffSeconds = Math.max(0, Math.floor((now - EPOCH) / 1000));
    const secondsPerYear = 365.25 * 24 * 3600;
    const years = Math.floor(diffSeconds / secondsPerYear);
    diffSeconds -= Math.floor(years * secondsPerYear);
    const days = Math.floor(diffSeconds / (24 * 3600));
    diffSeconds -= days * 24 * 3600;
    const hh = Math.floor(diffSeconds / 3600);
    diffSeconds -= hh * 3600;
    const mm = Math.floor(diffSeconds / 60);
    const ss = diffSeconds - mm * 60;
    return `${years}Y ${days}D ${pad(hh)}:${pad(mm)}:${pad(ss)}`;
};

const StatusPanel = () => {
    const ctx = useSettings();
    const settings = (ctx && ctx.settings) || { theme: 'amber' };
    const [now, setNow] = useState(() => new Date());
    const [diagIndex, setDiagIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const id = setInterval(() => {
            setDiagIndex((i) => (i + 1) % diagnostics.length);
        }, 2500);
        return () => clearInterval(id);
    }, []);

    return (
        <Panel>
            <Title>{'// SYSTEM STATUS'}</Title>
            <Row>
                <Label>STATUS</Label>
                <Value><Dot>●</Dot>ONLINE</Value>
            </Row>
            <Row>
                <Label>LOCAL TIME</Label>
                <Value>{formatTime(now)}</Value>
            </Row>
            <Row>
                <Label>UPTIME</Label>
                <Value>{formatUptime(now.getTime())}</Value>
            </Row>
            <Row>
                <Label>PHOSPHOR</Label>
                <Value>{String(settings.theme).toUpperCase()}</Value>
            </Row>
            <Row>
                <Label>SIGNAL</Label>
                <Value>▮▮▮▮░</Value>
            </Row>
            <Row>
                <Label>NODE</Label>
                <Value>MAIN-01</Value>
            </Row>
            <Ticker>
                <TickerLabel>{'// DIAGNOSTICS'}</TickerLabel>
                &gt; {diagnostics[diagIndex]}
            </Ticker>
        </Panel>
    );
};

export default StatusPanel;
