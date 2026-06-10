import { useEffect, useState } from 'react';

const format = () => new Date().toTimeString().slice(0, 8);

const useClock = () => {
    const [time, setTime] = useState(() => format());

    useEffect(() => {
        const id = setInterval(() => {
            setTime(format());
        }, 1000);
        return () => clearInterval(id);
    }, []);

    return time;
};

export { useClock };
