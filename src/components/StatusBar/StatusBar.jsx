import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { socials } from '../../constants/index.js';
import { useClock } from '../../hooks/useClock.js';

const Bar = styled.footer`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background: var(--bg);
    border-top: 1px solid var(--dim);
    color: var(--dim);
    font-size: 0.85em;
    padding: 0.25rem 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    text-shadow: none;
`;

const Left = styled.span`
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const Center = styled.nav`
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;
`;

const SocialLink = styled.a`
    color: var(--dim);
    text-decoration: none;
    padding: 0 0.25rem;

    &:hover,
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
    }
`;

const Right = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: flex-end;
    flex: 1 1 0;
`;

const Hints = styled.span`
    @media (max-width: 600px) {
        display: none;
    }
`;

const StatusBar = () => {
    const { pathname } = useLocation();
    const clock = useClock();

    return (
        <Bar>
            <Left>NORMAL · {pathname}</Left>
            <Center aria-label="External links">
                {socials.map(({ name, link }) => (
                    <SocialLink
                        key={name}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        [{name}]
                    </SocialLink>
                ))}
            </Center>
            <Right>
                <Hints>{'[ESC] MENU · [↑↓ 1-5] SELECT ·'}</Hints>
                <span>{clock}</span>
            </Right>
        </Bar>
    );
};

export default StatusBar;
