import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
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

const EscToMenu = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const onKey = (event) => {
            if (event.key === 'Escape' && location.pathname !== '/') {
                navigate('/');
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate, location.pathname]);

    return null;
};

function App() {
    const [booted, setBooted] = useState(
        () => sessionStorage.getItem('termlink-booted') === 'true'
    );

    const handleBootDone = () => {
        sessionStorage.setItem('termlink-booted', 'true');
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
                    </Terminal>
                </BrowserRouter>
            )}
        </SettingsProvider>
    );
}

export default App;
