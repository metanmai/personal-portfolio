import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import PhosphorImage from '../PhosphorImage/PhosphorImage.jsx';
import { recreation } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';
import { useRemoteData } from '../../hooks/useRemoteData.js';

const Section = styled.section`
    margin-bottom: 2.6rem;

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const SectionTitle = styled.h3`
    color: var(--dim);
    margin-bottom: 0.9rem;
    letter-spacing: 0.1em;
`;

const SubTitle = styled.h4`
    color: var(--dim);
    margin: 1.4rem 0 0.6rem;
    letter-spacing: 0.1em;
    font-weight: normal;
`;

const Line = styled.p`
    margin-bottom: 0.5rem;
`;

const Label = styled.span`
    color: var(--dim);
    letter-spacing: 0.06em;
`;

const List = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.4rem 0 0;
`;

const ListItem = styled.li`
    color: var(--phosphor);
    padding: 0.15rem 0;

    &::before {
        content: '> ';
        color: var(--dim);
    }
`;

const FeedList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0.4rem 0 0;
`;

const FeedRow = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    padding: 0.18rem 0;
    color: var(--phosphor);
`;

const FeedPrimary = styled.span`
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &::before {
        content: '${(props) => props.$marker || '>'} ';
        color: var(--dim);
    }
`;

const FeedMeta = styled.span`
    color: var(--dim);
    flex: 0 0 auto;
    letter-spacing: 0.04em;
    font-size: 0.9em;
`;

const StatusLine = styled.p`
    color: var(--dim);
    margin: 0.4rem 0 0;

    &::before {
        content: '> ';
    }
`;

const Blurb = styled.p`
    max-width: 70ch;
    margin-bottom: 1rem;
`;

const PhotoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.2rem;
`;

const Figure = styled.figure`
    margin: 0;
`;

const Caption = styled.figcaption`
    color: var(--dim);
    margin-top: 0.4rem;
    font-size: 0.85em;
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

const SteamFeed = () => {
    const { status, data } = useRemoteData('/.netlify/functions/get-steam-games');

    if (status === 'loading') {
        return <StatusLine>QUERYING STEAM RELAY...</StatusLine>;
    }
    if (status === 'failed') {
        return <StatusLine>SIGNAL LOST — STEAM RELAY UNREACHABLE</StatusLine>;
    }
    const games = (data && Array.isArray(data.games)) ? data.games : [];
    if (games.length === 0) {
        return <StatusLine>NO ACTIVITY LOGGED IN THE LAST 14 DAYS</StatusLine>;
    }
    return (
        <FeedList>
            {games.slice(0, 6).map((game) => (
                <FeedRow key={game.appid}>
                    <FeedPrimary $marker=">">{game.name}</FeedPrimary>
                    <FeedMeta>{game.hours2w} HRS / {game.hoursTotal} HRS TOTAL</FeedMeta>
                </FeedRow>
            ))}
        </FeedList>
    );
};

const TracksFeed = () => {
    const { status, data } = useRemoteData('/.netlify/functions/get-recent-tracks');

    if (status === 'loading') {
        return <StatusLine>TUNING RECEIVER...</StatusLine>;
    }
    if (status === 'failed') {
        return <StatusLine>SIGNAL LOST — AUDIO RELAY UNREACHABLE</StatusLine>;
    }
    const tracks = (data && Array.isArray(data.tracks)) ? data.tracks : [];
    if (tracks.length === 0) {
        return <StatusLine>NO TRACKS LOGGED</StatusLine>;
    }
    return (
        <FeedList>
            {tracks.slice(0, 8).map((track, index) => (
                <FeedRow key={`${track.name}-${track.playedAt || 'live'}-${index}`}>
                    <FeedPrimary $marker="▶">{track.name} — {track.artist}</FeedPrimary>
                    <FeedMeta>
                        {track.nowPlaying ? 'NOW PLAYING' : relativeTime(track.playedAt)}
                    </FeedMeta>
                </FeedRow>
            ))}
        </FeedList>
    );
};

const RecreationWing = () => {
    usePageMeta('RECREATION WING', 'Off-duty: games, music, photography, tinkering.');
    const { games, music, photography, tinkering } = recreation;

    return (
        <ScreenFrame title="RECREATION WING">
            <Blurb>{"SUBJECT'S RECORDED LEISURE PROTOCOLS. OBSERVED BEHAVIOR DURING OFF-DUTY CYCLES."}</Blurb>
            <Section>
                <SectionTitle>{'// GAME LOG'}</SectionTitle>
                <Line>
                    <Label>NOW PLAYING:</Label> {games.nowPlaying}
                </Line>
                <Line>
                    <Label>ALL-TIMERS:</Label>
                </Line>
                <List>
                    {games.allTimers.map((title, index) => (
                        <ListItem key={`${title}-${index}`}>{title}</ListItem>
                    ))}
                </List>
                <SubTitle>{'// FIELD ACTIVITY — LAST 14 DAYS'}</SubTitle>
                <SteamFeed />
            </Section>

            <Section>
                <SectionTitle>{'// AUDIO LOG'}</SectionTitle>
                <Line>
                    <Label>GENRES:</Label> {music.genres.join(' · ')}
                </Line>
                <Line>
                    <Label>ON ROTATION:</Label>
                </Line>
                <TracksFeed />
            </Section>

            <Section>
                <SectionTitle>{'// FIELD CAMERA'}</SectionTitle>
                <Blurb>{photography.blurb}</Blurb>
                <PhotoGrid>
                    {photography.shots.map((shot) => (
                        <Figure key={shot.src}>
                            <PhosphorImage src={shot.src} alt={shot.caption} />
                            <Caption>{shot.caption}</Caption>
                        </Figure>
                    ))}
                </PhotoGrid>
            </Section>

            <Section>
                <SectionTitle>{'// SIDE QUESTS'}</SectionTitle>
                <List>
                    {tinkering.map((item, index) => (
                        <ListItem key={`${item}-${index}`}>{item}</ListItem>
                    ))}
                </List>
            </Section>
        </ScreenFrame>
    );
};

export default RecreationWing;
