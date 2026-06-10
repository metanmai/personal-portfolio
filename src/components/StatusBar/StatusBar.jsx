import styled from 'styled-components';
import { useLocation } from 'react-router-dom';
import { socials, menuItems } from '../../constants/index.js';
import { useClock } from '../../hooks/useClock.js';
import { useSettings } from '../../settings.jsx';
import { playConfirmBlip } from '../../hooks/useSound.js';

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
    const { settings, update } = useSettings();

    const hint = pathname === '/'
        ? `[↑↓ 1-${menuItems.length}] SELECT`
        : '[ESC] MENU';

    const logout = () => {
        sessionStorage.removeItem('termlink-operator');
        // full reload lands on the login stage of the boot sequence
        window.location.assign('/');
    };

    const toggleSound = () => {
        const next = !settings.sound;
        update({ sound: next });
        // confirmation beep only when enabling — fires immediately so the
        // user hears feedback the instant they turn sound on
        if (next) {
            try { playConfirmBlip(); } catch { /* ignore */ }
        }
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
                <LogoutButton
                    type="button"
                    onClick={toggleSound}
                    aria-label="toggle sound"
                >
                    [♪ {settings.sound ? 'ON' : 'OFF'}]
                </LogoutButton>
                <LogoutButton type="button" onClick={logout}>[LOGOUT]</LogoutButton>
                <span>{clock}</span>
            </Right>
        </Bar>
    );
};

export default StatusBar;
