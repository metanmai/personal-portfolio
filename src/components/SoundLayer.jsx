import { useEffect } from 'react';
import { useSettings } from '../settings.jsx';
import { useSound } from '../hooks/useSound.js';

// Mount once at the app root. Renders nothing — purely a side-effect host
// for global keydown/click sfx and a barely-audible CRT hum.
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

        // CRT hum — barely-audible low sine
        let audio = null;
        let osc = null;
        let gain = null;
        try {
            const Ctor = window.AudioContext || window.webkitAudioContext;
            if (Ctor) {
                audio = new Ctor();
                if (audio.state === 'suspended' && typeof audio.resume === 'function') {
                    try { audio.resume(); } catch { /* ignore */ }
                }
                osc = audio.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = 55;
                gain = audio.createGain();
                gain.gain.value = 0.012;
                osc.connect(gain);
                gain.connect(audio.destination);
                osc.start();
            }
        } catch {
            audio = null;
            osc = null;
            gain = null;
        }

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('click', onClick);
            try {
                if (osc) {
                    osc.stop();
                    osc.disconnect();
                }
                if (gain) gain.disconnect();
                if (audio && typeof audio.close === 'function') audio.close();
            } catch {
                // ignore teardown failures
            }
        };
    }, [sound, click, blip]);

    return null;
};

export default SoundLayer;
