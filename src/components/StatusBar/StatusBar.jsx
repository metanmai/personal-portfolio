import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { socials, menuItems } from '../../constants/index.js';
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
    /* safe-area insets keep the bar clear of browser toolbars / the home
       indicator on iOS Safari, Arc, etc. (zero on desktop) */
    padding: 0.25rem
        max(1rem, env(safe-area-inset-right, 0px))
        calc(0.25rem + env(safe-area-inset-bottom, 0px))
        max(1rem, env(safe-area-inset-left, 0px));
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: nowrap;
    overflow: hidden;
    text-shadow: none;

    @media (max-width: 600px) {
        gap: 0.4rem;
        font-size: 0.8em;
        padding: 0.25rem
            max(0.5rem, env(safe-area-inset-right, 0px))
            calc(0.25rem + env(safe-area-inset-bottom, 0px))
            max(0.5rem, env(safe-area-inset-left, 0px));
    }
`;

const Left = styled.span`
    flex: 1 1 0;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @media (max-width: 600px) {
        display: none;
    }
`;

const Center = styled.nav`
    display: flex;
    gap: 0.75rem;
    align-items: center;
    justify-content: center;
    flex: 0 0 auto;

    @media (max-width: 600px) {
        gap: 0.4rem;
    }
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

    @media (max-width: 600px) {
        gap: 0.4rem;
        flex: 0 0 auto;
    }
`;

const Clock = styled.span`
    @media (max-width: 600px) {
        display: none;
    }
`;

const Hints = styled.span`
    /* keyboard hints are meaningless on touch — hide below tablet width */
    @media (max-width: 900px) {
        display: none;
    }
`;

const LogoutButton = styled.button`
    font: inherit;
    font-size: 1em;
    background: none;
    border: none;
    color: var(--dim);
    cursor: pointer;
    padding: 0 0.25rem;
    text-shadow: none;
    white-space: nowrap;

    &:hover,
    &:focus-visible {
        background: var(--phosphor);
        color: var(--bg);
        outline: none;
    }
`;

const StatusBar = () => {
    const { pathname } = useLocation();
    const clock = useClock();

    const hint = pathname === '/'
        ? `[↑↓ 1-${menuItems.length}] SELECT`
        : '[ESC] MENU';

    const logout = () => {
        // hand off to the app-level shutdown animation, which clears the
        // session and reloads to the login stage when it finishes
        window.dispatchEvent(new Event('termlink-logout'));
    };

    return (
        <Bar>
            <Left>{pathname}</Left>
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
                <Hints>{hint}</Hints>
                <LogoutButton type="button" onClick={logout}>[LOGOUT]</LogoutButton>
                <Clock>{clock}</Clock>
            </Right>
        </Bar>
    );
};

export default StatusBar;
