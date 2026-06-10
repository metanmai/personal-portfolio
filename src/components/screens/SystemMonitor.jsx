import { useEffect, useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
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
    min-width: 0;

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
    grid-template-columns: 5.5em 1fr 6.5em;
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
    letter-spacing: 0.05em;
`;

const BarDim = styled.span`
    color: var(--dim);
`;

const BarCount = styled.span`
    color: var(--phosphor);
    text-align: right;
`;

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.4rem 1.4rem;

    @media (max-width: 700px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
`;

// Heatmap layout. Cells are CSS grid items in column-major order, so we
// declare 7 rows (Sun..Sat) and let the columns extend as data demands.
// On mobile we scroll horizontally — page never gets wider than viewport.
const MatrixScroll = styled.div`
    overflow-x: auto;
    overflow-y: hidden;
    max-width: 100%;
    padding-bottom: 0.2rem;
`;

const Matrix = styled.div`
    display: grid;
    grid-auto-flow: column;
    grid-template-rows: repeat(7, 10px);
    grid-auto-columns: 10px;
    gap: 2px;
    width: max-content;

    @media (max-width: 700px) {
        grid-template-rows: repeat(7, 9px);
        grid-auto-columns: 9px;
    }
`;

const Cell = styled.span`
    display: block;
    width: 100%;
    height: 100%;
    background: color-mix(in srgb, var(--phosphor) var(--cell-pct), transparent);
    border-radius: 1px;
`;

const MatrixCaption = styled.div`
    color: var(--dim);
    letter-spacing: 0.14em;
    font-size: 0.85em;
    margin-top: 0.6rem;
`;

const LegendRow = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.1em;
    margin-top: 0.4rem;
`;

const LegendCells = styled.div`
    display: inline-grid;
    grid-auto-flow: column;
    grid-auto-columns: 10px;
    grid-template-rows: 10px;
    gap: 2px;
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

// Level → opacity percent used by the heatmap CSS var.
const LEVEL_PCT = ['7%', '25%', '45%', '70%', '100%'];

const levelPct = (level) => {
    const idx = Math.max(0, Math.min(4, Math.floor(level)));
    return LEVEL_PCT[idx];
};

// Fill `solved` ▮ cells, then pad with dim ░ cells. Bar always BAR_MAX_CELLS wide.
const renderProportionalBar = (solved, total) => {
    if (!total || total <= 0) {
        return { filled: '', empty: '░'.repeat(BAR_MAX_CELLS) };
    }
    const ratio = Math.max(0, Math.min(1, solved / total));
    const filled = Math.round(ratio * BAR_MAX_CELLS);
    const empty = BAR_MAX_CELLS - filled;
    return { filled: '▮'.repeat(filled), empty: '░'.repeat(empty) };
};

// Legacy fallback when the deployed function hasn't been updated with totals.
const renderScaledBar = (count, scale) => {
    if (!scale || scale <= 0) return { filled: '', empty: '░'.repeat(BAR_MAX_CELLS) };
    const cells = Math.max(0, Math.min(BAR_MAX_CELLS, Math.round((count / scale) * BAR_MAX_CELLS)));
    return { filled: '▮'.repeat(cells), empty: '░'.repeat(BAR_MAX_CELLS - cells) };
};

const MOBILE_WEEKS = 20;

// Lay out contributions in column-major (week) order. Each cell receives a
// gridRow = day-of-week (1..7) so a partial trailing week still aligns to
// the correct weekday rows.
const buildMatrix = (contributions) => {
    if (!Array.isArray(contributions) || contributions.length === 0) return [];
    const cells = contributions.map((entry) => {
        const date = new Date(`${entry.date}T00:00:00Z`);
        // getUTCDay returns 0 = Sunday, matching how GitHub lays out the chart.
        const dayRow = date.getUTCDay() + 1; // 1..7 for CSS grid-row
        return {
            date: entry.date,
            count: entry.count,
            level: typeof entry.level === 'number' ? entry.level : 0,
            row: dayRow,
        };
    });
    return cells;
};

const ContributionHeatmap = ({ contributions, total }) => {
    const cells = buildMatrix(contributions);
    const [isNarrow, setIsNarrow] = useState(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false;
        return window.matchMedia('(max-width: 700px)').matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return undefined;
        const mql = window.matchMedia('(max-width: 700px)');
        const onChange = (e) => setIsNarrow(e.matches);
        if (mql.addEventListener) {
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        }
        mql.addListener(onChange);
        return () => mql.removeListener(onChange);
    }, []);

    // On mobile, trim to the most recent ~20 weeks to keep cells tappable-size
    // without forcing huge horizontal scroll. We trim by date — the matrix
    // remains column-major so the trailing partial week is preserved.
    let visible = cells;
    if (isNarrow && cells.length > MOBILE_WEEKS * 7) {
        visible = cells.slice(cells.length - MOBILE_WEEKS * 7);
    }

    return (
        <div>
            <MatrixCaption>{'// CONTRIBUTION MATRIX — LAST 365 DAYS'}</MatrixCaption>
            <MatrixScroll>
                <Matrix role="img" aria-label={`GitHub contribution heatmap, ${total} contributions in the last year`}>
                    {visible.map((cell) => (
                        <Cell
                            key={cell.date}
                            style={{ gridRow: cell.row, '--cell-pct': levelPct(cell.level) }}
                            title={`${cell.date} — ${cell.count} contributions`}
                        />
                    ))}
                </Matrix>
            </MatrixScroll>
            <LegendRow>
                <span>LESS</span>
                <LegendCells>
                    {[0, 1, 2, 3, 4].map((lvl) => (
                        <Cell key={lvl} style={{ '--cell-pct': levelPct(lvl) }} />
                    ))}
                </LegendCells>
                <span>MORE</span>
            </LegendRow>
            <StatusLine>
                {total} TRANSMISSIONS LOGGED IN THE LAST YEAR
            </StatusLine>
        </div>
    );
};

ContributionHeatmap.propTypes = {
    contributions: PropTypes.arrayOf(PropTypes.shape({
        date: PropTypes.string.isRequired,
        count: PropTypes.number,
        level: PropTypes.number,
    })).isRequired,
    total: PropTypes.number.isRequired,
};

// Aggregates star count + primary language across repos. Failure is silent
// (returns null) so the GitHub panel still renders without these rows.
const useGithubRepoAggregates = (user) => {
    const url = `https://api.github.com/users/${user}/repos?per_page=100&sort=updated`;
    const { status, data } = useRemoteData(url);

    if (status !== 'ready' || !Array.isArray(data)) {
        return { ready: false, totalStars: 0, topLanguage: null };
    }

    let totalStars = 0;
    const langCounts = {};
    data.forEach((repo) => {
        if (repo && typeof repo.stargazers_count === 'number') {
            totalStars += repo.stargazers_count;
        }
        if (repo && typeof repo.language === 'string' && repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
        }
    });

    let topLanguage = null;
    let topCount = 0;
    Object.keys(langCounts).forEach((lang) => {
        if (langCounts[lang] > topCount) {
            topCount = langCounts[lang];
            topLanguage = lang;
        }
    });

    return { ready: true, totalStars, topLanguage };
};

const GithubPanel = () => {
    const userUrl = `https://api.github.com/users/${monitor.githubUser}`;
    const { status: userStatus, data: userData } = useRemoteData(userUrl);
    const contribUrl = `https://github-contributions-api.jogruber.de/v4/${monitor.githubUser}?y=last`;
    const { status: contribStatus, data: contribData } = useRemoteData(contribUrl);
    const repoAggregates = useGithubRepoAggregates(monitor.githubUser);

    if (userStatus === 'loading' || contribStatus === 'loading') {
        return (
            <Panel className="full">
                <Title>{'// GITHUB UPLINK'}</Title>
                <StatusLine>POLLING GITHUB RELAY...</StatusLine>
            </Panel>
        );
    }
    if (userStatus === 'failed' && contribStatus === 'failed') {
        return (
            <Panel className="full">
                <Title>{'// GITHUB UPLINK'}</Title>
                <StatusLine>SIGNAL LOST — GITHUB RELAY UNREACHABLE</StatusLine>
            </Panel>
        );
    }

    const repos = (userData && typeof userData.public_repos === 'number') ? userData.public_repos : 0;
    const followers = (userData && typeof userData.followers === 'number') ? userData.followers : 0;
    const memberSince = (userData && typeof userData.created_at === 'string')
        ? userData.created_at.slice(0, 4)
        : '----';
    const profileUrl = (userData && typeof userData.html_url === 'string')
        ? userData.html_url
        : `https://github.com/${monitor.githubUser}`;

    const contributions = (contribData && Array.isArray(contribData.contributions))
        ? contribData.contributions
        : [];
    const totalYear = (contribData && contribData.total && typeof contribData.total.lastYear === 'number')
        ? contribData.total.lastYear
        : 0;

    return (
        <Panel className="full">
            <Title>{'// GITHUB UPLINK'}</Title>
            <StatGrid>
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
                {repoAggregates.ready && (
                    <Row>
                        <Label>TOTAL STARS</Label>
                        <Value>{repoAggregates.totalStars}</Value>
                    </Row>
                )}
                {repoAggregates.ready && repoAggregates.topLanguage && (
                    <Row>
                        <Label>PRIMARY LANG</Label>
                        <Value>{String(repoAggregates.topLanguage).toUpperCase()}</Value>
                    </Row>
                )}
            </StatGrid>
            {contribStatus === 'ready' && contributions.length > 0 ? (
                <ContributionHeatmap contributions={contributions} total={totalYear} />
            ) : (
                <StatusLine>CONTRIBUTION RELAY UNREACHABLE</StatusLine>
            )}
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
    const totals = (data && data.totals) || null;
    const ranking = (data && typeof data.ranking === 'number') ? data.ranking : null;

    // If we got per-difficulty totals from the function, render proportional
    // solved/available bars. Otherwise fall back to the older max-solved scale
    // so a stale deployed function still produces a readable card.
    const hasTotals = totals
        && typeof totals.easy === 'number'
        && typeof totals.medium === 'number'
        && typeof totals.hard === 'number'
        && totals.easy + totals.medium + totals.hard > 0;

    const bar = (count, total, scale) => (hasTotals
        ? renderProportionalBar(count, total)
        : renderScaledBar(count, scale));

    const fallbackScale = Math.max(solved.easy, solved.medium, solved.hard, 1);
    const easyBar = bar(solved.easy, hasTotals ? totals.easy : 0, fallbackScale);
    const medBar = bar(solved.medium, hasTotals ? totals.medium : 0, fallbackScale);
    const hardBar = bar(solved.hard, hasTotals ? totals.hard : 0, fallbackScale);

    const allTotal = hasTotals && typeof totals.all === 'number' ? totals.all : 0;
    const completionPct = (hasTotals && allTotal > 0)
        ? ((solved.total / allTotal) * 100).toFixed(1)
        : null;

    return (
        <Panel>
            <Title>{'// LEETCODE GRINDSTONE'}</Title>
            <BarRow>
                <BarLabel>EASY</BarLabel>
                <BarTrack>
                    {easyBar.filled}
                    <BarDim>{easyBar.empty}</BarDim>
                </BarTrack>
                <BarCount>
                    {solved.easy}
                    {hasTotals ? `/${totals.easy}` : ''}
                </BarCount>
            </BarRow>
            <BarRow>
                <BarLabel>MEDIUM</BarLabel>
                <BarTrack>
                    {medBar.filled}
                    <BarDim>{medBar.empty}</BarDim>
                </BarTrack>
                <BarCount>
                    {solved.medium}
                    {hasTotals ? `/${totals.medium}` : ''}
                </BarCount>
            </BarRow>
            <BarRow>
                <BarLabel>HARD</BarLabel>
                <BarTrack>
                    {hardBar.filled}
                    <BarDim>{hardBar.empty}</BarDim>
                </BarTrack>
                <BarCount>
                    {solved.hard}
                    {hasTotals ? `/${totals.hard}` : ''}
                </BarCount>
            </BarRow>
            <Row>
                <Label>TOTAL SOLVED</Label>
                <Value>
                    {solved.total}
                    {hasTotals ? ` / ${allTotal}` : ''}
                </Value>
            </Row>
            <Row>
                <Label>GLOBAL RANK</Label>
                <Value>{ranking != null ? `#${ranking.toLocaleString()}` : 'UNKNOWN'}</Value>
            </Row>
            {completionPct != null && (
                <Row>
                    <Label>COMPLETION</Label>
                    <Value>{`${completionPct}%`}</Value>
                </Row>
            )}
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
        <Panel>
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
