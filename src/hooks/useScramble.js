import { useEffect, useRef, useState } from 'react';

const GLITCH_CHARS = '▓▒░#%&@$+=*!?';

const randomGlitch = () => GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];

const buildFrame = (text, resolvedCount) => {
    let out = '';
    for (let i = 0; i < text.length; i += 1) {
        if (i < resolvedCount) {
            out += text[i];
        } else if (text[i] === ' ') {
            out += ' ';
        } else {
            out += randomGlitch();
        }
    }
    return out;
};

const useScramble = (text, durationMs = 450) => {
    const [display, setDisplay] = useState(() => {
        if (typeof window !== 'undefined'
            && window.matchMedia
            && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return text;
        }
        return buildFrame(text, 0);
    });
    const startRef = useRef(null);

    useEffect(() => {
        startRef.current = null;

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setDisplay(text);
            return undefined;
        }

        setDisplay(buildFrame(text, 0));

        let frame;
        const tick = (now) => {
            if (startRef.current === null) startRef.current = now;
            const progress = Math.min(1, (now - startRef.current) / durationMs);
            const resolved = Math.floor(progress * text.length);

            if (progress >= 1) {
                setDisplay(text);
                return;
            }

            setDisplay(buildFrame(text, resolved));
            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [text, durationMs]);

    return display;
};

export { useScramble };
