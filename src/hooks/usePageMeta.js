import { useEffect } from 'react';

const usePageMeta = (title, description) => {
    useEffect(() => {
        document.title = `${title} — TANMAI NIRANJAN TERMLINK`;
        if (description) {
            const meta = document.querySelector('meta[name="description"]');
            if (meta) meta.setAttribute('content', description);
        }
    }, [title, description]);
};

export { usePageMeta };
