import { useCallback, useMemo } from 'react';
import { useSettings } from '../settings.jsx';

// Lazily-created singleton AudioContext. Browsers require a user gesture to
// instantiate one; every caller into this hook does so from an event handler.
let ctx = null;

const getCtx = () => {
    if (ctx) return ctx;
    try {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        ctx = new Ctor();
        return ctx;
    } catch {
        return null;
    }
};

const ensureRunning = (audio) => {
    try {
        if (audio.state === 'suspended' && typeof audio.resume === 'function') {
            audio.resume();
        }
    } catch {
        // ignore — we're best-effort
    }
};

const playClick = () => {
    const audio = getCtx();
    if (!audio) return;
    try {
        ensureRunning(audio);
        const now = audio.currentTime;
        const duration = 0.03; // 30ms
        const sampleRate = audio.sampleRate;
        const frameCount = Math.max(1, Math.floor(sampleRate * duration));
        const buffer = audio.createBuffer(1, frameCount, sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i += 1) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = audio.createBufferSource();
        source.buffer = buffer;

        const filter = audio.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 2200;
        filter.Q.value = 1.2;

        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        source.connect(filter);
        filter.connect(gain);
        gain.connect(audio.destination);
        source.start(now);
        source.stop(now + duration + 0.01);
    } catch {
        // never throw — sound is decorative
    }
};

const playBlip = () => {
    const audio = getCtx();
    if (!audio) return;
    try {
        ensureRunning(audio);
        const now = audio.currentTime;
        const duration = 0.06; // 60ms
        const osc = audio.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880, now);
        // slight downward pitch ramp
        osc.frequency.exponentialRampToValueAtTime(720, now + duration);

        const gain = audio.createGain();
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.06, now + 0.005);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(audio.destination);
        osc.start(now);
        osc.stop(now + duration + 0.01);
    } catch {
        // ignore
    }
};

// Force-play helpers exposed for the sound toggle itself, which needs to
// emit a confirmation beep at the exact moment the setting flips on (before
// the React tree re-renders with the new context value).
export const playConfirmBlip = playBlip;

export const useSound = () => {
    const ctxValue = useSettings();
    const enabled = !!(ctxValue && ctxValue.settings && ctxValue.settings.sound);

    const click = useCallback(() => {
        if (!enabled) return;
        playClick();
    }, [enabled]);

    const blip = useCallback(() => {
        if (!enabled) return;
        playBlip();
    }, [enabled]);

    return useMemo(() => ({ click, blip }), [click, blip]);
};
