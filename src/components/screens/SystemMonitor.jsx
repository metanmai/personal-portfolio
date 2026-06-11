import { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import ScreenFrame from './ScreenFrame.jsx';
import { monitor, surveillance, recreation, fallback } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useRemoteData } from '../../hooks/useRemoteData.js';
import { reducedMotion } from '../../utils/reducedMotion.js';

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
    const gh = fallback.github;
    const userOk = userData && typeof userData.public_repos === 'number';
    const repos = userOk ? userData.public_repos : gh.repos;
    const followers = (userData && typeof userData.followers === 'number') ? userData.followers : gh.followers;
    const memberSince = (userData && typeof userData.created_at === 'string')
        ? userData.created_at.slice(0, 4)
        : gh.memberSince;
    const profileUrl = (userData && typeof userData.html_url === 'string')
        ? userData.html_url
        : `https://github.com/${monitor.githubUser}`;
    const totalStars = repoAggregates.ready ? repoAggregates.totalStars : gh.totalStars;
    const topLanguage = (repoAggregates.ready && repoAggregates.topLanguage)
        ? repoAggregates.topLanguage
        : gh.topLanguage;

    const contributions = (contribData && Array.isArray(contribData.contributions))
        ? contribData.contributions
        : [];
    const totalYear = (contribData && contribData.total && typeof contribData.total.lastYear === 'number')
        ? contribData.total.lastYear
        : 0;

    // Nothing live came back — render the archived readout rather than a dead line.
    const offline = userStatus === 'failed' && contribStatus === 'failed' && !repoAggregates.ready;

    return (
        <Panel className="full">
            <Title>{'// GITHUB UPLINK'}</Title>
            {offline && <StatusLine>RELAY OFFLINE · LAST KNOWN READOUT</StatusLine>}
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
                <Row>
                    <Label>TOTAL STARS</Label>
                    <Value>{totalStars}</Value>
                </Row>
                {topLanguage && (
                    <Row>
                        <Label>PRIMARY LANG</Label>
                        <Value>{String(topLanguage).toUpperCase()}</Value>
                    </Row>
                )}
            </StatGrid>
            {contribStatus === 'ready' && contributions.length > 0 ? (
                <ContributionHeatmap contributions={contributions} total={totalYear} />
            ) : (
                <StatusLine>{`${gh.contributions} TRANSMISSIONS LOGGED (ARCHIVED)`}</StatusLine>
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
            <Panel className="full">
                <Title>{'// LEETCODE GRINDSTONE'}</Title>
                <StatusLine>POLLING LEETCODE RELAY...</StatusLine>
            </Panel>
        );
    }
    // On failure, fall back to an archived readout instead of a dead line.
    const live = status === 'ready' && data;
    const offline = !live;
    const src = live ? data : fallback.leetcode;

    const solved = (src && src.solved) || { easy: 0, medium: 0, hard: 0, total: 0 };
    const totals = (src && src.totals) || null;
    const ranking = (src && typeof src.ranking === 'number') ? src.ranking : null;

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
        <Panel className="full">
            <Title>{'// LEETCODE GRINDSTONE'}</Title>
            {offline && <StatusLine>RELAY OFFLINE · LAST KNOWN READOUT</StatusLine>}
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

// --- SUBJECT VITALS (biometric surveillance flavor) -----------------------

const heartbeat = keyframes`
    0%, 100% { transform: scale(1); filter: brightness(1); }
    18%      { transform: scale(1.35); filter: brightness(1.5); }
    32%      { transform: scale(1); filter: brightness(1); }
`;

const Heart = styled.span`
    color: var(--phosphor);
    margin-right: 0.45em;
    display: inline-block;
    animation: ${heartbeat} 0.85s ease-in-out infinite;

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const Bpm = styled.span`
    color: var(--phosphor);
    font-size: 1.15em;
    letter-spacing: 0.04em;
`;

const EcgStrip = styled.div`
    margin-top: 0.6rem;
    border: 1px solid var(--dim);
    overflow: hidden;
    width: fit-content;
    max-width: 100%;
    padding: 0.4rem 0.55rem;
`;

// The trace is a small multi-row line plot drawn with box-drawing glyphs
// (│ verticals, ─ flats). A monospace stack that carries them at a uniform
// width keeps the grid aligned; line-height 1 lets verticals join cleanly.
const EcgLine = styled.pre`
    margin: 0;
    font-family: Menlo, Consolas, 'Courier New', monospace;
    font-size: 0.8em;
    line-height: 1;
    letter-spacing: 0;
    white-space: pre;
    color: var(--phosphor);
    text-shadow: 0 0 6px var(--glow);
`;


const pickRandom = (list) => list[Math.floor(Math.random() * list.length)];

// Live ECG: a scrolling buffer of amplitude levels (0 = bottom row). The trace
// rests at ECG_BASELINE and a PQRST beat is injected periodically, its cadence
// tied loosely to the current BPM. Rendered as a multi-row line plot so the
// QRS actually spikes above a flat baseline instead of looking like bars.
const ECG_ROWS = 5;
const ECG_COLS = 72;
const ECG_TICK_MS = 55;
const ECG_BASELINE = 1;
//                 P  P  -  Q  R  S  -  T  T  T  -
const ECG_BEAT = [2, 2, 1, 0, 4, 0, 1, 2, 3, 2, 1];

// Turn the level buffer into ECG_ROWS lines. A flat run draws '─'; a single-step
// change draws a diagonal ('╱' rising, '╲' falling) so the gentle P/T waves
// slope; a steep change (the QRS) fills the spanned rows with '│' as a sharp
// spike. Together they read as a connected ECG trace.
const renderEcg = (buf) => {
    const grid = [];
    for (let r = 0; r < ECG_ROWS; r += 1) {
        grid.push(new Array(ECG_COLS).fill(' '));
    }
    const rowOf = (lv) => (ECG_ROWS - 1) - lv;
    for (let c = 0; c < ECG_COLS; c += 1) {
        const b = buf[c];
        const a = c > 0 ? buf[c - 1] : buf[c];
        const lo = Math.min(a, b);
        const hi = Math.max(a, b);
        if (a === b) {
            grid[rowOf(b)][c] = '─';
        } else if (hi - lo === 1) {
            grid[rowOf(hi)][c] = b > a ? '╱' : '╲';
        } else {
            for (let lv = lo; lv <= hi; lv += 1) {
                grid[rowOf(lv)][c] = '│';
            }
        }
    }
    return grid.map((row) => row.join('')).join('\n');
};

const EcgMonitor = ({ bpm }) => {
    const [frame, setFrame] = useState(() => renderEcg(new Array(ECG_COLS).fill(ECG_BASELINE)));
    const bufRef = useRef(null);
    const tRef = useRef(0);
    const beatStartRef = useRef(null);
    const nextBeatRef = useRef(6);
    const bpmRef = useRef(bpm);

    if (bufRef.current === null) {
        bufRef.current = new Array(ECG_COLS).fill(ECG_BASELINE);
    }

    useEffect(() => {
        bpmRef.current = bpm;
    }, [bpm]);

    useEffect(() => {
        if (reducedMotion()) return undefined;
        const id = setInterval(() => {
            const t = tRef.current;
            let v = ECG_BASELINE;
            // continue an in-progress beat
            if (beatStartRef.current !== null) {
                const k = t - beatStartRef.current;
                if (k < ECG_BEAT.length) {
                    v = ECG_BEAT[k];
                } else {
                    beatStartRef.current = null;
                }
            }
            // otherwise start one when due
            if (beatStartRef.current === null && t >= nextBeatRef.current) {
                beatStartRef.current = t;
                v = ECG_BEAT[0];
                const period = Math.max(
                    ECG_BEAT.length + 6,
                    Math.round((60 / bpmRef.current) / (ECG_TICK_MS / 1000)),
                );
                nextBeatRef.current = t + period;
            }
            const buf = bufRef.current;
            buf.shift();
            buf.push(v);
            setFrame(renderEcg(buf));
            tRef.current = t + 1;
        }, ECG_TICK_MS);
        return () => clearInterval(id);
    }, []);

    return (
        <EcgStrip aria-hidden="true">
            <EcgLine>{frame}</EcgLine>
        </EcgStrip>
    );
};

EcgMonitor.propTypes = { bpm: PropTypes.number.isRequired };

const HR_MIN = 58;
const HR_MAX = 98;

const BiometricPanel = () => {
    const baseline = (surveillance && surveillance.heartRateBaseline) || 72;
    const [bpm, setBpm] = useState(baseline);
    // last meal + last position are sampled ONCE per visit (per mount)
    const [meal] = useState(() => pickRandom(surveillance.meals));
    const [position] = useState(() => pickRandom(surveillance.locations));

    useEffect(() => {
        if (reducedMotion()) return undefined;
        const id = setInterval(() => {
            setBpm((prev) => {
                // gentle ±1-2 wander, biased back toward baseline at the edges
                const step = 1 + Math.floor(Math.random() * 2); // 1 or 2
                let dir = Math.random() < 0.5 ? -1 : 1;
                if (prev >= baseline + 8) dir = -1;
                else if (prev <= baseline - 8) dir = 1;
                const next = prev + dir * step;
                return Math.max(HR_MIN, Math.min(HR_MAX, next));
            });
        }, 3200);
        return () => clearInterval(id);
    }, [baseline]);

    let cardiacState = 'NOMINAL';
    if (bpm >= 88) cardiacState = 'ELEVATED';
    else if (bpm <= 64) cardiacState = 'RESTING';

    return (
        <Panel className="full">
            <Title>{'// SUBJECT VITALS'}</Title>
            <Row>
                <Label>CARDIAC SIGNAL</Label>
                <Value>
                    <Heart aria-hidden="true">♥</Heart>
                    <Bpm>{bpm} BPM</Bpm>
                </Value>
            </Row>
            <EcgMonitor bpm={bpm} />
            <Row>
                <Label>RHYTHM</Label>
                <Value>{cardiacState}</Value>
            </Row>
            <Row>
                <Label>LAST MEAL INTAKE</Label>
                <Value>{meal}</Value>
            </Row>
            <Row>
                <Label>LAST KNOWN POSITION</Label>
                <Value>{position}</Value>
            </Row>
            <StatusLine>BIOMETRIC FEED LIVE — SUBJECT UNAWARE</StatusLine>
        </Panel>
    );
};

// --- INTERCEPTED ACTIVITY FEEDS (games + music) ---------------------------

const FeedList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.4rem 0 0;
`;

// Detailed, paginated feed row: cover + a stacked text block.
const DetailRow = styled.li`
    border-top: 1px solid var(--dim);

    &:first-child {
        border-top: none;
    }
`;

// The whole row is the link (cover + text), not just the thumbnail.
const RowLink = styled.a`
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0.7rem 0.3rem;
    text-decoration: none;
    color: var(--phosphor);

    &:hover, &:focus-visible {
        background: color-mix(in srgb, var(--phosphor) 12%, transparent);
        outline: none;
    }

    &:hover img, &:focus-visible img {
        filter: none;
        mix-blend-mode: normal;
    }
`;

const DetailText = styled.div`
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
`;

const DetailName = styled.div`
    color: var(--phosphor);
    letter-spacing: 0.04em;
`;

const DetailSub = styled.div`
    color: var(--phosphor);
    opacity: 0.85;
    font-size: 0.95em;
`;

const DetailMeta = styled.div`
    color: var(--dim);
    font-size: 0.85em;
    letter-spacing: 0.04em;
`;

// CRT-treated cover art: grayscale + multiply over a phosphor swatch so the
// thumbnail reads in the terminal's monochrome palette.
const Cover = styled.span`
    flex: 0 0 auto;
    display: inline-block;
    line-height: 0;
    overflow: hidden;
    background: var(--phosphor);
    border: 1px solid var(--dim);
    width: ${({ $w }) => $w}px;
    height: ${({ $h }) => $h}px;

    img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
        filter: grayscale(1) contrast(1.05);
        mix-blend-mode: multiply;
    }
`;


// Always resolves to a link: the app's store page when we have an appid,
// otherwise a Steam store search by name (so offline/fallback rows stay
// clickable too, mirroring appleMusicSearch in the audio log).
const steamStoreUrl = (game) => (game.appid
    ? `https://store.steampowered.com/app/${game.appid}`
    : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.name || '')}`);

const SubLine = styled.p`
    margin: 0 0 0.2rem;

    & > span {
        color: var(--dim);
        letter-spacing: 0.06em;
    }
`;

const relativeTime = (uts) => {
    if (!uts) return '';
    const diffSec = Math.max(0, Math.floor(Date.now() / 1000 - uts));
    if (diffSec < 60) return 'JUST NOW';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} MIN AGO`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} HR${diffHr === 1 ? '' : 'S'} AGO`;
    const diffDay = Math.floor(diffHr / 24);
    return `${diffDay} DAY${diffDay === 1 ? '' : 'S'} AGO`;
};

// --- Top-list UI (period toggle + ranked rows) ----------------------------

const appleMusicSearch = (term) => `https://music.apple.com/search?term=${encodeURIComponent(term)}`;

const SubHead = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin: 1.3rem 0 0.5rem;
    color: var(--dim);
    letter-spacing: 0.06em;
`;

const Toggle = styled.div`
    display: inline-flex;
    border: 1px solid var(--dim);
    flex: 0 0 auto;
`;

const ToggleBtn = styled.button`
    background: ${({ $active }) => ($active ? 'var(--phosphor)' : 'transparent')};
    color: ${({ $active }) => ($active ? 'var(--bg)' : 'var(--dim)')};
    border: none;
    border-left: 1px solid var(--dim);
    font: inherit;
    font-size: 0.8em;
    letter-spacing: 0.08em;
    padding: 0.15rem 0.55rem;
    cursor: pointer;

    &:first-child {
        border-left: none;
    }

    &:hover, &:focus-visible {
        color: ${({ $active }) => ($active ? 'var(--bg)' : 'var(--phosphor)')};
        outline: none;
    }
`;

const PERIODS = [['week', 'WK'], ['month', 'MO'], ['year', 'YR']];

const PeriodToggle = ({ value, onChange }) => (
    <Toggle role="group" aria-label="time range">
        {PERIODS.map(([v, label]) => (
            <ToggleBtn key={v} type="button" $active={v === value} aria-pressed={v === value} onClick={() => onChange(v)}>
                {label}
            </ToggleBtn>
        ))}
    </Toggle>
);

PeriodToggle.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

// Page switcher for the Audio Log (Recently Played / Top Artists / Top Albums).
const Tabs = styled.div`
    display: flex;
    gap: 0.5rem;
    margin: 0.9rem 0 0.2rem;
    flex-wrap: wrap;
`;

const Tab = styled.button`
    background: ${({ $active }) => ($active ? 'var(--phosphor)' : 'transparent')};
    color: ${({ $active }) => ($active ? 'var(--bg)' : 'var(--phosphor)')};
    border: 1px solid ${({ $active }) => ($active ? 'var(--phosphor)' : 'var(--dim)')};
    font: inherit;
    letter-spacing: 0.06em;
    padding: 0.35rem 0.85rem;
    cursor: pointer;

    &:hover, &:focus-visible {
        border-color: var(--phosphor);
        outline: none;
    }
`;

const PERIOD_LABEL = { week: 'LAST 7 DAYS', month: 'LAST MONTH', year: 'LAST 12 MONTHS' };

const GameLogPanel = () => {
    const { games } = recreation;
    const [view, setView] = useState('recent'); // 'recent' | 'most'

    const recentRes = useRemoteData('/.netlify/functions/get-steam-games?type=recent');
    const mostRes = useRemoteData('/.netlify/functions/get-steam-games?type=most');

    const renderList = (res, mode) => {
        if (res.status === 'loading') return <StatusLine>QUERYING STEAM RELAY...</StatusLine>;
        const live = (res.status === 'ready' && res.data && Array.isArray(res.data.games)) ? res.data.games : [];
        if (res.status === 'ready' && live.length === 0) {
            return <StatusLine>{mode === 'most' ? 'NO PLAYTIME ON RECORD' : 'NO ACTIVITY IN THE LAST 14 DAYS'}</StatusLine>;
        }
        const offline = res.status === 'failed';
        const list = offline ? fallback.steam : live;
        return (
            <>
                {offline && <StatusLine>RELAY OFFLINE · LAST KNOWN ACTIVITY</StatusLine>}
                <FeedList>
                    {list.map((game, i) => (
                        <DetailRow key={game.appid || `g-${i}`}>
                            <RowLink
                                href={steamStoreUrl(game)}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${game.name} on Steam`}
                            >
                                <Cover $w={120} $h={56}>
                                    {game.header ? <img src={game.header} alt="" loading="lazy" /> : null}
                                </Cover>
                                <DetailText>
                                    <DetailName>{String(i + 1).padStart(2, '0')} · {game.name}</DetailName>
                                    {mode === 'recent' && game.hours2w != null ? (
                                        <DetailMeta>{game.hours2w} HRS · LAST 2 WEEKS</DetailMeta>
                                    ) : null}
                                    <DetailMeta>{game.hoursTotal} HRS · TOTAL</DetailMeta>
                                </DetailText>
                            </RowLink>
                        </DetailRow>
                    ))}
                </FeedList>
            </>
        );
    };

    return (
        <Panel className="full">
            <Title>{'// GAME LOG'}</Title>
            <SubLine><span>NOW PLAYING:</span> {games.nowPlaying}</SubLine>
            <Tabs role="tablist" aria-label="game log views">
                <Tab type="button" $active={view === 'recent'} aria-pressed={view === 'recent'} onClick={() => setView('recent')}>
                    RECENTLY PLAYED
                </Tab>
                <Tab type="button" $active={view === 'most'} aria-pressed={view === 'most'} onClick={() => setView('most')}>
                    MOST PLAYED
                </Tab>
            </Tabs>
            {view === 'recent' ? renderList(recentRes, 'recent') : renderList(mostRes, 'most')}
        </Panel>
    );
};

// De-dupe recently-played by artist+track (you replay songs), keeping order.
const dedupeTracks = (list) => {
    const seen = new Set();
    const out = [];
    list.forEach((t) => {
        const k = `${(t.artist || '').toLowerCase()}::${(t.name || '').toLowerCase()}`;
        if (seen.has(k)) return;
        seen.add(k);
        out.push(t);
    });
    return out;
};

const AudioLogPanel = () => {
    const { music } = recreation;
    const [view, setView] = useState('recent'); // 'recent' | 'artists' | 'albums'
    const [artistPeriod, setArtistPeriod] = useState('week');
    const [albumPeriod, setAlbumPeriod] = useState('week');

    const recent = useRemoteData('/.netlify/functions/get-recent-tracks');
    const artistsRes = useRemoteData(`/.netlify/functions/get-lastfm-tops?type=artists&period=${artistPeriod}`);
    const albumsRes = useRemoteData(`/.netlify/functions/get-lastfm-tops?type=albums&period=${albumPeriod}`);

    // Genres on top are sourced from the current top albums; fall back to the
    // curated list while the relay is loading or down.
    const albumGenres = (albumsRes.status === 'ready' && albumsRes.data && Array.isArray(albumsRes.data.genres))
        ? albumsRes.data.genres
        : [];
    const genres = albumGenres.length ? albumGenres : music.genres;

    // --- TOP ARTISTS ---
    const renderArtists = () => {
        if (artistsRes.status === 'loading') return <StatusLine>RANKING ARTISTS...</StatusLine>;
        if (artistsRes.status === 'failed') return <StatusLine>RELAY OFFLINE — TOP ARTISTS UNAVAILABLE</StatusLine>;
        const artists = (artistsRes.data && Array.isArray(artistsRes.data.artists)) ? artistsRes.data.artists : [];
        if (artists.length === 0) return <StatusLine>NO ARTIST DATA</StatusLine>;
        return (
            <FeedList>
                {artists.map((a, i) => (
                    <DetailRow key={`${a.name}-${i}`}>
                        <RowLink
                            href={appleMusicSearch(a.name)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${a.name} — open in Apple Music`}
                        >
                            <Cover $w={72} $h={72}>
                                {a.image ? <img src={a.image} alt="" loading="lazy" /> : null}
                            </Cover>
                            <DetailText>
                                <DetailName>{String(i + 1).padStart(2, '0')} · {a.name}</DetailName>
                                <DetailMeta>{a.playcount} PLAYS</DetailMeta>
                            </DetailText>
                        </RowLink>
                    </DetailRow>
                ))}
            </FeedList>
        );
    };

    // --- TOP ALBUMS ---
    const renderAlbums = () => {
        if (albumsRes.status === 'loading') return <StatusLine>RANKING ALBUMS...</StatusLine>;
        if (albumsRes.status === 'failed') return <StatusLine>RELAY OFFLINE — TOP ALBUMS UNAVAILABLE</StatusLine>;
        const albums = (albumsRes.data && Array.isArray(albumsRes.data.albums)) ? albumsRes.data.albums : [];
        if (albums.length === 0) return <StatusLine>NO ALBUM DATA</StatusLine>;
        return (
            <FeedList>
                {albums.map((al, i) => (
                    <DetailRow key={`${al.artist}-${al.name}-${i}`}>
                        <RowLink
                            href={appleMusicSearch(`${al.artist} ${al.name}`)}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${al.name} by ${al.artist} — open in Apple Music`}
                        >
                            <Cover $w={84} $h={84}>
                                {al.art ? <img src={al.art} alt="" loading="lazy" /> : null}
                            </Cover>
                            <DetailText>
                                <DetailName>{String(i + 1).padStart(2, '0')} · {al.name}</DetailName>
                                <DetailSub>{al.artist}</DetailSub>
                                <DetailMeta>{al.playcount} PLAYS</DetailMeta>
                            </DetailText>
                        </RowLink>
                    </DetailRow>
                ))}
            </FeedList>
        );
    };

    // --- RECENTLY PLAYED (deduped, capped at 10 to match the other tabs) ---
    const liveTracks = (recent.status === 'ready' && recent.data && Array.isArray(recent.data.tracks)) ? recent.data.tracks : [];
    const recentOffline = recent.status === 'failed';
    const recentTracks = dedupeTracks(recentOffline ? fallback.tracks : liveTracks).slice(0, 10);

    const renderRecent = () => {
        if (recent.status === 'loading') return <StatusLine>TUNING RECEIVER...</StatusLine>;
        if (recent.status === 'ready' && liveTracks.length === 0) return <StatusLine>NO TRACKS LOGGED</StatusLine>;
        return (
            <>
                {recentOffline && <StatusLine>RELAY OFFLINE · LAST KNOWN ROTATION</StatusLine>}
                <FeedList>
                    {recentTracks.map((track, i) => (
                        <DetailRow key={`${track.name}-${track.playedAt || 'live'}-${i}`}>
                            <RowLink
                                href={appleMusicSearch(`${track.artist} ${track.name}`)}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${track.name} by ${track.artist} — open in Apple Music`}
                            >
                                <Cover $w={88} $h={88}>
                                    {track.art ? <img src={track.art} alt="" loading="lazy" /> : null}
                                </Cover>
                                <DetailText>
                                    <DetailName>{track.name}</DetailName>
                                    <DetailSub>{track.artist}</DetailSub>
                                    {track.album ? <DetailMeta>{track.album}</DetailMeta> : null}
                                    <DetailMeta>
                                        {recentOffline ? 'ARCHIVED' : (track.nowPlaying ? 'NOW PLAYING' : relativeTime(track.playedAt))}
                                    </DetailMeta>
                                </DetailText>
                            </RowLink>
                        </DetailRow>
                    ))}
                </FeedList>
            </>
        );
    };

    return (
        <Panel className="full">
            <Title>{'// AUDIO LOG'}</Title>
            <SubLine><span>GENRES:</span> {genres.join(' · ')}</SubLine>

            <Tabs role="tablist" aria-label="audio log views">
                <Tab type="button" $active={view === 'recent'} aria-pressed={view === 'recent'} onClick={() => setView('recent')}>
                    RECENTLY PLAYED
                </Tab>
                <Tab type="button" $active={view === 'artists'} aria-pressed={view === 'artists'} onClick={() => setView('artists')}>
                    TOP ARTISTS
                </Tab>
                <Tab type="button" $active={view === 'albums'} aria-pressed={view === 'albums'} onClick={() => setView('albums')}>
                    TOP ALBUMS
                </Tab>
            </Tabs>

            {view === 'recent' && renderRecent()}

            {view === 'artists' && (
                <>
                    <SubHead>
                        <span>{PERIOD_LABEL[artistPeriod]}</span>
                        <PeriodToggle value={artistPeriod} onChange={setArtistPeriod} />
                    </SubHead>
                    {renderArtists()}
                </>
            )}

            {view === 'albums' && (
                <>
                    <SubHead>
                        <span>{PERIOD_LABEL[albumPeriod]}</span>
                        <PeriodToggle value={albumPeriod} onChange={setAlbumPeriod} />
                    </SubHead>
                    {renderAlbums()}
                </>
            )}
        </Panel>
    );
};

const SystemMonitor = () => {
    usePageMeta(
        'SUBJECT SURVEILLANCE',
        'Live surveillance feed: subject vitals, last known position, intercepted activity, and digital footprint.',
    );

    return (
        <ScreenFrame title="SUBJECT SURVEILLANCE">
            <Grid>
                <BiometricPanel />
                <GithubPanel />
                <LeetcodePanel />
                <GameLogPanel />
                <AudioLogPanel />
            </Grid>
        </ScreenFrame>
    );
};

export default SystemMonitor;
