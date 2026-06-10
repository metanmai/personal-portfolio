import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import { monitor } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useRemoteData } from '../../hooks/useRemoteData.js';
import { useClock } from '../../hooks/useClock.js';
import { useSettings } from '../../settings.jsx';

const Grid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.2rem;

    @media (max-width: 800px) {
        grid-template-columns: 1fr;
    }
`;

const Panel = styled.section`
    border: 1px solid var(--dim);
    padding: 1rem 1.2rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    &.full {
        grid-column: 1 / -1;
    }
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
    letter-spacing: 0.06em;
`;

const Value = styled.span`
    color: var(--phosphor);
`;

const StatusLine = styled.p`
    color: var(--dim);
    margin: 0.4rem 0 0;

    &::before {
        content: '> ';
    }
`;

const InspectLink = styled.a`
    color: var(--dim);
    text-decoration: none;
    margin-top: 0.6rem;
    display: inline-block;
    letter-spacing: 0.06em;

    &:hover,
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        text-shadow: none;
    }
`;

const BarRow = styled.div`
    display: grid;
    grid-template-columns: 5.5em 1fr 4em;
    align-items: baseline;
    gap: 0.8rem;
    font-size: 0.95em;
`;

const BarLabel = styled.span`
    color: var(--dim);
    letter-spacing: 0.06em;
`;

const BarTrack = styled.span`
    color: var(--phosphor);
    overflow: hidden;
    white-space: nowrap;
`;

const BarCount = styled.span`
    color: var(--phosphor);
    text-align: right;
`;

const EPOCH = new Date('2001-01-01T00:00:00Z').getTime();
const pad = (n) => String(n).padStart(2, '0');

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

const BAR_MAX_CELLS = 20;

const renderBar = (count, scale) => {
    if (!scale || scale <= 0) return '';
    const cells = Math.max(0, Math.min(BAR_MAX_CELLS, Math.round((count / scale) * BAR_MAX_CELLS)));
    return '▮'.repeat(cells);
};

const GithubPanel = () => {
    const url = `https://api.github.com/users/${monitor.githubUser}`;
    const { status, data } = useRemoteData(url);

    if (status === 'loading') {
        return (
            <Panel>
                <Title>{'// GITHUB UPLINK'}</Title>
                <StatusLine>POLLING GITHUB RELAY...</StatusLine>
            </Panel>
        );
    }
    if (status === 'failed') {
        return (
            <Panel>
                <Title>{'// GITHUB UPLINK'}</Title>
                <StatusLine>SIGNAL LOST — GITHUB RELAY UNREACHABLE</StatusLine>
            </Panel>
        );
    }

    const repos = (data && typeof data.public_repos === 'number') ? data.public_repos : 0;
    const followers = (data && typeof data.followers === 'number') ? data.followers : 0;
    const memberSince = (data && typeof data.created_at === 'string')
        ? data.created_at.slice(0, 4)
        : '----';
    const profileUrl = (data && typeof data.html_url === 'string')
        ? data.html_url
        : `https://github.com/${monitor.githubUser}`;

    return (
        <Panel>
            <Title>{'// GITHUB UPLINK'}</Title>
            <Row>
                <Label>PUBLIC REPOS</Label>
                <Value>{repos}</Value>
            </Row>
            <Row>
                <Label>FOLLOWERS</Label>
                <Value>{followers}</Value>
            </Row>
            <Row>
                <Label>MEMBER SINCE</Label>
                <Value>{memberSince}</Value>
            </Row>
            <InspectLink href={profileUrl} target="_blank" rel="noopener noreferrer">
                &gt; INSPECT SOURCE [GITHUB PROFILE]
            </InspectLink>
        </Panel>
    );
};

const LeetcodePanel = () => {
    const { status, data } = useRemoteData('/.netlify/functions/get-leetcode-stats');

    if (status === 'loading') {
        return (
            <Panel>
                <Title>{'// LEETCODE GRINDSTONE'}</Title>
                <StatusLine>POLLING LEETCODE RELAY...</StatusLine>
            </Panel>
        );
    }
    if (status === 'failed') {
        return (
            <Panel>
                <Title>{'// LEETCODE GRINDSTONE'}</Title>
                <StatusLine>SIGNAL LOST — LEETCODE RELAY UNREACHABLE</StatusLine>
            </Panel>
        );
    }

    const solved = (data && data.solved) || { easy: 0, medium: 0, hard: 0, total: 0 };
    const ranking = (data && typeof data.ranking === 'number') ? data.ranking : null;
    const scale = Math.max(solved.easy, solved.medium, solved.hard, 1);

    return (
        <Panel>
            <Title>{'// LEETCODE GRINDSTONE'}</Title>
            <BarRow>
                <BarLabel>EASY</BarLabel>
                <BarTrack>{renderBar(solved.easy, scale)}</BarTrack>
                <BarCount>{solved.easy}</BarCount>
            </BarRow>
            <BarRow>
                <BarLabel>MEDIUM</BarLabel>
                <BarTrack>{renderBar(solved.medium, scale)}</BarTrack>
                <BarCount>{solved.medium}</BarCount>
            </BarRow>
            <BarRow>
                <BarLabel>HARD</BarLabel>
                <BarTrack>{renderBar(solved.hard, scale)}</BarTrack>
                <BarCount>{solved.hard}</BarCount>
            </BarRow>
            <Row>
                <Label>TOTAL</Label>
                <Value>{solved.total}</Value>
            </Row>
            <Row>
                <Label>GLOBAL RANK</Label>
                <Value>{ranking != null ? `#${ranking.toLocaleString()}` : 'UNKNOWN'}</Value>
            </Row>
        </Panel>
    );
};

const LocalTelemetryPanel = () => {
    const ctx = useSettings();
    const settings = (ctx && ctx.settings) || { theme: 'amber' };
    const localTime = useClock();
    const [uptime, setUptime] = useState(() => formatUptime(Date.now()));

    useEffect(() => {
        const id = setInterval(() => setUptime(formatUptime(Date.now())), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <Panel className="full">
            <Title>{'// LOCAL TELEMETRY'}</Title>
            <Row>
                <Label>TERMINAL UPTIME</Label>
                <Value>{uptime}</Value>
            </Row>
            <Row>
                <Label>PHOSPHOR</Label>
                <Value>{String(settings.theme).toUpperCase()}</Value>
            </Row>
            <Row>
                <Label>VISITOR LOCAL TIME</Label>
                <Value>{localTime}</Value>
            </Row>
        </Panel>
    );
};

const SystemMonitor = () => {
    usePageMeta('SYSTEM MONITOR', 'Live diagnostics: GitHub uplink, LeetCode grindstone, local telemetry.');

    return (
        <ScreenFrame title="SYSTEM MONITOR">
            <Grid>
                <GithubPanel />
                <LeetcodePanel />
                <LocalTelemetryPanel />
            </Grid>
        </ScreenFrame>
    );
};

export default SystemMonitor;
