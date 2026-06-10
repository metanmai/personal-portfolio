import styled from 'styled-components';
import ScreenFrame from './ScreenFrame.jsx';
import PhosphorImage from '../PhosphorImage/PhosphorImage.jsx';
import { recreation } from '../../constants/index.js';
import { usePageMeta } from '../../hooks/usePageMeta.js';

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

const RecreationWing = () => {
    usePageMeta('RECREATION WING', 'Off-duty: games, music, photography, tinkering.');
    const { games, music, photography, tinkering } = recreation;

    return (
        <ScreenFrame title="RECREATION WING">
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
            </Section>

            <Section>
                <SectionTitle>{'// AUDIO LOG'}</SectionTitle>
                <Line>
                    <Label>GENRES:</Label> {music.genres.join(' · ')}
                </Line>
                <Line>
                    <Label>ON ROTATION:</Label>
                </Line>
                <List>
                    {music.currentRotation.map((track, index) => (
                        <ListItem key={`${track}-${index}`}>{track}</ListItem>
                    ))}
                </List>
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
