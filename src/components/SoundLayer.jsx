import { useEffect } from 'react';
import { useSettings } from '../settings.jsx';
import { useSound } from '../hooks/useSound.js';

// Mount once at the app root. Renders nothing — purely a side-effect host
// for global keydown/click sfx. (No ambient hum — discrete sounds only.)
const SoundLayer = () => {
    const ctx = useSettings();
    const sound = !!(ctx && ctx.settings && ctx.settings.sound);
    const { click, blip } = useSound();

    useEffect(() => {
        if (!sound) return undefined;

        const onKeyDown = (event) => {
            if (event.repeat) return;
            click();
        };

        const onClick = (event) => {
            const target = event.target;
            if (target && typeof target.closest === 'function' && target.closest('button, a')) {
                blip();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('click', onClick);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('click', onClick);
        };
    }, [sound, click, blip]);

    return null;
};

export default SoundLayer;
