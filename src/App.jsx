import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { SettingsProvider } from './settings.jsx';
import Terminal from './components/Terminal/Terminal.jsx';
import MainMenu from './components/MainMenu/MainMenu.jsx';
import PersonnelFile from './components/screens/PersonnelFile.jsx';
import ProjectArchives from './components/screens/ProjectArchives.jsx';
import Commendations from './components/screens/Commendations.jsx';
import OpenComms from './components/screens/OpenComms.jsx';
import Calibration from './components/screens/Calibration.jsx';
import FileCorrupted from './components/screens/FileCorrupted.jsx';
import SystemFault from './components/SystemFault.jsx';
import BootSequence from './components/BootSequence/BootSequence.jsx';
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
    padding-bottom: 3rem; /* clear the fixed StatusBar */
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

function App() {
    const [booted, setBooted] = useState(false);

    const handleBootDone = () => {
        setBooted(true);
    };

    return (
        <SettingsProvider>
            {!booted ? (
                <BootSequence onDone={handleBootDone} />
            ) : (
                <BrowserRouter>
                    <Terminal>
                        <EscToMenu />
                        <RouteRedraw>
                            <SystemFault>
                                <Routes>
                                    <Route path="/" element={<MainMenu />} />
                                    <Route path="/personnel" element={<PersonnelFile />} />
                                    <Route path="/archives" element={<ProjectArchives />} />
                                    <Route path="/commendations" element={<Commendations />} />
                                    <Route path="/comms" element={<OpenComms />} />
                                    <Route path="/calibration" element={<Calibration />} />
                                    <Route path="*" element={<FileCorrupted />} />
                                </Routes>
                            </SystemFault>
                        </RouteRedraw>
                        <StatusBar />
                    </Terminal>
                </BrowserRouter>
            )}
        </SettingsProvider>
    );
}

export default App;
