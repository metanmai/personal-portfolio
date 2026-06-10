import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { applyTheme, DEFAULT_THEME } from './theme.js';

const STORAGE_KEY = 'termlink-settings';
// eslint-disable-next-line react-refresh/only-export-components
export const DEFAULT_SETTINGS = { theme: DEFAULT_THEME, sound: true };

const SettingsContext = createContext(null);

const loadSettings = () => {
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(loadSettings);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        applyTheme(settings.theme);
    }, [settings]);

    const update = useCallback((patch) => setSettings((prev) => ({ ...prev, ...patch })), []);

    const value = useMemo(() => ({ settings, update }), [settings, update]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

SettingsProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => useContext(SettingsContext);
