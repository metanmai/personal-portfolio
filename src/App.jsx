import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { SettingsProvider } from './settings.jsx';
import Terminal from './components/Terminal/Terminal.jsx';
import MainMenu from './components/MainMenu/MainMenu.jsx';
import PersonnelFile from './components/screens/PersonnelFile.jsx';
import CareerDossier from './components/screens/CareerDossier.jsx';
import OpenComms from './components/screens/OpenComms.jsx';
import SystemMonitor from './components/screens/SystemMonitor.jsx';
import CommandPrompt from './components/CommandPrompt/CommandPrompt.jsx';
import SoundLayer from './components/SoundLayer.jsx';
import FileCorrupted from './components/screens/FileCorrupted.jsx';
import SystemFault from './components/SystemFault.jsx';
import BootSequence from './components/BootSequence/BootSequence.jsx';
import LogoutSequence from './components/LogoutSequence.jsx';
import StatusBar from './components/StatusBar/StatusBar.jsx';

const EscToMenu = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const onKey = (event) => {
            // read the path at event time — a closure over location.pathname
            // goes stale between navigation and effect re-registration
            if (event.key === 'Escape' && window.location.pathname !== '/') {
                navigate('/');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate]);

    return null;
};

const redraw = keyframes`
    from { clip-path: inset(0 0 100% 0); opacity: 0.4; }
    to { clip-path: inset(0 0 0% 0); opacity: 1; }
`;

const Redraw = styled.div`
    /* clear the fixed StatusBar, which itself grows by the safe-area inset */
    padding-bottom: calc(3rem + env(safe-area-inset-bottom, 0px));
    animation: ${redraw} 0.3s steps(12);

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

const RouteRedraw = ({ children }) => {
    const location = useLocation();
    return <Redraw key={location.pathname}>{children}</Redraw>;
};

RouteRedraw.propTypes = {
    children: PropTypes.node.isRequired,
};

const TerminalApp = () => {
    const [booted, setBooted] = useState(false);
    const [loggingOut, setLoggingOut] = useState(false);

    const handleBootDone = () => {
        // every login lands on the main menu, even from deep links —
        // rewrite the URL before BrowserRouter mounts and reads it
        window.history.replaceState(null, '', '/');
        setBooted(true);
    };

    // Logout is triggered from a couple of places (the status bar button and
    // the `logout` command). Both dispatch a window event so the shutdown
    // animation can play once, here, above the whole tree.
    useEffect(() => {
        const onLogout = () => setLoggingOut(true);
        window.addEventListener('termlink-logout', onLogout);
        return () => window.removeEventListener('termlink-logout', onLogout);
    }, []);

    const finishLogout = () => {
        try { sessionStorage.removeItem('termlink-operator'); } catch { /* noop */ }
        // full reload drops us back at the login stage of the boot sequence
        window.location.assign('/');
    };

    if (loggingOut) {
        return <LogoutSequence onDone={finishLogout} />;
    }

    if (!booted) {
        return <BootSequence onDone={handleBootDone} />;
    }

    return (
        <BrowserRouter>
            <Terminal>
                <EscToMenu />
                <RouteRedraw>
                    <SystemFault>
                        <Routes>
                            <Route path="/" element={<MainMenu />} />
                            <Route path="/personnel" element={<PersonnelFile />} />
                            <Route path="/career" element={<CareerDossier />} />
                            <Route path="/comms" element={<OpenComms />} />
                            <Route path="/monitor" element={<SystemMonitor />} />
                            <Route path="*" element={<FileCorrupted />} />
                        </Routes>
                    </SystemFault>
                </RouteRedraw>
                <StatusBar />
                <CommandPrompt />
            </Terminal>
        </BrowserRouter>
    );
};

function App() {
    return (
        <SettingsProvider>
            {/* mounted at the root so keystroke/click sfx + CRT hum are present
                on the login screen and during the logout animation too */}
            <SoundLayer />
            <TerminalApp />
        </SettingsProvider>
    );
}

export default App;
